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
| 基础 | [Button](/components/button)、[ButtonGroup](/components/button-group)、[Icon](/components/icon)、[Tooltip](/components/tooltip) |
| 容器 | [Dialog](/components/dialog)、[FloatingToolbar](/components/floating-toolbar) |
| 数据展示 | [VirtualList](/components/virtual-list)、[ContextMenu](/components/context-menu) |
| 反馈服务 | [Message](/components/message)、[MessageBox](/components/message-box) |

文件历史、Git 面板、编辑器查找替换、Electron 标题栏等仍属于业务或平台组件，不进入基础 UI 包。

## 文档示例约定

组件页中的实时预览与源代码来自同一个 `.vue` 文件。示例不会隐藏关键数据：使用 `items`、`sections`、表单对象或位置矩形时，完整定义会和模板、事件处理、样式一起展示。右键菜单和虚拟列表等复杂数据示例默认展开源码。

API 文档统一按以下部分组织：

- Attributes：可传入的数据与默认值。
- Events：组件向外通知的动作和参数。
- Slots：内容组合方式及作用域参数。
- Exposes：通过模板引用可调用的方法或元素引用。
