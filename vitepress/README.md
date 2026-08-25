# Aurora UI VitePress 文档站

该目录只负责 Aurora UI 的文档与实时示例，不作为组件库发布。文档站使用 VitePress、Vue 和 Shiki，拥有独立的依赖、锁文件和 npm scripts。

## 目录

```text
vitepress/
├─ .vitepress/
│  ├─ config.js              导航、侧栏和 Vite 配置
│  ├─ demo-source-plugin.js  示例源码的构建期语法高亮
│  └─ theme/                 文档主题、DemoBlock 和真实示例
├─ guide/                    介绍、快速开始和主题定制
├─ components/               每个组件的独立文档页
├─ index.md                  文档首页
├─ package.json              文档依赖与命令
└─ package-lock.json         文档依赖版本锁
```

## 组件库连接

文档配置将包名 `aurora-ui` 映射到同级 `../ui/src/index.js`，因此实时示例直接使用组件库源码。文档站仍从自己的 `node_modules` 解析 Vue，不与组件库共用依赖目录。

## 示例机制

示例文件位于 `.vitepress/theme/examples/`。同一个 `.vue` 文件同时用于实时预览和完整源码展示：

- 示例组件直接挂载到组件文档页。
- `?demo-source` 在构建阶段读取示例源码。
- Shiki 生成支持明暗主题的 Vue 语法高亮。
- `DemoBlock.vue` 提供展开、收起和复制功能。

新增示例时，应把演示数据、状态、事件逻辑和必要样式完整写入示例文件，避免展示未定义的 `items`、`visible` 等变量。

## 依赖

- VitePress `^1.6.4`
- Vue `^3.5.40`
- Shiki `^2.5.0`

依赖由使用者手动安装：

```powershell
cd D:\my_project\front-sdk\aurora-ui\vitepress
npm install
```

## 命令

| 命令 | 用途 | 默认地址或输出 |
| --- | --- | --- |
| `npm run dev` | 启动文档开发服务 | `http://127.0.0.1:5174` |
| `npm run build` | 构建文档站 | `.vitepress/dist/` |
| `npm run preview` | 预览构建产物 | `http://127.0.0.1:4174` |

命令仅作为手动执行说明，本项目不会自动启动或构建文档站。
