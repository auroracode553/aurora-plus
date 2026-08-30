<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TimePickerBasic from '../.vitepress/theme/examples/time-picker/TimePickerBasic.vue';
import timePickerBasicSource from '../.vitepress/theme/examples/time-picker/TimePickerBasic.vue?demo-source';
</script>

# TimePicker 时间选择器

`AuTimePicker` 用于选择本地时、分、秒。浮层内的值先作为草稿编辑，点击“确定”后才更新模型，避免滚动或键盘操作产生中间提交。

时间面板仅在点击输入控件，或聚焦后按方向键时打开；单纯通过 Tab 聚焦不会自动展开。

## 基础用法

<DemoBlock
  title="时间边界与步长"
  description="可限制可用时间范围，并分别控制小时、分钟和秒的选项步长。"
  :source="timePickerBasicSource"
  default-expanded
>
  <TimePickerBasic />
</DemoBlock>

## Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前时间 | `string / Date / number` | `''` |
| `valueType` | 输出类型 | `auto / string / date / timestamp` | `auto` |
| `valueFormat` | 字符串模型格式 | `string` | 随 `showSeconds` |
| `displayFormat` | 显示与手动输入格式 | `string` | 随 `showSeconds` |
| `showSeconds` | 是否显示秒 | `boolean` | `true` |
| `hourStep` / `minuteStep` / `secondStep` | 各时间单位步长 | `number` | `1` |
| `minTime` / `maxTime` | 时间边界 | `string / Date / number` | `null` |
| `disabledTime` | 禁用函数 | `(date) => boolean` | `null` |
| `size` | 尺寸 | `small / default / large` | `default` |
| `placeholder` | 占位文字 | `string` | `选择时间` |
| `disabled` / `readonly` | 禁用 / 只读 | `boolean` | `false` |
| `editable` / `clearable` | 可输入 / 可清空；有值时清除按钮原位替换时间图标 | `boolean` | `true` |
| `invalid` | 外部错误状态 | `boolean` | `false` |
| `placement` | 浮层方位 | `string` | `bottom-start` |
| `teleported` / `appendTo` / `zIndex` | 浮层挂载与层级 | `boolean / string \| Element / number` | `true / body / 1200` |
| `ariaLabel` | 控件无障碍名称 | `string` | `选择时间` |

默认完整格式为 `HH:mm:ss`，隐藏秒后为 `HH:mm`。字符串模型使用本地时间语义；传入 `Date` 时会保留其日期部分并更新时间部分。

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 确认后的值更新 | `(value)` |
| `change` | 有效时间提交 | `(value, date, event)` |
| `clear` | 清空 | `(event)` |
| `focus` / `blur` | 输入框焦点变化 | `(event)` |
| `visible-change` | 浮层显隐变化 | `(visible)` |
| `invalid-input` | 输入无法解析或不可用 | `(text, event)` |

## Exposes

`focus(options?)`、`blur()`、`open()`、`close(reason?)`，以及 `inputRef`、`popoverRef`。
