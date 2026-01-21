# RedNotes Mate

<p align="center">
  <strong>AI-Powered Publishing Assistant for Xiaohongshu (RedNotes)</strong>
</p>

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_zh-CN.md">简体中文</a> |
  <a href="./README_ja-JP.md">日本語</a> |
  <a href="./README_ko-KR.md">한국어</a> |
  <a href="./README_fr-FR.md">Français</a> |
  <a href="./README_es-ES.md">Español</a>
</p>

## Overview

RedNotes Mate is an AI assistant platform designed specifically for automating Xiaohongshu (RedNotes) content publishing. By integrating the xiaohongshu-mcp service with AionUi, it provides a complete automated solution from content generation to publishing.

## Features

### 1. Service Integration
- xiaohongshu-mcp runs as a backend service, synchronized with AionUi startup/shutdown
- Automated process management, no need to manually start MCP service
- Lifecycle management ensures service synchronization

### 2. AI Content Assistant
- Integrated content creation with intelligent Xiaohongshu note generation
- Multi-model switching for optimized content generation quality
- Smart tags and topic recommendations

### 3. Publishing Automation
- One-click publishing for image/video content
- Scheduled publishing feature
- Publishing status monitoring and feedback

### 4. Account Management
- Xiaohongshu account login status management
- Multi-account support
- Cookie management and persistence

### 5. Smart Interaction
- Search Xiaohongshu content
- Engagement features (likes, comments, favorites)
- User data analytics

## Technical Architecture

```
┌─────────────────┐
│   AionUi GUI    │ ← User interaction layer
├─────────────────┤
│  MCP Bridge     │ ← Protocol adaptation layer
├─────────────────┤
│ xiaohongshu-mcp │ ← Xiaohongshu service layer
└─────────────────┘
```

### Process Management
- Main process: AionUi (Electron)
- Child process: xiaohongshu-mcp (Go application)
- Communication protocol: HTTP MCP

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Chrome/Chromium browser (for xiaohongshu-mcp)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/AndersHsueh/RedNotes-Mate.git
cd RedNotes-Mate
```

2. Install dependencies:
```bash
cd aionui
npm install
```

3. Start the application:
```bash
npm start
```

## Project Structure

```
RedNotes-Mate/
├── aionui/                    # AionUi source code (modified)
│   ├── src/
│   │   ├── rednotes/          # RedNotes integration modules
│   │   │   ├── serviceManager.ts
│   │   │   ├── mcpBridge.ts
│   │   │   └── config.ts
│   │   └── ...
│   └── ...
├── xiaohongshu-mcp/           # xiaohongshu-mcp binaries
│   ├── macos-amd64/
│   ├── macos-arm64/
│   ├── windows-amd64/
│   ├── linux-amd64/
│   └── linux-arm64/
├── resources/                  # Resource files
│   ├── icons/
│   ├── configs/
│   └── prompts/
├── Doc4AI/                     # Development documentation
└── README.md
```

## i18n Support

RedNotes Mate supports 6 languages:
- English (en-US)
- Simplified Chinese (zh-CN)
- Japanese (ja-JP)
- Korean (ko-KR)
- French (fr-FR)
- Spanish (es-ES)

Language can be changed in Settings → System → Language.

## Development

See the [Development Guide](./Doc4AI/RedNotes_Mate_dev_guide.md) for detailed development instructions.

## License

This project is licensed under the MIT License - see the [LICENSE](./aionui/LICENSE) file for details.

## Related Projects

- [AionUi](https://github.com/AndersHsueh/AionUi) - The base GUI application
- [xiaohongshu-mcp](https://github.com/AndersHsueh/xiaohongshu-mcp) - Xiaohongshu MCP service
