#!/bin/bash

# RedNotes-Mate Build Script
# This script builds the application for different platforms
# Usage:
#   ./scripts/build.sh              - Build for current platform
#   ./scripts/build.sh macos        - Build for macOS (x64 and arm64)
#   ./scripts/build.sh windows      - Build for Windows (x64)
#   ./scripts/build.sh linux        - Build for Linux (x64 and arm64)
#   ./scripts/build.sh all          - Build for all platforms

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
AIONUI_DIR="$PROJECT_ROOT/aionui"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print colored message
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    print_info "Node.js version: $(node -v)"

    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    print_info "npm version: $(npm -v)"
}

# Install dependencies
install_deps() {
    print_info "Installing dependencies..."
    cd "$AIONUI_DIR"
    npm ci
}

# Build for macOS
build_macos() {
    print_info "Building for macOS..."
    cd "$AIONUI_DIR"

    if [ "$1" == "arm64" ]; then
        node scripts/build-with-builder.js arm64 --mac --arm64
    elif [ "$1" == "x64" ]; then
        node scripts/build-with-builder.js x64 --mac --x64
    else
        # Build for both architectures
        node scripts/build-with-builder.js auto --mac --arm64 --x64
    fi
}

# Build for Windows
build_windows() {
    print_info "Building for Windows..."
    cd "$AIONUI_DIR"

    if [ "$1" == "arm64" ]; then
        node scripts/build-with-builder.js arm64 --win --arm64
    else
        node scripts/build-with-builder.js x64 --win --x64
    fi
}

# Build for Linux
build_linux() {
    print_info "Building for Linux..."
    cd "$AIONUI_DIR"
    npm run dist:linux
}

# Build for current platform
build_current() {
    case "$(uname -s)" in
        Darwin)
            build_macos
            ;;
        Linux)
            build_linux
            ;;
        MINGW*|CYGWIN*|MSYS*)
            build_windows
            ;;
        *)
            print_error "Unsupported platform: $(uname -s)"
            exit 1
            ;;
    esac
}

# Print usage
print_usage() {
    echo "Usage: $0 [platform] [arch]"
    echo ""
    echo "Platforms:"
    echo "  macos     - Build for macOS"
    echo "  windows   - Build for Windows"
    echo "  linux     - Build for Linux (Ubuntu)"
    echo "  all       - Build for all platforms"
    echo "  (empty)   - Build for current platform"
    echo ""
    echo "Architectures (optional):"
    echo "  x64       - Build for x64 architecture"
    echo "  arm64     - Build for ARM64 architecture"
    echo ""
    echo "Examples:"
    echo "  $0                  # Build for current platform"
    echo "  $0 macos            # Build macOS for both x64 and arm64"
    echo "  $0 macos arm64      # Build macOS for arm64 only"
    echo "  $0 windows          # Build Windows for x64"
    echo "  $0 linux            # Build Linux for x64 and arm64"
    echo "  $0 all              # Build for all platforms"
}

# Main
main() {
    print_info "RedNotes-Mate Build Script"
    print_info "=========================="

    check_prerequisites
    install_deps

    case "$1" in
        macos)
            build_macos "$2"
            ;;
        windows)
            build_windows "$2"
            ;;
        linux)
            build_linux
            ;;
        all)
            print_warn "Cross-compilation is not supported. Building for current platform only."
            print_warn "Use CI/CD workflow for multi-platform builds."
            build_current
            ;;
        help|--help|-h)
            print_usage
            ;;
        "")
            build_current
            ;;
        *)
            print_error "Unknown platform: $1"
            print_usage
            exit 1
            ;;
    esac

    print_info "Build completed! Artifacts are in: $AIONUI_DIR/out/"
}

main "$@"
