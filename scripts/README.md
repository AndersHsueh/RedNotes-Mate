# RedNotes-Mate Build Scripts

This directory contains build scripts for packaging RedNotes-Mate for different platforms.

## Scripts

### build.sh

A shell script for building the application locally.

**Usage:**

```bash
# Build for current platform
./scripts/build.sh

# Build for macOS (x64 and arm64)
./scripts/build.sh macos

# Build for macOS arm64 only
./scripts/build.sh macos arm64

# Build for Windows
./scripts/build.sh windows

# Build for Linux
./scripts/build.sh linux

# Show help
./scripts/build.sh help
```

## CI/CD Workflows

The `.github/workflows/build-and-release.yml` workflow automatically builds the application for all platforms when pushing to `main` or `dev` branches.

### Platforms Built

| Platform       | Architecture | Output Format        |
| -------------- | ------------ | -------------------- |
| macOS          | x64          | DMG, ZIP             |
| macOS          | arm64        | DMG, ZIP             |
| Windows        | x64          | NSIS Installer, ZIP  |
| Windows        | arm64        | NSIS Installer, ZIP  |
| Linux (Ubuntu) | x64          | DEB, AppImage        |
| Linux (Ubuntu) | arm64        | DEB, AppImage        |

### Build Artifacts

Build artifacts are stored in `aionui/out/` directory and uploaded as GitHub Actions artifacts with a 7-day retention period.

## Prerequisites

- Node.js 18+
- npm
- For Windows: Visual Studio Build Tools 2022
- For macOS: Xcode Command Line Tools
- For Linux: build-essential, python3, and various development libraries

## Environment Variables

For code signing (optional):

- `BUILD_CERTIFICATE_BASE64` - Base64 encoded macOS signing certificate
- `P12_PASSWORD` - Password for the P12 certificate
- `APPLE_ID` - Apple ID for notarization
- `APPLE_ID_PASSWORD` - App-specific password for notarization
- `TEAM_ID` - Apple Developer Team ID
- `IDENTITY` - Code signing identity
