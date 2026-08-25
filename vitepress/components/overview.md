# 组件总览

Aurora UI `0.1.0` 当前包含 8 个 Vue 组件和 2 个命令式服务。组件文档遵循统一结构：适用场景、真实数据演示、完整可复制源码、使用约束，以及 Attributes、Events、Slots、Exposes API。

| 分类 | 组件或服务 | 用途 |
| --- | --- | --- |
| 基础 | [`AuButton`](/components/button) | 多类型、多尺寸、加载态按钮 |
| 基础 | [`AuIcon`](/components/icon) | SVG 图标渲染、注册与无障碍语义 |
| 基础 | [`AuCloseButton`](/components/close-button) | 自带 Tooltip 的关闭按钮 |
| 基础 | [`AuTooltip`](/components/tooltip) | 自动翻转、视口避让的文字提示 |
| 反馈 | [`AuMessage`](/components/message) | 可堆叠、合并、常驻的命令式消息 |
| 反馈 | [`AuMessageBox`](/components/message-box) | Promise 风格、支持队列的确认框 |
| 反馈 | [`AuDialog`](/components/dialog) | 模态对话框、焦点与滚动管理 |
| 数据 | [`AuVirtualList`](/components/virtual-list) | 固定行高、大数据量虚拟列表 |
| 导航 | [`AuContextMenu`](/components/context-menu) | 多布局、二级菜单、选择前守卫 |
| 浮层 | [`AuFloatingToolbar`](/components/floating-toolbar) | 根据目标矩形定位的浮动工具条 |

## 如何阅读示例

每个演示框由三部分组成：

1. 演示说明：交代该示例验证的能力和交互方式。
2. 实时预览：直接挂载示例组件，状态和数据可操作。
3. 完整源代码：点击“查看完整源代码（含数据）”展开，展示驱动预览的同一个 `.vue` 文件，可一键复制。

复杂数据示例（如虚拟列表和右键菜单）默认展开源码，确保 `items`、`sections` 等变量的完整定义进入第一屏阅读流程。

## 导入方式

所有组件和服务都从包入口按需导入：

```js
import {
  AuButton,
  AuContextMenu,
  AuMessage,
} from 'aurora-ui';
import 'aurora-ui/style.css';
```

如需全局注册全部组件，请查看[快速开始](/guide/getting-started)。
