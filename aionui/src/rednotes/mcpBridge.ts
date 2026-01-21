import axios from 'axios';

export class RedNotesMCPBridge {
  private readonly mcpEndpoint = 'http://localhost:18060/mcp';

  /**
   * 调用MCP工具
   */
  async callMCPTool(method: string, params: Record<string, unknown>): Promise<unknown> {
    const requestBody = {
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: Date.now(),
    };

    try {
      const response = await axios.post(this.mcpEndpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
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
  async checkLoginStatus(): Promise<unknown> {
    return this.callMCPTool('check_login_status', {});
  }

  /**
   * 发布图文内容
   */
  async publishContent(
    title: string,
    content: string,
    images: string[],
    tags?: string[]
  ): Promise<unknown> {
    const params = {
      title,
      content,
      images,
      tags: tags || [],
    };

    return this.callMCPTool('publish_content', params);
  }

  /**
   * 获取推荐列表
   */
  async getRecommendations(): Promise<unknown> {
    return this.callMCPTool('list_feeds', {});
  }

  /**
   * 搜索内容
   */
  async search(keyword: string): Promise<unknown> {
    const params = { keyword };
    return this.callMCPTool('search_feeds', params);
  }
}
