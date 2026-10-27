<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TrendBasic from '../.vitepress/theme/examples/trend/TrendBasic.vue';
import exampleSource from '../.vitepress/theme/examples/trend/TrendBasic.vue?demo-source';
</script>

# Trend 变化幅度

`AuTrend` 使用方向标记和语义色展示上升、下降、持平或新增状态。

## 基础用法

<DemoBlock :source="exampleSource">
  <TrendBasic />
</DemoBlock>

`fresh` 用于无法与上一值比较的新增状态，显示「新增」。无有效数值时显示 `—`；`reverse` 只反转颜色含义，保留数值正负与方向。

## Trend API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 变化幅度 | number | null |
| precision | 小数位数，限制在 0–20 | number | 1 |
| suffix | 数值后缀 | string | % |
| fresh | 显示新增状态 | boolean | false |
| reverse | 下降为正向，上升为负向 | boolean | false |
| label | 悬停说明 | string | '' |
