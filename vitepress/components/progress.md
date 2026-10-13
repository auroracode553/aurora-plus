<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import ProgressBasic from '../.vitepress/theme/examples/progress/ProgressBasic.vue';
import exampleSource from '../.vitepress/theme/examples/progress/ProgressBasic.vue?demo-source';
</script>

# Progress 进度

`AuProgress` 支持线形、圆环和刻度环进度，数值变化时平滑过渡。

## 基础用法

<DemoBlock :source="exampleSource">
  <ProgressBasic />
</DemoBlock>

进度限制在 0–100，非有限值按 0 处理。`width` 用于圆环和刻度环，`strokeWidth` 用于线形和圆环，限制在 1–20px；刻度环使用固定细刻度。

## Progress API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| percentage | 进度百分比 | number | 0 |
| type | 类型：line / circle / ticks | string | line |
| status | 语义状态：空字符串 / success / warning / danger | string | '' |
| showText | 显示文字 | boolean | true |
| format | 文字格式化函数 | (percentage) => string | null |
| width | 圆环宽度，正数像素值 | number | 96 |
| strokeWidth | 线形高度或圆环描边宽度 | number | 4 |
| ticks | 刻度数量，限制在 4–120 | number | 60 |
| animated | 启用进度过渡 | boolean | true |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 进度文字，参数 `{ percentage }` |
