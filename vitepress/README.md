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

图标分类来自 UI 包所用 Tabler 版本的元数据，不进入 UI 产物。文档主题通过公开的主题和材质接口设置全站外观，材质偏好由 `theme/utils/material-preference.js` 持久化。

示例须完整定义数据、状态与事件。样式仅作用于示例自有容器和插槽内容，组件外观通过公开属性控制，不使用库内部选择器或样式穿透。

维护者说明留在本文件；使用指南和组件页面只保留组件库使用信息。
