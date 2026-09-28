<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import DatePickerBasic from '../.vitepress/theme/examples/date-picker/DatePickerBasic.vue';
import datePickerBasicSource from '../.vitepress/theme/examples/date-picker/DatePickerBasic.vue?demo-source';
</script>

# DatePicker 日期选择器

`AuDatePickerPane` 提供可独立嵌入的日历面板，`AuDatePicker` 将面板组合为输入控件，`AuDateTimePicker` 在同一浮层中完成日期与时间确认。

## 基础用法

<DemoBlock
  title="日期与日期时间"
  :source="datePickerBasicSource"
>
  <DatePickerBasic />
</DemoBlock>

## DatePicker API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前日期；范围模式为二元数组 | `string / Date / number / array` | `''` |
| `type` | 单日期或日期范围 | `date / daterange` | `date` |
| `valueType` | 输出类型；`auto` 保留现有模型类型 | `auto / string / date / timestamp` | `auto` |
| `valueFormat` | 字符串模型格式，日期时间默认 `YYYY-MM-DD HH:mm:ss` | `string` | `YYYY-MM-DD` |
| `displayFormat` | 输入框显示与解析格式 | `string` | `YYYY-MM-DD` |
| `size` | 尺寸 | `small / default / large` | `default` |
| `placeholder` | 占位文字 | `string` | `选择日期` |
| `startPlaceholder` / `endPlaceholder` | 范围模式起止占位文字 | `string` | `开始日期 / 结束日期` |
| `rangeSeparator` | 范围输入分隔文字 | `string` | `至` |
| `disabled` / `readonly` | 禁用 / 只读 | `boolean` | `false` |
| `editable` | 是否允许键盘输入 | `boolean` | `true` |
| `clearable` | 是否允许清空；有值时清除按钮原位替换日期图标 | `boolean` | `true` |
| `invalid` | 外部错误状态 | `boolean` | `false` |
| `locale` | `Intl` 区域标识 | `string` | `zh-CN` |
| `firstDayOfWeek` | 每周起始日，`0` 为周日 | `number` | `1` |
| `minDate` / `maxDate` | 日期边界 | `string / Date / number` | `null` |
| `disabledDate` | 返回 `true` 时禁用日期 | `(date) => boolean` | `null` |
| `defaultValue` | 无值时默认展示日期；范围可传数组 | `string / Date / number / array` | `null` |
| `showAdjacentDates` | 是否显示相邻月份日期 | `boolean` | `true` |
| `showToday` | 是否显示“今天”操作 | `boolean` | `true` |
| `unlinkPanels` | 范围模式下两个面板是否独立切月 | `boolean` | `false` |
| `placement` | 浮层方位 | `string` | `bottom-start` |
| `teleported` / `appendTo` / `zIndex` | 浮层挂载与层级 | `boolean / string \| Element / number` | `true / body / 1200` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 日期更新 | `(value)` |
| `change` | 有效日期提交 | `(value, date, event)` |
| `clear` | 清空 | `(event)` |
| `focus` / `blur` | 输入框焦点变化 | `(event)` |
| `visible-change` | 浮层显隐变化 | `(visible)` |
| `invalid-input` | 手动输入无法解析或不可用 | `(text, event)` |
| `panel-change` | 浏览月份变化 | `(viewDate)` |
| `calendar-change` | 范围选择草稿变化 | `([start, end])` |

