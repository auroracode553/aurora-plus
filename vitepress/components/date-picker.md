<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import DatePickerBasic from '../.vitepress/theme/examples/date-picker/DatePickerBasic.vue';
import datePickerBasicSource from '../.vitepress/theme/examples/date-picker/DatePickerBasic.vue?demo-source';
</script>

# DatePicker 日期选择器

`AuDatePickerPane` 提供可独立嵌入的日历面板，`AuDatePicker` 将面板组合为输入控件，`AuDateTimePicker` 在同一浮层中完成日期与时间确认。组件使用本地日期语义，不会把纯日期转换为 UTC。

## 基础用法

<DemoBlock
  title="日期与日期时间"
  description="面板仅在点击输入控件或使用键盘打开时显示；日期选择即时提交，日期时间在点击确定后提交。"
  :source="datePickerBasicSource"
  default-expanded
>
  <DatePickerBasic />
</DemoBlock>

`AuDatePickerPane` 是不包含触发器的裸面板，直接使用时会像普通内容一样常驻显示；需要点击后弹出的日期控件应使用 `AuDatePicker`。业务确实需要自行控制裸面板时，可配合 `v-if` 管理其显隐。

## 值与格式

- 默认字符串格式分别为 `YYYY-MM-DD` 和 `YYYY-MM-DD HH:mm:ss`；可用标记为 `YYYY`、`MM`、`DD`、`HH`、`mm`、`ss`。
- `valueType="auto"` 会保留已有值的类型：`Date` 继续回传 `Date`，时间戳继续回传时间戳，其余情况回传字符串。也可显式指定 `string`、`date` 或 `timestamp`。
- `valueFormat` 控制字符串模型格式，`displayFormat` 只控制输入框显示与手动输入格式。
- `disabledDate(date)` 应返回布尔值；返回 `true` 的日期不可选择。

## DatePicker API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前日期 | `string / Date / number` | `''` |
| `valueType` | 输出类型 | `auto / string / date / timestamp` | `auto` |
| `valueFormat` | 字符串模型格式 | `string` | `YYYY-MM-DD` |
| `displayFormat` | 输入框显示与解析格式 | `string` | `YYYY-MM-DD` |
| `size` | 尺寸 | `small / default / large` | `default` |
| `placeholder` | 占位文字 | `string` | `选择日期` |
| `disabled` / `readonly` | 禁用 / 只读 | `boolean` | `false` |
| `editable` | 是否允许键盘输入 | `boolean` | `true` |
| `clearable` | 是否允许清空；有值时清除按钮原位替换日期图标 | `boolean` | `true` |
| `invalid` | 外部错误状态 | `boolean` | `false` |
| `locale` | `Intl` 区域标识 | `string` | `zh-CN` |
| `firstDayOfWeek` | 每周起始日，`0` 为周日 | `number` | `1` |
| `minDate` / `maxDate` | 日期边界 | `string / Date / number` | `null` |
| `disabledDate` | 日期禁用函数 | `(date) => boolean` | `null` |
| `showAdjacentDates` | 是否显示相邻月份日期 | `boolean` | `true` |
| `showToday` | 是否显示“今天”操作 | `boolean` | `true` |
| `placement` | 浮层方位 | `string` | `bottom-start` |
| `teleported` / `appendTo` / `zIndex` | 浮层挂载与层级 | `boolean / string \| Element / number` | `true / body / 1200` |
| `ariaLabel` | 控件无障碍名称 | `string` | `选择日期` |

`class` 和 `style` 作用于组件外壳；`name` 会生成隐藏表单字段，其他原生属性传给可编辑输入框。

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

### Exposes

`focus(options?)`、`blur()`、`open()`、`close(reason?)`，以及 `inputRef`、`paneRef`、`popoverRef`。

## DatePickerPane API

面板支持 `modelValue`、`valueType`、`valueFormat`、`locale`、`firstDayOfWeek`、`minDate`、`maxDate`、`disabledDate`、`showAdjacentDates` 和 `ariaLabel`，并额外提供：

| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| `defaultDate` | 无值时首次展示的月份 | `null` |
| `showToday` | 显示今天操作 | `true` |
| `surface` | 显示独立材质、边框与层级 | `true` |

事件包括 `update:modelValue`、`change(value, date, event)`、`select(value, date, event)` 和 `panel-change(viewDate)`；`footer` 插槽接收 `today()`。面板暴露 `focus()`、`showDate(value)` 和 `paneRef`。

键盘可使用方向键按日 / 周移动，`Home` / `End` 移动到周边界，`PageUp` / `PageDown` 切换月份，配合 Shift 切换年份，Enter 或空格选择。

## DateTimePicker API

日期时间选择器继承 DatePicker 的输入、浮层、日期边界和格式属性，并增加：

| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| `showSeconds` | 是否显示秒；未设置格式时同步切换短格式 | `true` |
| `hourStep` / `minuteStep` / `secondStep` | 时间选项步长 | `1` |
| `disabledTime` | 日期时间禁用函数 `(date) => boolean` | `null` |

默认 `valueFormat` 与 `displayFormat` 为 `YYYY-MM-DD HH:mm:ss`；隐藏秒时为 `YYYY-MM-DD HH:mm`。事件和 Exposes 与 DatePicker 一致，`datePaneRef` 代替 `paneRef`。
