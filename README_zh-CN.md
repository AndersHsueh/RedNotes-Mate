# RedNotes Mate

<p align="center">
  <strong>小红书AI智能发布助手</strong>
</p>

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_zh-CN.md">简体中文</a> |
  <a href="./README_ja-JP.md">日本語</a> |
  <a href="./README_ko-KR.md">한국어</a> |
  <a href="./README_fr-FR.md">Français</a> |
  <a href="./README_es-ES.md">Español</a>
</p>

## 项目概述

RedNotes Mate是一个专门为小红书笔记自动化发布而设计的AI助手平台，通过将xiaohongshu-mcp服务集成到AionUi中，提供一个完整的从内容生成到发布的自动化解决方案。

## 核心功能

### 1. 服务集成
- xiaohongshu-mcp作为后台服务与AionUi同步启动/关闭
- 自动化进程管理，无需手动启动MCP服务
- 生命周期管理，确保服务同步

### 2. 内容创作AI助手
- 集成内容创作功能，智能生成小红书笔记内容
- 支持多模型切换，优化内容生成质量
- 智能标签和话题推荐

### 3. 发布自动化
- 一键发布图文/视频内容
- 定时发布功能
- 发布状态监控和反馈

### 4. 账号管理
- 小红书账号登录状态管理
- 多账号支持
- Cookie管理和持久化

### 5. 智能交互
- 搜索小红书内容
- 互动功能（点赞、评论、收藏）
- 用户数据分析

## 技术架构

```
┌─────────────────┐
│   AionUi GUI    │ ← 用户交互层
├─────────────────┤
│  MCP Bridge     │ ← 协议适配层
├─────────────────┤
│ xiaohongshu-mcp │ ← 小红书服务层
└─────────────────┘
```

### 进程管理
- 主进程：AionUi (Electron)
- 子进程：xiaohongshu-mcp (Go应用)
- 通信协议：HTTP MCP

## 安装

### 系统要求
- Node.js 18+
- npm 或 yarn
- Chrome/Chromium 浏览器（用于xiaohongshu-mcp）

### 安装步骤

1. 克隆仓库：
```bash
git clone https://github.com/AndersHsueh/RedNotes-Mate.git
cd RedNotes-Mate
```

2. 安装依赖：
```bash
cd aionui
npm install
```

3. 启动应用：
```bash
npm start
```

## 项目结构

```
RedNotes-Mate/
├── aionui/                    # AionUi源码（已修改）
│   ├── src/
│   │   ├── rednotes/          # RedNotes集成模块
│   │   │   ├── serviceManager.ts
│   │   │   ├── mcpBridge.ts
│   │   │   └── config.ts
│   │   └── ...
│   └── ...
├── xiaohongshu-mcp/           # xiaohongshu-mcp二进制文件
│   ├── macos-amd64/
│   ├── macos-arm64/
│   ├── windows-amd64/
│   ├── linux-amd64/
│   └── linux-arm64/
├── resources/                  # 资源文件
│   ├── icons/
│   ├── configs/
│   └── prompts/
├── Doc4AI/                     # 开发文档
└── README.md
```

## 多语言支持

RedNotes Mate支持6种语言：
- 英语 (en-US)
- 简体中文 (zh-CN)
- 日语 (ja-JP)
- 韩语 (ko-KR)
- 法语 (fr-FR)
- 西班牙语 (es-ES)

可以在 设置 → 系统 → 语言 中更改语言。

## 开发

详细的开发说明请参阅[开发指南](./Doc4AI/RedNotes_Mate_dev_guide.md)。

## 许可证

本项目采用MIT许可证 - 详见[LICENSE](./aionui/LICENSE)文件。

## 相关项目

- [AionUi](https://github.com/AndersHsueh/AionUi) - 基础GUI应用
- [xiaohongshu-mcp](https://github.com/AndersHsueh/xiaohongshu-mcp) - 小红书MCP服务
