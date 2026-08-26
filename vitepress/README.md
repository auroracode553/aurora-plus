# Aurora UI VitePress 文档站

该目录只负责 Aurora UI 的文档与实时示例，不作为组件库发布。文档站使用 VitePress、Vue 和 Shiki，拥有独立的依赖、锁文件和 npm scripts。

## 目录

```text
vitepress/
├─ .vitepress/
│  ├─ config.js              导航、侧栏和 Vite 配置
│  ├─ demo-source-plugin.js  示例源码的构建期语法高亮
│  ├─ icon-metadata-plugin.js 图标官方分类的构建期索引
│  └─ theme/                 文档主题、DemoBlock 和真实示例
├─ guide/                    介绍、快速开始和主题定制
├─ components/               每个组件的独立文档页
├─ index.md                  文档首页
├─ package.json              文档依赖与命令
└─ package-lock.json         文档依赖版本锁
```

## 组件库连接

文档站不直接读取 `../ui/src`，也不在 Vite 配置中硬编码组件库产物路径。`package.json` 使用 `"aurora-ui": "file:../ui"` 声明本地包依赖，`import 'aurora-ui'` 与 `import 'aurora-ui/style.css'` 再由 UI 包自身的 `exports` 映射到 `ui/dist`。

`ui` 和 `vitepress` 各自维护 `package.json`、锁文件与 `node_modules`。文档站独立安装 Vue、VitePress 和 Shiki；Tabler 图标通过本地 `aurora-ui` 包的运行时依赖与公共导出使用。本地包链接只建立消费关系，不让文档站读取或编译 UI 源码。

图标目录的分类索引由 `icon-metadata-plugin.js` 在构建期读取 Aurora UI 实际依赖版本的 Tabler 官方元数据，并通过虚拟模块交给文档页面。分类数据不会打进 UI 库产物，也不需要在文档站重复维护图标版本。

## 联调流程

首次联调前，分别在两个目录手动安装各自依赖。在一个终端启动 UI 库的监听构建：

```powershell
cd D:\my_project\front-sdk\aurora-ui\ui
npm install
npm run dev
```

`ui` 的 `dev` 脚本执行 `vite build --watch`，持续更新 `ui/dist`。确认产物已生成后，在另一个终端启动文档站：

```powershell
cd D:\my_project\front-sdk\aurora-ui\vitepress
npm install
npm run dev
```

文档站不会触发 UI 构建；如果 `ui/dist` 不存在，会直接报告组件库入口无法解析。

GitHub Pages 流水线遵循相同顺序：分别执行 `ui` 的依赖安装与正式构建，再安装并构建 VitePress。CI 使用 `npm run build`，不启动本地 watch 进程。

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

## 文档内容边界

`index.md`、`guide/` 和 `components/` 面向 Aurora UI 使用者，只记录组件库的安装、API、示例和主题等内容，不介绍文档站工具链。VitePress 的依赖、脚本、配置和维护说明统一保留在本 README；修改文档站实现时请只更新这里。
