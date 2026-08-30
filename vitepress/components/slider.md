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
  description="复用同一个滑块处理整数百分比和小数步进；标题、当前值与两端说明由业务布局自由组合。"
  :source="sliderBasicSource"
  default-expanded
>
  <SliderBasic />
</DemoBlock>

## 使用建议

- 使用 `v-model` 接收数值；拖动和键盘调整都会回传 `number`。
- 为没有可见 `<label>` 的滑块设置准确的 `aria-label`，例如“主力资金权重”，不要只写“滑块”。
- 当前值、单位和两端说明属于业务语义，优先放在滑块外部；紧凑行内布局可使用 `showValue`。
- `formatValue` 同时格式化 `showValue` 的内容和无障碍值文本，适合百分比、温度或带单位数值。
- 单次选择两个端点属于区间选择场景，不应把两个 `AuSlider` 叠放在同一轨道上。

## Slider API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前值；交互后统一回传数字 | `number / string` | `0` |
| `min` | 最小值 | `number / string` | `0` |
| `max` | 最大值 | `number / string` | `100` |
| `step` | 步进，必须大于 `0` | `number / string` | `1` |
| `size` | 尺寸，可选 `small / default / large` | `string` | `default` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `showValue` | 是否在轨道右侧显示格式化后的当前值 | `boolean` | `false` |
| `formatValue` | 格式化显示值与 `aria-valuetext` | `(value: number) => string` | `null` |

当前值会限制在 `min` 与 `max` 之间，并以 `min` 为基准吸附到最近的 `step`。当 `min` 大于 `max` 时组件按数值大小重新确定范围；无效或非正数 `step` 回退为 `1`。

`class` 与 `style` 作用于组件外壳，其余未声明属性和原生监听器传递给内部 `input[type="range"]`，包括 `id`、`name`、`aria-*` 和键盘监听器。

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 数值变化 | `(value: number)` |
| `input` | 拖动或键盘调整过程中的连续变化 | `(value: number, event)` |
| `change` | 指针操作结束或原生键盘调整提交 | `(value: number, event)` |
| `focus` | 内部滑块获得焦点 | `(event)` |
| `blur` | 内部滑块失去焦点 | `(event)` |

### Slots

| 插槽名 | 说明 | 插槽参数 |
| --- | --- | --- |
| `value` | 自定义行内值；使用后即使未设置 `showValue` 也会显示 | `{ value, formattedValue, percentage }` |

### Exposes

| 方法或属性 | 说明 |
| --- | --- |
| `focus(options?)` | 聚焦内部滑块 |
| `blur()` | 移除焦点 |
| `inputRef` | 内部原生 `input[type="range"]` 元素引用 |

组件支持点击轨道、指针拖动、触控拖动以及原生方向键、Home、End、Page Up 和 Page Down 操作。拖动使用 Pointer Capture，指针离开轨道后仍可连续调整；焦点轮廓、高对比度和 RTL 方向均会自动适配。
