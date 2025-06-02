# Note Vue - 智能笔记管理系统前端

<div align="center">
  <img src="https://img.shields.io/badge/Vue-2.6.10-4FC08D?style=for-the-badge&logo=vue.js" alt="Vue">
  <img src="https://img.shields.io/badge/Element_UI-2.13.0-409EFF?style=for-the-badge&logo=element" alt="Element UI">
  <img src="https://img.shields.io/badge/Node.js-14+-339933?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</div>

## 📖 项目概述

Note Vue 是一个现代化的前后端分离笔记管理系统的前端部分，基于 Vue.js 2.x 构建。系统提供了完整的笔记创建、编辑、管理和组织功能，支持 Markdown 编辑器，具备文件夹管理、回收站、书籍管理等高级功能。

### 🎯 核心特性

- **📝 智能编辑器**: 集成 mavon-editor，支持实时 Markdown 预览
- **📁 文件夹管理**: 层级化文件夹结构，支持拖拽操作
- **🗑️ 回收站机制**: 安全删除与恢复功能
- **📚 书籍管理**: 个人书籍收藏与阅读进度跟踪
- **🎨 现代化UI**: 基于 Element UI 的响应式设计
- **⚡ 高性能**: 组件化架构，按需加载
- **🔧 可配置**: 灵活的构建和部署配置

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue.js | 2.6.10 | 核心框架 |
| Vue Router | 3.1.5 | 路由管理 |
| Element UI | 2.13.0 | UI 组件库 |
| mavon-editor | 2.7.7 | Markdown 编辑器 |
| axios | 0.19.2 | HTTP 客户端 |
| marked | 0.8.0 | Markdown 解析 |
| highlight.js | 9.18.1 | 代码高亮 |

### 项目结构

note-vue/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   │   ├── Folder.vue     # 文件夹组件
│   │   ├── MakedownShow.vue # Markdown 展示组件
│   │   └── MyArticle.vue  # 文章组件
│   ├── network/           # 网络请求
│   │   └── request.js     # axios 配置
│   ├── pages/             # 页面组件
│   │   ├── book/          # 书籍管理
│   │   ├── files/         # 文件管理
│   │   ├── manage/        # 系统管理
│   │   ├── rubbish/       # 回收站
│   │   └── write/         # 编辑器
│   ├── router/            # 路由配置
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── deploy/                # 部署脚本
├── .env.example           # 环境变量示例
├── docker-compose.yml     # Docker 配置
├── nginx.conf             # Nginx 配置
└── vue.config.js          # Vue 构建配置

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0 或 yarn >= 1.22.0
- Git

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd note-vue
   ```
2. **安装依赖**
   ```bash
    npm install
    # 或
    yarn install
   ```
3. **配置环境变量**
   ```bash
    cp .env.example .env.local
    # 编辑 .env.local 文件，配置后端 API 地址
   ```
4. **启动开发服务器**
   ```bash
    npm run serve
    # 或
    yarn serve
   ```
5. **访问应用**
   打开浏览器访问 http://localhost:9002

   