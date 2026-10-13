<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import NumberBasic from '../.vitepress/theme/examples/number/NumberBasic.vue';
import exampleSource from '../.vitepress/theme/examples/number/NumberBasic.vue?demo-source';
</script>

# Number 滚动数字

`AuNumber` 逐位滚动展示数值，支持负数、小数和千分位。数字字号继承外部文字样式。

## 基础用法

<DemoBlock :source="exampleSource">
  <NumberBasic />
</DemoBlock>

`null`、`undefined`、NaN 和无穷值显示 `—`。精度限制在 0–20 位；地区设置控制分隔符，数字统一使用 0–9。无效地区设置回退为 en-US。

## Number API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 显示数值 | number | null |
| precision | 小数位数 | number | 0 |
| grouping | 启用千分位分组 | boolean | true |
| locale | 数字格式地区 | string | en-US |
| animated | 启用滚动过渡 | boolean | true |
