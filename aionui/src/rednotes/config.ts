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
        port: 18060,
      },
      ai: {
        modelProvider: 'gemini',
        apiKey: '',
      },
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
