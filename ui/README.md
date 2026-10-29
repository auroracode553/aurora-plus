# Aurora Plus

Aurora Plus 是 Vue 3 通用组件库，npm 包名为 `aurora-plus`。公共 API 使用 `Au` 前缀，支持完整安装、按需导入和命令式服务。

## 当前组件

| 导出 | 用途 |
| --- | --- |
| `AuBadge` | 数字、文字和状态点徽章 |
| `AuTag` | 语义色标签、状态点与关闭操作 |
| `AuAvatar` | 图片头像、姓名缩写与加载失败回退 |
| `AuNumber` | 支持小数、负数和地区格式的逐位滚动数字 |
| `AuTrend` | 变化幅度与方向语义 |
| `AuSegmented` | 带滑动材质选中层的分段选择器 |
| `AuEmpty` | 图标、说明和操作区组成的空状态 |
| `AuProgress` | 线形、圆环与刻度环进度 |
| `AuPageHeader` | 标题、说明、返回事件与操作区 |
| `AuTransition`、`AuTransitionGroup` | 内容显隐、列表增删与依次进入动画 |
| `AuButton` | 多类型、多尺寸、加载态按钮 |
| `AuButtonGroup`、`AuButtonGroupItem` | 控制组容器与专用操作项 |
| `AuDivider` | 横向与纵向内容分割线 |
| `AuLink` | 支持语义类型、下划线策略、禁用态与图标的文字链接 |
| `AuInput` | 通过 `type` 支持单行、密码和 `textarea` 多行输入，支持清空、前后缀和错误态 |
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
| `AuCollapse`、`AuCollapseItem` | 独立折叠面板、多项展开与手风琴，支持懒加载、关闭销毁及独立操作区 |
| `AuPopover` | 支持任意内容、自动翻转和视口避让的锚点浮层 |
| `AuPopconfirm` | 锚定触发元素的轻量确认气泡 |
| `AuPagination` | 页码折叠、条数切换和跳页导航 |
| `AuTabs` | 紧凑的受控标签页导航 |
| `AuCard` | 卡片容器，提供表面层级、内容内边距和可选悬停抬升 |
| `AuSkeleton`、`AuSkeletonItem` | 支持自定义占位模板、重复数量、呼吸动画和延迟显隐的骨架屏 |
| `AuIcon` | 图标尺寸、颜色与对齐外壳 |
| `AuTooltip` | 自动翻转、视口避让的提示气泡 |
| `AuHelpTooltip` | 圆形问号图标提示，支持悬浮说明、点击保留、点击外部关闭与长正文滚动 |
| `AuDialog` | 模态对话框 |
| `AuAboutDialog` | 应用信息、版本日志与可展开详情的通用关于对话框 |
| `AuUpdateDialog` | 检查更新、版本说明、下载进度、安装与失败重试的受控界面，展示更新服务提供的多源状态 |
| `AuDrawer` | 支持四向打开、焦点管理与关闭守卫的抽屉面板 |
| `AuLoading`、`vLoading` | 组件、指令及 `AuLoading.service(options)` 命令式加载服务 |
| `AuLoadingSpinner` | 按钮、表单控件和数据组件复用的加载图标 |
| `AuVirtualList` | 固定行高虚拟列表 |
| `AuTable`、`AuTableColumn` | 默认无外框，支持声明式列、内容自适应行高、固定列、排序、行选择与索引列 |
| `AuVirtualTable` | 共用列与选择 API 的固定行高虚拟表格，默认无外框 |
| `AuImagePreview` | 多图切换、缩放、拖拽与旋转图片预览器 |
| `AuTree` | 支持虚拟滚动、选中与折叠的树形导航 |
| `AuContextMenu` | 配置式右键菜单 |
| `AuFloatingToolbar` | 锚点浮动工具条 |
| `AuWindowTitleBar` | 桌面无边框窗口的受控标题栏 |
| `AuMessage` | 命令式消息提示 |
| `AuMessageBox` | Promise 风格确认框 |

## 交互动效

组件共用状态过渡、按压回弹、浮层进退和进度动画。动效时长与曲线由全局 `--au-transition-duration`、`--au-transition-timing` 控制。自定义元素可使用 `au-motion-state`、`au-motion-control`、`au-motion-row`、`au-motion-lift`、`au-motion-reveal`、`au-motion-pulse` 和 `au-spin`；内容显隐与列表增删、排序可使用 `AuTransition`、`AuTransitionGroup`。

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
  <AuIcon :icon="IconHeart" size="24" color="#df4c62" />
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
