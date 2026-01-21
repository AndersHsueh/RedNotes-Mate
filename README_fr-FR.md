# RedNotes Mate

<p align="center">
  <strong>Assistant de publication alimenté par l'IA pour Xiaohongshu (RedNotes)</strong>
</p>

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_zh-CN.md">简体中文</a> |
  <a href="./README_ja-JP.md">日本語</a> |
  <a href="./README_ko-KR.md">한국어</a> |
  <a href="./README_fr-FR.md">Français</a> |
  <a href="./README_es-ES.md">Español</a>
</p>

## Aperçu

RedNotes Mate est une plateforme d'assistant IA conçue spécifiquement pour automatiser la publication de contenu sur Xiaohongshu (RedNotes). En intégrant le service xiaohongshu-mcp avec AionUi, elle fournit une solution d'automatisation complète, de la génération de contenu à la publication.

## Fonctionnalités

### 1. Intégration de services
- xiaohongshu-mcp s'exécute en tant que service backend, synchronisé avec le démarrage/arrêt d'AionUi
- Gestion automatisée des processus, pas besoin de démarrer manuellement le service MCP
- Gestion du cycle de vie assurant la synchronisation des services

### 2. Assistant de contenu IA
- Création de contenu intégrée avec génération intelligente de notes Xiaohongshu
- Changement multi-modèles pour optimiser la qualité de génération de contenu
- Tags intelligents et recommandations de sujets

### 3. Automatisation de la publication
- Publication en un clic pour le contenu image/vidéo
- Fonctionnalité de publication programmée
- Surveillance du statut de publication et retour d'information

### 4. Gestion des comptes
- Gestion de l'état de connexion du compte Xiaohongshu
- Support multi-comptes
- Gestion des cookies et persistance

### 5. Interaction intelligente
- Recherche de contenu Xiaohongshu
- Fonctionnalités d'engagement (likes, commentaires, favoris)
- Analyse des données utilisateur

## Architecture technique

```
┌─────────────────┐
│   AionUi GUI    │ ← Couche d'interaction utilisateur
├─────────────────┤
│  MCP Bridge     │ ← Couche d'adaptation de protocole
├─────────────────┤
│ xiaohongshu-mcp │ ← Couche de service Xiaohongshu
└─────────────────┘
```

### Gestion des processus
- Processus principal : AionUi (Electron)
- Processus enfant : xiaohongshu-mcp (application Go)
- Protocole de communication : HTTP MCP

## Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Navigateur Chrome/Chromium (pour xiaohongshu-mcp)

### Configuration

1. Cloner le dépôt :
```bash
git clone https://github.com/AndersHsueh/RedNotes-Mate.git
cd RedNotes-Mate
```

2. Installer les dépendances :
```bash
cd aionui
npm install
```

3. Démarrer l'application :
```bash
npm start
```

## Structure du projet

```
RedNotes-Mate/
├── aionui/                    # Code source AionUi (modifié)
│   ├── src/
│   │   ├── rednotes/          # Modules d'intégration RedNotes
│   │   │   ├── serviceManager.ts
│   │   │   ├── mcpBridge.ts
│   │   │   └── config.ts
│   │   └── ...
│   └── ...
├── xiaohongshu-mcp/           # Binaires xiaohongshu-mcp
│   ├── macos-amd64/
│   ├── macos-arm64/
│   ├── windows-amd64/
│   ├── linux-amd64/
│   └── linux-arm64/
├── resources/                  # Fichiers de ressources
│   ├── icons/
│   ├── configs/
│   └── prompts/
├── Doc4AI/                     # Documentation de développement
└── README.md
```

## Support i18n

RedNotes Mate prend en charge 6 langues :
- Anglais (en-US)
- Chinois simplifié (zh-CN)
- Japonais (ja-JP)
- Coréen (ko-KR)
- Français (fr-FR)
- Espagnol (es-ES)

La langue peut être modifiée dans Paramètres → Système → Langue.

## Développement

Voir le [Guide de développement](./Doc4AI/RedNotes_Mate_dev_guide.md) pour des instructions de développement détaillées.

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](./aionui/LICENSE) pour plus de détails.

## Projets connexes

- [AionUi](https://github.com/AndersHsueh/AionUi) - L'application GUI de base
- [xiaohongshu-mcp](https://github.com/AndersHsueh/xiaohongshu-mcp) - Service MCP Xiaohongshu
