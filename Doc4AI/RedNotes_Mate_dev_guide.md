# RedNotes Mate 开发指导

## 项目概述

RedNotes Mate是一个专门为小红书笔记自动化发布而设计的AI助手平台，通过将xiaohongshu-mcp服务集成到AionUi中，提供一个完整的从内容生成到发布的自动化解决方案。

## 技术架构

- **主应用**：基于AionUi (Electron应用，TypeScript/React)
- **小红书服务**：xiaohongshu-mcp (Go应用，HTTP MCP服务器)
- **通信协议**：MCP (Model Context Protocol)
- **进程管理**：Electron child_process管理Go应用进程

## 项目结构

```
RedNotesMate/
├── package.json                 # 项目配置
├── README.md                    # 项目说明
├── LICENSE                      # 许可证
├── scripts/                     # 构建和部署脚本
│   ├── build-all.js            # 全平台构建脚本
│   ├── install-dependencies.js # 依赖安装脚本
│   └── start-services.js       # 服务启动脚本
├── aionui/                      # AionUi源码副本（已修改）
│   ├── package.json
│   ├── src/
│   └── ...
├── xiaohongshu-mcp/            # xiaohongshu-mcp二进制文件
│   ├── macos-amd64/
│   │   └── xiaohongshu-mcp
│   ├── macos-arm64/
│   │   └── xiaohongshu-mcp
│   ├── windows-amd64/
│   │   └── xiaohongshu-mcp.exe
│   ├── linux-amd64/
│   │   └── xiaohongshu-mcp
│   └── linux-arm64/
│       └── xiaohongshu-mcp
├── resources/                   # 资源文件
│   ├── icons/                  # 应用图标
│   ├── configs/                # 配置模板
│   └── prompts/                # 预设提示词
├── installer/                   # 安装脚本
│   ├── macos/
│   ├── windows/
│   └── linux/
├── dist/                        # 构建输出目录
└── docs/                        # 文档
```

## 开发流程

### 1. 环境准备

1. **从AionUi源码复制文件**
   - 源码路径：`/Users/xueyuheng/research/AionUi`
   - 源码GIT仓库: `https://github.com/AndersHsueh/AionUi.git`
   - 复制到项目目录：`RedNotesMate/aionui/`
   - 保留原有的package.json、src目录等

2. **集成xiaohongshu-mcp功能**
   - 源码路径：`/Users/xueyuheng/workspace/xiaohongshu-mcp`
   - 源码路径: `https://github.com/AndersHsueh/xiaohongshu-mcp.git`
   - 需要编译Go程序并放置到相应平台目录

3. **安装依赖**
   ```bash
   cd aionui
   npm install
   ```

### 2. 核心功能开发

#### 2.1 服务管理模块开发

在`aionui/src/rednotes/serviceManager.ts`中实现：

```typescript
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export class RedNotesServiceManager {
  private xiaohongshuProcess: ChildProcess | null = null;
  private serviceReady: boolean = false;

  constructor() {}

  /**
   * 根据当前平台获取xiaohongshu-mcp二进制文件路径
   */
  getServicePath(): string {
    const platform = process.platform;
    const arch = process.arch;

    // 根据当前平台选择正确的二进制文件
    const basePath = path.join(__dirname, '../../xiaohongshu-mcp');

    switch(platform) {
      case 'darwin': // macOS
        if (arch === 'arm64') {
          return path.join(basePath, 'macos-arm64/xiaohongshu-mcp');
        } else {
          return path.join(basePath, 'macos-amd64/xiaohongshu-mcp');
        }
      case 'win32': // Windows
        return path.join(basePath, 'windows-amd64/xiaohongshu-mcp.exe');
      case 'linux': // Linux
        if (arch === 'arm64') {
          return path.join(basePath, 'linux-arm64/xiaohongshu-mcp');
        } else {
          return path.join(basePath, 'linux-amd64/xiaohongshu-mcp');
        }
      default:
        throw new Error(`Unsupported platform: ${platform}-${arch}`);
    }
  }

  /**
   * 启动xiaohongshu-mcp服务
   */
  async startServices(): Promise<boolean> {
    try {
      // 获取服务路径
      const servicePath = this.getServicePath();

      // 验证文件存在性和可执行性
      if (!fs.existsSync(servicePath)) {
        throw new Error(`Service binary not found: ${servicePath}`);
      }

      // 对于非Windows系统，确保文件具有执行权限
      if (process.platform !== 'win32') {
        fs.chmodSync(servicePath, 0o755);
      }

      // 启动xiaohongshu-mcp进程
      this.xiaohongshuProcess = spawn(servicePath, [
        '-headless=true', // 默认无头模式
        '-port=:18060'
      ], {
        stdio: ['pipe', 'pipe', 'pipe'],
        detached: false
      });

      // 监听服务输出
      this.xiaohongshuProcess.stdout?.on('data', (data) => {
        console.log(`[xiaohongshu-mcp] ${data.toString()}`);
      });

      this.xiaohongshuProcess.stderr?.on('data', (data) => {
        console.error(`[xiaohongshu-mcp ERROR] ${data.toString()}`);
      });

      // 监听进程退出
      this.xiaohongshuProcess.on('exit', (code, signal) => {
        console.log(`xiaohongshu-mcp exited with code ${code} and signal ${signal}`);
        this.serviceReady = false;
      });

      // 等待服务就绪
      await this.waitForServiceReady();

      console.log('xiaohongshu-mcp service started successfully');
      this.serviceReady = true;
      return true;

    } catch (error) {
      console.error('Failed to start xiaohongshu-mcp service:', error);
      return false;
    }
  }

  /**
   * 等待服务就绪（通过HTTP健康检查）
   */
  private async waitForServiceReady(timeout: number = 30000): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await this.isServiceHealthy()) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    throw new Error('xiaohongshu-mcp service did not become ready within timeout');
  }

  /**
   * 检查服务健康状态
   */
  private async isServiceHealthy(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:18060/health');
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * 停止所有服务
   */
  async stopServices(): Promise<void> {
    if (this.xiaohongshuProcess) {
      this.xiaohongshuProcess.kill();
      this.xiaohongshuProcess = null;
    }
    this.serviceReady = false;
  }

  /**
   * 检查服务是否就绪
   */
  isReady(): boolean {
    return this.serviceReady;
  }
}
```

