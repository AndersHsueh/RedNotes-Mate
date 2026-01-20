# RedNotes Mate

<p align="center">
  <strong>샤오홍슈(Xiaohongshu)를 위한 AI 게시 어시스턴트</strong>
</p>

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_zh-CN.md">简体中文</a> |
  <a href="./README_ja-JP.md">日本語</a> |
  <a href="./README_ko-KR.md">한국어</a> |
  <a href="./README_fr-FR.md">Français</a> |
  <a href="./README_es-ES.md">Español</a>
</p>

## 개요

RedNotes Mate는 샤오홍슈(Xiaohongshu/RedNotes) 콘텐츠 게시를 자동화하기 위해 특별히 설계된 AI 어시스턴트 플랫폼입니다. xiaohongshu-mcp 서비스를 AionUi와 통합하여 콘텐츠 생성부터 게시까지 완전한 자동화 솔루션을 제공합니다.

## 기능

### 1. 서비스 통합
- xiaohongshu-mcp가 백엔드 서비스로 실행되며 AionUi 시작/종료와 동기화
- 자동화된 프로세스 관리, MCP 서비스 수동 시작 불필요
- 수명 주기 관리로 서비스 동기화 보장

### 2. AI 콘텐츠 어시스턴트
- 지능형 샤오홍슈 노트 생성 기능 통합
- 콘텐츠 생성 품질 최적화를 위한 다중 모델 전환
- 스마트 태그 및 주제 추천

### 3. 게시 자동화
- 이미지/동영상 콘텐츠 원클릭 게시
- 예약 게시 기능
- 게시 상태 모니터링 및 피드백

### 4. 계정 관리
- 샤오홍슈 계정 로그인 상태 관리
- 다중 계정 지원
- 쿠키 관리 및 지속성

### 5. 스마트 상호작용
- 샤오홍슈 콘텐츠 검색
- 참여 기능(좋아요, 댓글, 즐겨찾기)
- 사용자 데이터 분석

## 기술 아키텍처

```
┌─────────────────┐
│   AionUi GUI    │ ← 사용자 상호작용 계층
├─────────────────┤
│  MCP Bridge     │ ← 프로토콜 적응 계층
├─────────────────┤
│ xiaohongshu-mcp │ ← 샤오홍슈 서비스 계층
└─────────────────┘
```

### 프로세스 관리
- 메인 프로세스: AionUi (Electron)
- 자식 프로세스: xiaohongshu-mcp (Go 애플리케이션)
- 통신 프로토콜: HTTP MCP

## 설치

### 필수 조건
- Node.js 18+
- npm 또는 yarn
- Chrome/Chromium 브라우저 (xiaohongshu-mcp용)

### 설정

1. 저장소 복제:
```bash
git clone https://github.com/AndersHsueh/RedNotes-Mate.git
cd RedNotes-Mate
```

2. 의존성 설치:
```bash
cd aionui
npm install
```

3. 애플리케이션 시작:
```bash
npm start
```

## 프로젝트 구조

```
RedNotes-Mate/
├── aionui/                    # AionUi 소스 코드 (수정됨)
│   ├── src/
│   │   ├── rednotes/          # RedNotes 통합 모듈
│   │   │   ├── serviceManager.ts
│   │   │   ├── mcpBridge.ts
│   │   │   └── config.ts
│   │   └── ...
│   └── ...
├── xiaohongshu-mcp/           # xiaohongshu-mcp 바이너리
│   ├── macos-amd64/
│   ├── macos-arm64/
│   ├── windows-amd64/
│   ├── linux-amd64/
│   └── linux-arm64/
├── resources/                  # 리소스 파일
│   ├── icons/
│   ├── configs/
│   └── prompts/
├── Doc4AI/                     # 개발 문서
└── README.md
```

## 다국어 지원

RedNotes Mate는 6개 언어를 지원합니다:
- 영어 (en-US)
- 중국어 간체 (zh-CN)
- 일본어 (ja-JP)
- 한국어 (ko-KR)
- 프랑스어 (fr-FR)
- 스페인어 (es-ES)

설정 → 시스템 → 언어에서 언어를 변경할 수 있습니다.

## 개발

자세한 개발 지침은 [개발 가이드](./Doc4AI/RedNotes_Mate_dev_guide.md)를 참조하세요.

## 라이선스

이 프로젝트는 MIT 라이선스에 따라 라이선스가 부여됩니다 - 자세한 내용은 [LICENSE](./aionui/LICENSE) 파일을 참조하세요.

## 관련 프로젝트

- [AionUi](https://github.com/AndersHsueh/AionUi) - 기본 GUI 애플리케이션
- [xiaohongshu-mcp](https://github.com/AndersHsueh/xiaohongshu-mcp) - 샤오홍슈 MCP 서비스
