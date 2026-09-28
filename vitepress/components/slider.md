<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import SliderBasic from '../.vitepress/theme/examples/slider/SliderBasic.vue';
import sliderBasicSource from '../.vitepress/theme/examples/slider/SliderBasic.vue?demo-source';
</script>

# Slider 滑块

`AuSlider` 用于在连续或分级数值范围内选择单个值，适合权重、强度、音量和模型参数等设置。

## 基础用法

<DemoBlock
  title="权重与参数调节"
  :source="sliderBasicSource"
>
  <SliderBasic />
</DemoBlock>

## Slider API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前值；交互后统一回传数字 | number / string | 0 |
| min | 最小值 | number / string | 0 |
| max | 最大值 | number / string | 100 |
| step | 步进，必须大于 0 | number / string | 1 |
| size | 尺寸，可选 small / default / large | string | default |
| disabled | 是否禁用 | boolean | false |
| showValue | 是否在轨道右侧显示格式化后的当前值 | boolean | false |
| formatValue | 格式化显示值 | (value: number) =&gt; string | null |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 数值变化 | (value: number) |
| input | 拖动或键盘调整过程中的连续变化 | (value: number, event) |
| change | 指针操作结束或原生键盘调整提交 | (value: number, event) |
| focus | 内部滑块获得焦点 | (event) |
| blur | 内部滑块失去焦点 | (event) |

### Slots

| 插槽名 | 说明 | 插槽参数 |
| --- | --- | --- |
| value | 自定义行内值；使用后即使未设置 showValue 也会显示 | { value, formattedValue, percentage } |

### Exposes

| 方法或属性 | 说明 |
| --- | --- |
| focus(options?) | 聚焦内部滑块 |
| blur() | 移除焦点 |
| inputRef | 内部原生 input[type="range"] 元素引用 |
