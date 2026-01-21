# RedNotes Mate

<p align="center">
  <strong>Asistente de publicación impulsado por IA para Xiaohongshu (RedNotes)</strong>
</p>

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_zh-CN.md">简体中文</a> |
  <a href="./README_ja-JP.md">日本語</a> |
  <a href="./README_ko-KR.md">한국어</a> |
  <a href="./README_fr-FR.md">Français</a> |
  <a href="./README_es-ES.md">Español</a>
</p>

## Descripción general

RedNotes Mate es una plataforma de asistente de IA diseñada específicamente para automatizar la publicación de contenido en Xiaohongshu (RedNotes). Al integrar el servicio xiaohongshu-mcp con AionUi, proporciona una solución de automatización completa desde la generación de contenido hasta la publicación.

## Características

### 1. Integración de servicios
- xiaohongshu-mcp se ejecuta como servicio backend, sincronizado con el inicio/cierre de AionUi
- Gestión automatizada de procesos, sin necesidad de iniciar manualmente el servicio MCP
- Gestión del ciclo de vida que garantiza la sincronización del servicio

### 2. Asistente de contenido IA
- Creación de contenido integrada con generación inteligente de notas de Xiaohongshu
- Cambio multi-modelo para optimizar la calidad de generación de contenido
- Etiquetas inteligentes y recomendaciones de temas

### 3. Automatización de publicación
- Publicación con un clic para contenido de imagen/video
- Función de publicación programada
- Monitoreo del estado de publicación y retroalimentación

### 4. Gestión de cuentas
- Gestión del estado de inicio de sesión de la cuenta de Xiaohongshu
- Soporte multi-cuenta
- Gestión de cookies y persistencia

### 5. Interacción inteligente
- Buscar contenido de Xiaohongshu
- Funciones de participación (me gusta, comentarios, favoritos)
- Análisis de datos de usuario

## Arquitectura técnica

```
┌─────────────────┐
│   AionUi GUI    │ ← Capa de interacción del usuario
├─────────────────┤
│  MCP Bridge     │ ← Capa de adaptación de protocolo
├─────────────────┤
│ xiaohongshu-mcp │ ← Capa de servicio Xiaohongshu
└─────────────────┘
```

### Gestión de procesos
- Proceso principal: AionUi (Electron)
- Proceso hijo: xiaohongshu-mcp (aplicación Go)
- Protocolo de comunicación: HTTP MCP

## Instalación

### Requisitos previos
- Node.js 18+
- npm o yarn
- Navegador Chrome/Chromium (para xiaohongshu-mcp)

### Configuración

1. Clonar el repositorio:
```bash
git clone https://github.com/AndersHsueh/RedNotes-Mate.git
cd RedNotes-Mate
```

2. Instalar dependencias:
```bash
cd aionui
npm install
```

3. Iniciar la aplicación:
```bash
npm start
```

## Estructura del proyecto

```
RedNotes-Mate/
├── aionui/                    # Código fuente de AionUi (modificado)
│   ├── src/
│   │   ├── rednotes/          # Módulos de integración RedNotes
│   │   │   ├── serviceManager.ts
│   │   │   ├── mcpBridge.ts
│   │   │   └── config.ts
│   │   └── ...
│   └── ...
├── xiaohongshu-mcp/           # Binarios de xiaohongshu-mcp
│   ├── macos-amd64/
│   ├── macos-arm64/
│   ├── windows-amd64/
│   ├── linux-amd64/
│   └── linux-arm64/
├── resources/                  # Archivos de recursos
│   ├── icons/
│   ├── configs/
│   └── prompts/
├── Doc4AI/                     # Documentación de desarrollo
└── README.md
```

## Soporte i18n

RedNotes Mate soporta 6 idiomas:
- Inglés (en-US)
- Chino simplificado (zh-CN)
- Japonés (ja-JP)
- Coreano (ko-KR)
- Francés (fr-FR)
- Español (es-ES)

El idioma se puede cambiar en Configuración → Sistema → Idioma.

## Desarrollo

Consulte la [Guía de desarrollo](./Doc4AI/RedNotes_Mate_dev_guide.md) para obtener instrucciones detalladas de desarrollo.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulte el archivo [LICENSE](./aionui/LICENSE) para más detalles.

## Proyectos relacionados

- [AionUi](https://github.com/AndersHsueh/AionUi) - La aplicación GUI base
- [xiaohongshu-mcp](https://github.com/AndersHsueh/xiaohongshu-mcp) - Servicio MCP de Xiaohongshu
