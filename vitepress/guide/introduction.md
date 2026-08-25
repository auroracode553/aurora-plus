# 介绍

Aurora UI 是从 Aurora Editor 中抽离出的 Vue 3 通用组件库。它只保留表现、交互协议与通用状态，不依赖 Electron、Pinia、IPC、文件系统或编辑器 SDK。

## 设计原则

- 单一职责：组件只解决一种稳定的界面问题。
- 依赖注入：业务数据使用 props，业务动作使用 emits 或回调。
- 主题隔离：公共样式统一使用 `au-` 类名前缀和 `--au-*` 变量。
- 渐进迁移：应用侧旧组件保留到 UI 包完成安装和视觉回归后再删除。
- 双重安装：既支持 `app.use(AuroraUI)`，也支持单组件导入。

## 组件范围

| 分类 | 当前能力 |
| --- | --- |
| 基础 | Button、Icon、CloseButton、Tooltip |
| 容器 | Dialog、FloatingToolbar |
| 数据展示 | VirtualList、ContextMenu |
| 反馈服务 | Message、MessageBox |

文件历史、Git 面板、编辑器查找替换、Electron 标题栏等仍属于业务或平台组件，不进入基础 UI 包。
