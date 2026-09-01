# Aurora UI VitePress 文档站

该目录只负责 Aurora UI 的文档与实时示例，不作为组件库发布。文档站使用 VitePress、Vue 和 Shiki，拥有独立的依赖、锁文件和 npm scripts。

## 目录

```text
vitepress/
├─ .vitepress/
│  ├─ config.js              导航、侧栏和 Vite 配置
│  ├─ demo-source-plugin.js  示例源码的构建期语法高亮
│  ├─ icon-metadata-plugin.js 图标官方分类的构建期索引
│  └─ theme/                 文档主题、全站材质状态、DemoBlock 和真实示例
├─ guide/                    介绍、快速开始和主题配置
├─ components/               每个组件的独立文档页
├─ index.md                  文档首页
├─ package.json              文档依赖与命令
└─ package-lock.json         文档依赖版本锁
```

## 组件库连接

文档站保留 `"aurora-ui": "file:../ui"` 作为组件库依赖，示例始终使用公开入口 `import 'aurora-ui'`，不暴露组件库内部文件路径。Vite 根据环境切换公开入口的实际来源：

- 默认开发模式将 `aurora-ui` 和 `aurora-ui/style.css` 映射到 `../ui/src`，组件源码与 SCSS 主题修改后可直接更新实时示例。
- 设置 `AURORA_UI_USE_DIST=true` 时不启用源码映射，由 UI 包自身的 `exports` 解析到 `ui/dist`，用于发布前验证和 GitHub Pages 构建。

`ui` 和 `vitepress` 各自维护 `package.json`、锁文件与 `node_modules`。文档站独立安装 Vue、VitePress 和 Shiki；Tabler 图标通过本地 `aurora-ui` 包的运行时依赖与公共导出使用。源码模式只改变 Vite 的模块解析目标，不改变文档示例展示给使用者的导入方式。

文档站使用 VitePress 2 预发布版及 Vite 8。Vite 8 仅支持 Sass 现代 API，因此 `.vitepress/config.js` 不再声明已移除的 `scss.api` 兼容选项。Vite 8 使用 Rolldown 和 Oxc，运行环境需满足 Node.js 20.19+ 或 22.12+；GitHub Pages 工作流使用 Node.js 24。

图标目录的分类索引由 `icon-metadata-plugin.js` 在构建期读取 Aurora UI 实际依赖版本的 Tabler 官方元数据，并通过虚拟模块交给文档页面。分类数据不会打进 UI 库产物，也不需要在文档站重复维护图标版本。

## 联调流程

首次联调前，分别在 `ui` 和 `vitepress` 目录手动安装各自依赖。源码模式不需要启动 UI 库的监听构建；完成依赖安装后，在文档目录启动开发服务：

```powershell
cd D:\my_project\front-sdk\aurora-ui\vitepress
npm run dev
```

VitePress 会直接读取 `ui/src`。修改组件源码或主题样式时，不需要先更新 `ui/dist`。

需要手动验证发布产物时，先在 `ui` 目录构建组件库，再在当前终端设置 `AURORA_UI_USE_DIST=true` 后构建 VitePress。dist 模式会通过 `ui/package.json` 的 `exports` 使用正式 JS 和 CSS 产物。

GitHub Pages 流水线使用 dist 模式：先安装并构建 `ui`，然后以 `AURORA_UI_USE_DIST=true` 构建 VitePress。因此线上文档验证的是当前提交生成的组件库产物，而不是旧的 npm 发布版本。

## 示例机制

示例文件位于 `.vitepress/theme/examples/`。同一个 `.vue` 文件同时用于实时预览和完整源码展示：

- 示例组件直接挂载到组件文档页。
- `?demo-source` 在构建阶段读取示例源码。
- Shiki 生成支持明暗主题的 Vue 语法高亮。
- `DemoBlock.vue` 提供展开、收起和复制功能。

文档主题入口直接继承 Aurora UI 的全站默认 `solid` 材质。`theme/utils/material-preference.js` 负责读取、更新和持久化文档站材质偏好；主题配置页的 `MaterialPreview.vue` 通过该工具调用组件库公开的 `setAuroraMaterial` 修改根节点材质，不再使用局部预览容器覆盖。因此普通示例、Teleport 浮层和命令式服务都会继承同一材质，切换路由或刷新页面后仍保持一致。

新增示例时，应完整定义演示数据、状态、事件逻辑和预览布局，避免展示未定义的 `items`、`visible` 等变量。实时示例只通过 Aurora UI 的公开 props、事件和插槽控制组件，并遵循以下约束：

- 示例可以使用 `<style scoped>`、普通 class 和主题语义变量组织预览容器、网格、间距、说明文字及业务插槽内容。
- 禁止使用样式穿透选择器、Aurora 组件类名选择器（如 `.au-button`）或组件内部 DOM 结构覆盖组件的尺寸、颜色、边框、圆角、材质和交互状态。
- 需要限制预览宽高或添加展示边框时，把样式放在组件外层容器；组件自身只使用公开属性和变体。
- 若组件必须依赖业务 CSS 才能完成基础展示，应先把通用能力补充为明确的组件属性，再由示例调用公开 API。

## 依赖

- VitePress `^1.6.4`
- Vue `^3.5.40`
- Shiki `^2.5.0`
- Sass `^1.103.1`（编译源码模式下的 Aurora UI SCSS）

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
