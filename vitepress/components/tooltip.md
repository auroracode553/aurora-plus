<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TooltipBasic from '../.vitepress/theme/examples/tooltip/TooltipBasic.vue';
import tooltipBasicSource from '../.vitepress/theme/examples/tooltip/TooltipBasic.vue?demo-source';
</script>

# Tooltip 文字提示

用于解释图标按钮、缩略文本或状态。提示层默认 Teleport 到 `body`，滚动时更新位置，主轴空间不足时自动翻转。

## 基础用法

<DemoBlock
  title="方向与自定义内容"
  description="方向配置来自 tooltipItems 数组；将鼠标移到按钮上或使用键盘聚焦按钮。"
  :source="tooltipBasicSource"
>
  <TooltipBasic />
</DemoBlock>

## Placement

支持 `top`、`bottom`、`left`、`right`，并可添加 `-start` 或 `-end` 对齐后缀，例如 `bottom-start`。当首选方向越过视口边界时，组件会在主轴方向翻转；交叉轴位置会被限制在视口内。

## Tooltip API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `content` | 提示文本；有 `content` 插槽时作为回退内容 | `string / number` | `''` |
| `placement` | 首选方向与对齐方式 | `AuTooltipPlacement` | `top` |
| `offset` | 提示层与目标的距离，单位 px | `number` | `10` |
| `showAfter` | 显示延迟，单位 ms | `number` | `220` |
| `hideAfter` | 隐藏延迟，单位 ms | `number` | `80` |
| `disabled` | 是否禁用提示 | `boolean` | `false` |
| `maxWidth` | 最大宽度；数字会转换为 px | `string / number` | `280` |
| `teleported` | 是否传送到 `appendTo` | `boolean` | `true` |
| `appendTo` | Teleport 目标 | `string / HTMLElement` | `body` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 触发提示的内容区域 |
| `content` | 自定义提示内容 |

### Exposes

| 方法 | 说明 |
| --- | --- |
| `show()` | 按 `showAfter` 延迟显示提示 |
| `hide()` | 按 `hideAfter` 延迟隐藏提示 |
| `updatePosition()` | 立即重新计算提示层位置 |
