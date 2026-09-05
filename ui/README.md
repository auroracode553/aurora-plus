# Aurora Plus

Aurora Plus 是 Vue 3 通用组件库，npm 包名为 `aurora-plus`。公共 API 使用 `Au` 前缀，支持完整安装、按需导入和命令式服务。

## 当前组件

| 导出 | 用途 |
| --- | --- |
| `AuButton` | 多类型、多尺寸、加载态按钮 |
| `AuButtonGroup`、`AuButtonGroupItem` | 控制组容器与专用操作项 |
| `AuDivider` | 横向与纵向内容分割线 |
| `AuLink` | 支持语义类型、下划线策略、禁用态与图标的文字链接 |
| `AuInput` | 支持清空、前后缀和错误态的单行输入框 |
| `AuTextarea` | 支持尺寸、字数限制和缩放方向的多行输入框 |
| `AuSelect` | 带统一选项弹层、键盘导航、禁用态和错误态的选择框 |
| `AuTreeSelect` | 支持嵌套数据、搜索、展开与仅叶节点模式的树形选择 |
| `AuDatePickerPane`、`AuDatePicker`、`AuDateRangePicker` | 独立日历面板、日期输入与日期范围选择器 |
| `AuTimePicker`、`AuDateTimePicker` | 带确认草稿、步长和边界控制的时间与日期时间选择器 |
| `AuForm`、`AuFormItem` | 表单布局、字段路径、规则校验与状态展示 |
| `AuSlider` | 支持小数步进、连续拖动、键盘控制和数值格式化的单值滑块 |
| `AuSwitch` | 二元状态切换开关 |
| `AuCheckbox` | 布尔值、数组和半选状态复选框 |
| `AuColorPicker`、`AuColorSwatch` | 系统取色与预设颜色选择控件 |
| `AuDropdown` | 带视口避让和键盘导航的下拉菜单 |
| `AuMenu`、`AuMenuGroup`、`AuMenuItem` | 支持分组、受控选中和键盘导航的持久导航菜单 |
| `AuMenuBar` | 桌面应用顶部菜单栏与层级命令菜单 |
| `AuMenuList`、`AuMenuListItem` | 苹果式分组菜单与设置行 |
| `AuPanel` | 仅提供表面、尺寸、滚动和区域插槽的通用面板 |
| `AuPopover` | 支持任意内容、自动翻转和视口避让的锚点浮层 |
| `AuPopconfirm` | 锚定触发元素的轻量确认气泡 |
| `AuPagination` | 页码折叠、条数切换和跳页导航 |
| `AuTabs` | 紧凑的受控标签页导航 |
| `AuCard` | 卡片容器 |
| `AuIcon` | 图标尺寸、颜色与无障碍外壳 |
| `AuTooltip` | 自动翻转、视口避让的提示气泡 |
| `AuDialog` | 模态对话框 |
| `AuDrawer` | 支持四向打开、焦点管理与关闭守卫的抽屉面板 |
| `AuLoading`、`vLoading` | 组件、指令及 `AuLoading.service(options)` 命令式加载服务 |
| `AuLoadingSpinner` | 按钮、表单控件和数据组件复用的加载图标 |
| `AuVirtualList` | 固定行高虚拟列表 |
| `AuVirtualTable` | 列配置、固定列、排序和固定行高虚拟表格 |
| `AuImagePreview` | 多图切换、缩放、拖拽与旋转图片预览器 |
| `AuTree` | 支持虚拟滚动、选中与折叠的树形导航 |
| `AuContextMenu` | 配置式右键菜单 |
| `AuFloatingToolbar` | 锚点浮动工具条 |
| `AuWindowTitleBar` | 桌面无边框窗口的受控标题栏 |
| `AuMessage` | 命令式消息提示 |
| `AuMessageBox` | Promise 风格确认框 |

## 弹性布局

- 表单、列表、面板和导航组件默认允许随父容器收缩，长文本会换行、截断或在横向导航内滚动，避免内容撑破布局。
- Dialog、Drawer、Popover、Dropdown、Tooltip、ContextMenu 和 FloatingToolbar 的可用尺寸受视口约束；窄屏下的层级菜单会改为容器内展开。
- Button、Link、Checkbox 和 Switch 保留内容驱动宽度，但不会超过父容器；可伸缩文本区域不会挤压图标、状态标记等结构元素。
- 图标、颜色样本、开关轨道、圆形按钮和桌面窗口控制键需要保持形状，因此仍使用明确的结构尺寸。控件高度继续由 `size` 或组件变体控制，不随屏幕宽度自动放大。

## 安装

```bash
npm install aurora-plus
```

## 完整安装

```js
import { createApp } from 'vue';
import AuroraPlus from 'aurora-plus';
import 'aurora-plus/style.css';
import App from './App.vue';

createApp(App).use(AuroraPlus).mount('#app');
```

## 按需导入

```vue
<script setup>
import { AuButton, AuMessage } from 'aurora-plus';
import 'aurora-plus/style.css';

function save() {
  AuMessage.success('保存成功');
}
</script>

<template>
  <AuButton type="primary" @click="save">保存</AuButton>
</template>
```

## 图标

从独立的 `aurora-plus/icons` 入口按需导入图标组件，并传给 `AuIcon` 或其他接受图标的 Aurora Plus 组件。图标实现已包含在 Aurora Plus 的发布产物中，只需安装 `aurora-plus`：

```vue
<script setup>
import { AuButton, AuIcon } from 'aurora-plus';
import { IconBold, IconHeart } from 'aurora-plus/icons';
</script>

<template>
  <AuButton :icon="IconBold">加粗</AuButton>
  <AuIcon :icon="IconHeart" size="24" color="#df4c62" aria-label="收藏" />
</template>
```

## 主题

使用 `setAuroraTheme` 在运行时切换亮色和暗色：

```js
import { setAuroraTheme } from 'aurora-plus';

setAuroraTheme('dark');
setAuroraTheme('light');
```

使用 `setAuroraMaterial` 切换玻璃材质，默认 `solid`，可选 `soft`、`clear` 和 `solid`：

```js
import { setAuroraMaterial } from 'aurora-plus';

setAuroraMaterial('clear');
setAuroraMaterial('solid');
```
