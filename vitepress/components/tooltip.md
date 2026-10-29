<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TooltipBasic from '../.vitepress/theme/examples/tooltip/TooltipBasic.vue';
import tooltipBasicSource from '../.vitepress/theme/examples/tooltip/TooltipBasic.vue?demo-source';
import HelpTooltipBasic from '../.vitepress/theme/examples/tooltip/HelpTooltipBasic.vue';
import helpTooltipBasicSource from '../.vitepress/theme/examples/tooltip/HelpTooltipBasic.vue?demo-source';
</script>

# Tooltip 文字提示

用于解释图标按钮、缩略文本或状态。

首选方向与对侧空间均不足时隐藏气泡。Teleport 不会超出宿主视图边界。

## 基础用法

<DemoBlock
  title="方向与自定义内容"
  :source="tooltipBasicSource"
>
  <TooltipBasic />
</DemoBlock>

## HelpTooltip 图标提示

`AuHelpTooltip` 提供 16px 圆形问号图标，悬浮立即显示说明，点击后保留；点击外部、窗口失焦、禁用或 `active` 变为 `false` 时关闭。没有标题、正文、说明行或内容插槽时不显示入口。

说明可通过 `title`、`content` 和 `lines` 组合，也可用 `content` 插槽完全提供。正文完整换行，内容区最高 60vh，超出后在提示内部滚动；浮层的翻转和视口边界沿用 Tooltip。

<DemoBlock title="圆形图标与多行说明" :source="helpTooltipBasicSource">
  <HelpTooltipBasic />
</DemoBlock>

### HelpTooltip Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 说明标题 | string | '' |
| content | 说明正文 | string / number | '' |
| lines | 多行说明，按顺序展示 | string[] | [] |
| size | 图标尺寸；数字单位 px | string / number | 16 |
| placement | 首选方向，支持四向及 -start / -end | string | bottom |
| offset | 气泡距图标的距离，单位 px | number | 10 |
| maxWidth | 最大宽度；数字单位 px | string / number | 360 |
| active | 所属视图是否活动；关闭时立即停止提示 | boolean | true |
| disabled | 禁用提示 | boolean | false |

### HelpTooltip Slots

| 插槽名 | 说明 |
| --- | --- |
| content | 完全替代 title、content 和 lines 的正文 |

### HelpTooltip Exposes

| 方法 | 说明 |
| --- | --- |
| show() | 显示并保留提示；禁用或非活动时无效 |
| hide() | 关闭提示 |
| updatePosition() | 重新计算浮层位置 |

## Tooltip API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示文本；有 content 插槽时作为回退内容 | string / number | '' |
| placement | 首选方向与对齐方式 | AuTooltipPlacement | top |
| offset | 提示层与目标的距离，单位 px | number | 10 |
| showAfter | 显示延迟，单位 ms | number | 220 |
| hideAfter | 隐藏延迟，单位 ms | number | 80 |
| disabled | 是否禁用提示 | boolean | false |
| fillTrigger | 触发区域是否填满父容器高度 | boolean | false |
| maxWidth | 最大宽度；数字会转换为 px | string / number | 280 |
| teleported | 是否传送到 appendTo | boolean | true |
| appendTo | Teleport 目标 | string / HTMLElement | body |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| open | 显示延迟结束后、气泡挂载前触发；宿主可据此扩展视图 | — |
| closed | 气泡退场结束或组件卸载后触发；挂载前取消也会释放打开状态 | — |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 触发提示的内容区域 |
| content | 自定义提示内容 |

### Exposes

| 方法 | 说明 |
| --- | --- |
| show() | 按 showAfter 延迟显示提示 |
| hide() | 按 hideAfter 延迟隐藏提示 |
| updatePosition() | 立即重新计算提示层位置 |
