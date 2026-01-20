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

    switch (platform) {
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
      this.xiaohongshuProcess = spawn(
        servicePath,
        ['-headless=true', '-port=:18060'],
        {
          stdio: ['pipe', 'pipe', 'pipe'],
          detached: false,
        }
      );

      // 监听服务输出
      this.xiaohongshuProcess.stdout?.on('data', (data) => {
        console.log(`[xiaohongshu-mcp] ${data.toString()}`);
      });

      this.xiaohongshuProcess.stderr?.on('data', (data) => {
        console.error(`[xiaohongshu-mcp ERROR] ${data.toString()}`);
      });

      // 监听进程退出
      this.xiaohongshuProcess.on('exit', (code, signal) => {
        console.log(
          `xiaohongshu-mcp exited with code ${code} and signal ${signal}`
        );
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error(
      'xiaohongshu-mcp service did not become ready within timeout'
    );
  }

  /**
   * 检查服务健康状态
   */
  private async isServiceHealthy(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:18060/health');
      return response.ok;
    } catch {
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
