# Aurora Plus 文档站

## 目录

- `.vitepress/config.js`：导航、侧栏与 Vite 配置。
- `.vitepress/theme/`：文档主题、公共展示组件与组件示例。
- `.vitepress/demo-source-plugin.js`：示例源码高亮。
- `.vitepress/icon-metadata-plugin.js`：图标分类索引。
- `guide/`：使用指南；`components/`：组件 API；`index.md`：首页。

## 组件库连接

文档站通过 `file:../ui` 引用组件库。默认将 `aurora-plus`、`aurora-plus/icons` 和 `aurora-plus/style.css` 映射到 `ui/src`，组件示例使用公开入口。

`AURORA_PLUS_USE_DIST=true` 时使用包的正式入口。GitHub Pages 工作流先生成 UI 产物，再以该模式生成文档。

依赖和版本以本目录的 `package.json` 与锁文件为准；`ui` 与文档站分别维护依赖。

## 手动运行

在本目录按锁文件安装依赖，再执行所需命令：

```powershell
npm ci
npm run dev
```

| 命令 | 用途 | 地址或输出 |
| --- | --- | --- |
| `npm run dev` | 启动开发服务 | `http://127.0.0.1:8899` |
| `npm run build` | 生成文档 | `.vitepress/dist/` |
| `npm run preview` | 预览产物 | `http://127.0.0.1:8899` |

## 示例机制

示例保存在 `.vitepress/theme/examples/`。组件页面通过 `DemoBlock` 展示同一 Vue 文件的预览与源码，`?demo-source` 由插件读取并交给 Shiki 高亮。

图标分类来自 UI 包所用 Tabler 版本的元数据，不进入 UI 产物。文档示例使用组件库统一外观，不保存或恢复材质偏好。亮暗模式通过公开主题接口同步。

示例须完整定义数据、状态与事件。样式仅作用于示例自有容器和插槽内容，组件外观通过公开属性控制，不使用库内部选择器或样式穿透。

组件页面通过主题的 `doc-before` 插槽统一显示适用平台。`frontmatter.platforms` 接受 `browser`、`electron`，未声明时默认两者；用于 Electron 的组件页面声明 `platforms: [electron]`。平台名称与默认规则集中在 `theme/utils/componentPlatforms.js`，`ComponentPlatforms.vue` 只渲染平台标识，不限制预览；`DemoBlock.vue` 始终挂载示例并保留可复制源码。Electron 标识表示实际使用场景，浏览器仍可预览组件外观和受控交互；窗口系统能力仅由 Electron 宿主提供，不伪造 Electron 环境或原生覆盖区。

组件预览默认继承文档背景，不使用渐变；表面观察示例可使用纯色背景。

主题的 `custom.css` 在视口宽度不超过 640px 时将正文 API 表格限制在内容宽度内，超长内容在表格内部横向滚动，避免撑宽整页并触发移动浏览器缩小显示。

维护者说明留在本文件；使用指南和组件页面只保留组件库使用信息。
