# RedNotes Mate

<p align="center">
  <strong>小紅書（Xiaohongshu）のためのAI搭載パブリッシングアシスタント</strong>
</p>

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_zh-CN.md">简体中文</a> |
  <a href="./README_ja-JP.md">日本語</a> |
  <a href="./README_ko-KR.md">한국어</a> |
  <a href="./README_fr-FR.md">Français</a> |
  <a href="./README_es-ES.md">Español</a>
</p>

## 概要

RedNotes Mateは、小紅書（Xiaohongshu/RedNotes）のコンテンツ投稿を自動化するために設計されたAIアシスタントプラットフォームです。xiaohongshu-mcpサービスをAionUiに統合することで、コンテンツ生成から投稿までの完全な自動化ソリューションを提供します。

## 機能

### 1. サービス統合
- xiaohongshu-mcpはバックエンドサービスとして実行され、AionUiの起動/シャットダウンと同期
- 自動プロセス管理、MCPサービスを手動で起動する必要なし
- ライフサイクル管理でサービスの同期を確保

### 2. AIコンテンツアシスタント
- インテリジェントな小紅書ノート生成機能を統合
- コンテンツ生成品質最適化のためのマルチモデル切り替え
- スマートタグとトピック推奨

### 3. 投稿自動化
- 画像/動画コンテンツのワンクリック投稿
- 予約投稿機能
- 投稿ステータスの監視とフィードバック

### 4. アカウント管理
- 小紅書アカウントのログイン状態管理
- マルチアカウントサポート
- Cookie管理と永続化

### 5. スマートインタラクション
- 小紅書コンテンツの検索
- エンゲージメント機能（いいね、コメント、お気に入り）
- ユーザーデータ分析

## 技術アーキテクチャ

```
┌─────────────────┐
│   AionUi GUI    │ ← ユーザーインタラクション層
├─────────────────┤
│  MCP Bridge     │ ← プロトコル適応層
├─────────────────┤
│ xiaohongshu-mcp │ ← 小紅書サービス層
└─────────────────┘
```

### プロセス管理
- メインプロセス：AionUi（Electron）
- 子プロセス：xiaohongshu-mcp（Goアプリケーション）
- 通信プロトコル：HTTP MCP

## インストール

### 前提条件
- Node.js 18以上
- npm または yarn
- Chrome/Chromiumブラウザ（xiaohongshu-mcp用）

### セットアップ

1. リポジトリのクローン：
```bash
git clone https://github.com/AndersHsueh/RedNotes-Mate.git
cd RedNotes-Mate
```

2. 依存関係のインストール：
```bash
cd aionui
npm install
```

3. アプリケーションの起動：
```bash
npm start
```

## プロジェクト構造

```
RedNotes-Mate/
├── aionui/                    # AionUiソースコード（変更済み）
│   ├── src/
│   │   ├── rednotes/          # RedNotes統合モジュール
│   │   │   ├── serviceManager.ts
│   │   │   ├── mcpBridge.ts
│   │   │   └── config.ts
│   │   └── ...
│   └── ...
├── xiaohongshu-mcp/           # xiaohongshu-mcpバイナリ
│   ├── macos-amd64/
│   ├── macos-arm64/
│   ├── windows-amd64/
│   ├── linux-amd64/
│   └── linux-arm64/
├── resources/                  # リソースファイル
│   ├── icons/
│   ├── configs/
│   └── prompts/
├── Doc4AI/                     # 開発ドキュメント
└── README.md
```

## 多言語サポート

RedNotes Mateは6言語をサポート：
- 英語 (en-US)
- 簡体字中国語 (zh-CN)
- 日本語 (ja-JP)
- 韓国語 (ko-KR)
- フランス語 (fr-FR)
- スペイン語 (es-ES)

設定 → システム → 言語 で言語を変更できます。

## 開発

詳細な開発手順は[開発ガイド](./Doc4AI/RedNotes_Mate_dev_guide.md)をご覧ください。

## ライセンス

このプロジェクトはMITライセンスの下でライセンスされています - 詳細は[LICENSE](./aionui/LICENSE)ファイルをご覧ください。

## 関連プロジェクト

- [AionUi](https://github.com/AndersHsueh/AionUi) - ベースGUIアプリケーション
- [xiaohongshu-mcp](https://github.com/AndersHsueh/xiaohongshu-mcp) - 小紅書MCPサービス