#### 2.2 MCP桥接模块开发

在`aionui/src/rednotes/mcpBridge.ts`中实现：

```typescript
import axios from 'axios';

export class RedNotesMCPBridge {
  private readonly mcpEndpoint = 'http://localhost:18060/mcp';

  /**
   * 调用MCP工具
   */
  async callMCPTool(method: string, params: any): Promise<any> {
    const requestBody = {
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: Date.now()
    };

    try {
      const response = await axios.post(this.mcpEndpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return response.data;
    } catch (error) {
      console.error(`MCP call failed for method ${method}:`, error);
      throw error;
    }
  }

  /**
   * 检查登录状态
   */
  async checkLoginStatus(): Promise<any> {
    return this.callMCPTool('check_login_status', {});
  }

  /**
   * 发布图文内容
   */
  async publishContent(title: string, content: string, images: string[], tags?: string[]): Promise<any> {
    const params = {
      title,
      content,
      images,
      tags: tags || []
    };

    return this.callMCPTool('publish_content', params);
  }

  /**
   * 获取推荐列表
   */
  async getRecommendations(): Promise<any> {
    return this.callMCPTool('list_feeds', {});
  }

  /**
   * 搜索内容
   */
  async search(keyword: string): Promise<any> {
    const params = { keyword };
    return this.callMCPTool('search_feeds', params);
  }
}
```

#### 2.3 配置管理模块开发

在`aionui/src/rednotes/config.ts`中实现：

```typescript
import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';

export interface RedNotesConfig {
  xiaohongshu: {
    headless: boolean;
    port: number;
    browserPath?: string;
  };
  ai: {
    modelProvider: string;
    apiKey: string;
  };
}

export class ConfigManager {
  private configPath: string;
  private config: RedNotesConfig;

  constructor() {
    const userDataPath = app.getPath('userData');
    this.configPath = path.join(userDataPath, 'rednotes-config.json');
    this.config = this.loadConfig();
  }

  private loadConfig(): RedNotesConfig {
    if (fs.existsSync(this.configPath)) {
      try {
        return JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
      } catch (error) {
        console.error('Failed to load config, using defaults:', error);
      }
    }

    // 默认配置
    return {
      xiaohongshu: {
        headless: true,
        port: 18060
      },
      ai: {
        modelProvider: 'gemini',
        apiKey: ''
      }
    };
  }

  getConfig(): RedNotesConfig {
    return this.config;
  }

  updateConfig(newConfig: Partial<RedNotesConfig>): void {
    this.config = { ...this.config, ...newConfig };
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
  }

  getXiaohongshuConfig(): RedNotesConfig['xiaohongshu'] {
    return this.config.xiaohongshu;
  }

  getAIConfig(): RedNotesConfig['ai'] {
    return this.config.ai;
  }
}
```

#### 2.4 主入口集成

修改`aionui/src/index.ts`，添加RedNotes相关初始化：

