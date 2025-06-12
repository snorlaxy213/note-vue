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

````yaml
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
````

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

### 后端配置
本项目需要配合后端服务使用：

- 后端项目 : note-gin
- 默认后端地址 : http://localhost:9000
- API 前缀 : /api
## 📱 功能模块
### 1. 笔记编辑 (/write)
- Markdown 实时预览
- 自动保存功能
- 文件夹分类
- 标题和日期管理
### 2. 文件管理 (/files)
- 多标签页浏览
- 文件夹树形结构
- 文件搜索和过滤
- 批量操作
### 3. 回收站 (/rubbish)
- 已删除文件列表
- 文件恢复功能
- 永久删除
- 批量清空
### 4. 书籍管理 (/mybook)
- 个人书籍收藏
- 阅读进度跟踪
- 书籍信息展示
- 分类管理
### 5. 系统管理 (/manage)
- 用户设置
- 系统配置
- 数据统计
- 导入导出
## 🛠️ 开发指南
### 可用脚本
### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 Vue.js 官方风格指南
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case
### 构建配置
项目使用 vue.config.js 进行构建配置：

- 开发端口 : 9002
- 代理配置 : /api -> http://localhost:9000
- 关闭 ESLint : lintOnSave: false
## 🐳 部署指南
### 传统部署
1. 构建项目
2. 部署到服务器
### Docker 部署
1. 使用 Docker Compose
2. 单独构建镜像
### Nginx 配置
项目包含了完整的 Nginx 配置文件 nginx.conf ，支持：

- 静态文件服务
- API 代理转发
- Gzip 压缩
- 缓存策略
## 🔧 配置说明
### 环境变量
创建 .env.local 文件并配置以下变量：

### 代理配置
开发环境下，所有 /api 请求会被代理到后端服务器。生产环境需要配置 Nginx 反向代理。

## 🤝 贡献指南
1. Fork 本仓库
2. 创建特性分支 ( git checkout -b feature/AmazingFeature )
3. 提交更改 ( git commit -m 'Add some AmazingFeature' )
4. 推送到分支 ( git push origin feature/AmazingFeature )
5. 打开 Pull Request
### 开发流程
1. 确保代码通过 ESLint 检查
2. 添加必要的测试用例
3. 更新相关文档
4. 确保构建成功
## 📄 许可证
本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情。

## 🔗 相关链接
- 后端项目 : note-gin
- Vue.js 官方文档 : https://vuejs.org/
- Element UI 文档 : https://element.eleme.io/
- mavon-editor 文档 : https://github.com/hinesboy/mavonEditor
## 📞 支持
如果您在使用过程中遇到问题，请通过以下方式获取帮助：

- 提交 Issue
- 查看 开发计划
- 联系维护者
Made with ❤️ by the Note Vue Team