## DateRangePicker API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 起止日期，支持 `v-model` | `array` | `[]` |
| `valueType` | 输出类型：`auto / string / date / timestamp` | `string` | `auto` |
| `valueFormat` / `displayFormat` | 模型 / 输入框日期格式 | `string` | `YYYY-MM-DD` |
| `size` | 尺寸：`small / default / large` | `string` | `default` |
| `startPlaceholder` / `endPlaceholder` | 起止占位文字 | `string` | `开始日期 / 结束日期` |
| `rangeSeparator` | 范围分隔文字 | `string` | `至` |
| `disabled` / `readonly` / `invalid` | 禁用 / 只读 / 错误状态 | `boolean` | `false` |
| `editable` / `clearable` | 可输入 / 可清空 | `boolean` | `true` |
| `locale` | 区域标识 | `string` | `zh-CN` |
| `firstDayOfWeek` | 每周起始日，`0` 为周日 | `number` | `1` |
| `minDate` / `maxDate` | 可选日期边界 | `string / Date / number` | `null` |
| `disabledDate` | 返回 `true` 时禁用日期 | `(date) => boolean` | `null` |
| `defaultValue` | 无值时默认展示日期 | `array / string / Date / number` | `null` |
| `showAdjacentDates` / `showToday` | 显示相邻月份日期 / 今天操作 | `boolean` | `true` |
| `unlinkPanels` | 两个月份面板独立切换 | `boolean` | `false` |
| `placement` | 浮层方位 | `string` | `bottom-start` |
| `teleported` / `appendTo` / `zIndex` | 浮层挂载与层级 | `boolean / string / Element / number` | `true / body / 1200` |

## DatePickerPane API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前日期 | `string / Date / number` | `''` |
| `valueType` | 输出类型：`auto / string / date / timestamp` | `string` | `auto` |
| `valueFormat` | 字符串模型格式 | `string` | `YYYY-MM-DD` |
| `locale` | 区域标识 | `string` | `zh-CN` |
| `firstDayOfWeek` | 每周起始日，`0` 为周日 | `number` | `1` |
| `minDate` / `maxDate` | 可选日期边界 | `string / Date / number` | `null` |
| `disabledDate` | 返回 `true` 时禁用日期 | `(date) => boolean` | `null` |
| `defaultDate` | 无值时首次展示的月份 | `string / Date / number` | `null` |
| `showAdjacentDates` | 显示相邻月份日期 | `boolean` | `true` |
| `showToday` | 显示今天操作 | `boolean` | `true` |
| `showPreviousMonth` / `showNextMonth` | 显示切月按钮 | `boolean` | `true` |
| `rangeStart` / `rangeEnd` | 范围起止日期 | `string / Date / number` | `null` |
| `hoverDate` | 范围预览日期 | `string / Date / number` | `null` |
| `rangeSelecting` | 范围选择进行中 | `boolean` | `false` |
| `surface` | 显示独立材质与边框 | `boolean` | `true` |

## DateTimePicker API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前日期时间，支持 `v-model` | `string / Date / number` | `''` |
| `valueType` | 输出类型：`auto / string / date / timestamp` | `string` | `auto` |
| `valueFormat` / `displayFormat` | 模型 / 输入框格式；默认随 `showSeconds` | `string` | 自动 |
| `size` | 尺寸：`small / default / large` | `string` | `default` |
| `placeholder` | 占位文字 | `string` | `选择日期和时间` |
| `disabled` / `readonly` / `invalid` | 禁用 / 只读 / 错误状态 | `boolean` | `false` |
| `editable` / `clearable` | 可输入 / 可清空 | `boolean` | `true` |
| `locale` | 区域标识 | `string` | `zh-CN` |
| `firstDayOfWeek` | 每周起始日，`0` 为周日 | `number` | `1` |
| `showAdjacentDates` / `showSeconds` | 显示相邻月份日期 / 秒 | `boolean` | `true` |
| `hourStep` / `minuteStep` / `secondStep` | 时间选项步长 | `number` | `1` |
| `minDate` / `maxDate` | 日期时间边界 | `string / Date / number` | `null` |
| `disabledDate` / `disabledTime` | 日期 / 时间禁用函数 | `(date) => boolean` | `null` |
| `placement` | 浮层方位 | `string` | `bottom-start` |
| `teleported` / `appendTo` / `zIndex` | 浮层挂载与层级 | `boolean / string / Element / number` | `true / body / 1200` |