```typescript
// 在原文件基础上添加
import { RedNotesServiceManager } from './rednotes/serviceManager';
import { ConfigManager } from './rednotes/config';

// 创建服务管理器实例
const redNotesServiceManager = new RedNotesServiceManager();

// 在handleAppReady函数中集成服务启动
const handleAppReady = async (): Promise<void> => {
  try {
    // 首先初始化原有流程
    await initializeProcess();

    // 然后启动RedNotes服务
    console.log('Starting RedNotes services...');
    const servicesStarted = await redNotesServiceManager.startServices();

    if (!servicesStarted) {
      console.error('Failed to start RedNotes services');
      // 根据需要决定是否继续启动应用
    } else {
      console.log('RedNotes services started successfully');
    }

    // 其他原有逻辑...
  } catch (error) {
    console.error('Failed to initialize application:', error);
    app.exit(1);
    return;
  }

  // 其余原有代码...
};

// 在应用退出时停止服务
app.on('before-quit', () => {
  // 停止RedNotes服务
  void redNotesServiceManager.stopServices();

  // 清理原有工作进程
  WorkerManage.clear();
});
```

### 3. 预设提示词开发

在`resources/prompts/`目录下创建预设提示词：

**`resources/prompts/xiaohongshu-content-generation.txt`**:
```
你是一位专业的小红书内容策划师，擅长创作吸引人的笔记内容。请注意：

1. 小红书标题限制：最多20个字（约40个单位长度）
2. 正文限制：最多1000字
3. 内容风格：轻松、实用、有吸引力
4. 标签建议：提供相关的话题标签

请根据用户提供的主题或关键词，生成符合小红书平台特色的内容。
```

**`resources/prompts/xiaohongshu-seo-optimization.txt`**:
```
你是一位小红书SEO优化专家，熟悉平台算法和用户偏好。

请为用户提供以下优化建议：
1. 标题优化：确保在字数限制内，包含热门关键词
2. 内容结构：段落清晰，重点突出
3. 标签策略：提供高热度相关标签
4. 发布时机：建议最佳发布时间
```

## 测试流程

**重要：在提交代码前必须完成以下所有测试**

### 3.1 单元测试

1. **服务管理测试**
   ```bash
   npm run test -- --testPathPattern=serviceManager.test.ts
   ```

   测试要点：
   - 验证getServicePath在不同平台返回正确路径
   - 测试服务启动和停止功能
   - 模拟服务启动失败场景

2. **MCP桥接测试**
   ```bash
   npm run test -- --testPathPattern=mcpBridge.test.ts
   ```

   测试要点：
   - 验证MCP调用正常工作
   - 测试错误处理
   - 模拟网络故障场景

3. **配置管理测试**
   ```bash
   npm run test -- --testPathPattern=config.test.ts
   ```

   测试要点：
   - 配置文件的读取和保存
   - 默认配置生成
   - 配置更新功能

### 3.2 集成测试

1. **服务启动集成测试**
   - 验证xiaohongshu-mcp服务能够正确启动
   - 验证MCP端点可访问
   - 测试服务就绪检测

2. **功能集成测试**
   - 测试登录状态检查功能
   - 测试内容发布流程
   - 测试搜索功能

3. **UI集成测试**
   - 验证服务状态在UI中正确显示
   - 测试用户操作触发后端功能

### 3.3 端到端测试

1. **全流程测试**
   - 从应用启动到功能使用
   - 验证应用正常关闭时服务正确停止
   - 测试异常情况处理

2. **跨平台测试**
   - 在目标平台（macOS/Windows/Linux）验证功能
   - 测试二进制文件权限和执行
   - 验证安装和卸载流程

### 3.4 性能测试

1. **资源占用测试**
   - 监控内存使用情况
   - 检查CPU使用率
   - 验证长时间运行稳定性

2. **并发测试**
   - 测试多用户/多会话场景
   - 验证服务稳定性

## 构建和部署测试

### 4.1 本地构建测试

```bash
# 构建应用
npm run dist
```

验证要点：
- 构建过程无错误
- 所有平台二进制文件包含在内
- 安装包可正常安装

### 4.2 安装测试

- 在目标平台安装应用
- 验证安装后功能正常
- 测试卸载功能

## 提交前检查清单

**在提交任何代码更改之前，必须完成以下检查：**

- [ ] **代码质量**：代码已按项目规范编写
- [ ] **单元测试**：所有单元测试通过
- [ ] **集成测试**：核心功能集成测试通过
- [ ] **端到端测试**：关键工作流程测试通过
- [ ] **性能测试**：无明显性能下降
- [ ] **错误处理**：所有异常情况得到适当处理
- [ ] **文档更新**：相关文档已更新
- [ ] **代码审查**：代码逻辑清晰，注释完整

**只有完成以上所有检查后，才能进行代码提交！**

## 调试和故障排除

### 常见问题

1. **服务启动失败**
   - 检查二进制文件权限
   - 确认端口未被占用
   - 验证依赖项完整性

2. **MCP通信失败**
   - 检查服务是否正常运行
   - 验证网络连接
   - 确认MCP端点配置

3. **平台兼容性问题**
   - 验证二进制文件路径
   - 检查平台特定配置