# Aurora UI 架构说明

## 目录职责

```text
aurora-ui/
├─ src/
│  ├─ components/        Vue 展示与交互组件，每个组件独立目录和导出入口
│  ├─ services/          脱离业务状态的命令式反馈服务
│  ├─ theme/             全局设计变量和明暗主题
│  ├─ utils/             安装器、滚动锁等内部通用能力
│  └─ index.js           完整安装入口与公共导出
├─ vitepress/
│  ├─ .vitepress/        文档站配置、主题与实时示例
│  ├─ guide/             使用指南
│  ├─ components/        组件文档
│  ├─ development/       架构与迁移记录
│  └─ package.json       文档站依赖与 npm scripts
├─ index.d.ts            包级 TypeScript 声明
├─ vite.config.js        Vue 库模式构建配置
├─ package.json          组件库元数据、依赖、构建脚本与 workspace 声明
└─ package-lock.json     仓库内两个 package 的统一版本锁
```

根目录是可发布的 `aurora-ui` 组件库包，`vitepress/` 是私有文档包。两者仅共享 workspace 锁文件，不共享依赖声明和脚本。

## 依赖边界

组件只依赖 Vue 与库内模块，不依赖 Electron、Pinia、编辑器 SDK、IPC、业务 Store 或 Aurora Editor 的路径别名。

- 业务数据通过 props 传入。
- 业务动作通过 emits 或回调返回。
- 主题通过 `--au-*` CSS 变量注入。
- SVG 图标通过 `registerIcons()` 注入。
- `AuContextMenu` 的动作确认通过 `beforeSelect()` 注入。
- 命令式反馈服务只在实际调用时访问 DOM，可以被服务端构建安全导入，但只能在浏览器端调用。

## 文档与预览

VitePress 以 `vitepress/` 为站点根目录。文档配置将 `aurora-ui` 别名集中指向组件库的 `src/index.js`，主题和示例只使用包名导入，不在多个文件中硬编码跨包相对路径。组件文档内的 Vue 示例就是 UI 库真实源码，不存在独立 Playground 复制层。

文档构建产物与 UI 库构建产物完全隔离：

- UI 库：`dist/`
- 文档站：`vitepress/.vitepress/dist/`

## 公共 API 约定

- 组件名统一为 `AuXxx`，避免与宿主组件冲突。
- 所有组件既可由默认插件完整注册，也可单独导入和安装。
- 兼容原组件所需的关键属性，例如 `closeOnOverlay`、`refreshSelector` 和基础图标别名；新增代码优先使用新名称。
- 样式类统一使用 `au-` 前缀，不向宿主暴露 `.toolbar-btn`、`.base-body` 等通用类名。
- `v-model` 统一使用 `modelValue` / `update:modelValue`。

## 后续扩展准则

新增组件前应确认它能脱离业务 Store 和运行时平台。涉及文件系统、Git、编辑器实例或 Electron 窗口的功能，应继续留在应用层；只有表现和交互协议稳定的部分才进入组件库。
