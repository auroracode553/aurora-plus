<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import InputBasic from '../.vitepress/theme/examples/input/InputBasic.vue';
import inputBasicSource from '../.vitepress/theme/examples/input/InputBasic.vue?demo-source';
</script>

# Input 输入框

`AuInput` 用于搜索、路径、账号和普通单行文本输入。组件保留原生 input 的行为，并统一尺寸、焦点、错误态与主题适配。

## 基础用法

<DemoBlock
  title="常用输入状态"
  description="支持搜索、清空、前后缀、字数限制、只读、错误和禁用状态。"
  :source="inputBasicSource"
  default-expanded
>
  <InputBasic />
</DemoBlock>

## 使用建议

- 使用 `v-model` 管理值；组件始终通过字符串回传用户输入，与原生 input 行为一致。
- 搜索框可设置 `type="search"`，需要组件内清除内容时增加 `clearable`。
- `invalid` 只负责错误视觉与 `aria-invalid`，具体错误文字由表单布局通过 `aria-describedby` 关联。
- `prefixIcon`、`suffixIcon` 接受 Aurora Plus 图标组件；复杂内容使用同名插槽。
- 中文、日文等输入法组合输入结束后才会更新 `v-model`，避免过滤列表在拼写过程中抖动。

## Input API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前输入值 | `string / number` | `''` |
| `type` | 原生 input 类型 | `string` | `text` |
| `size` | 尺寸，可选 `small / default / large` | `string` | `default` |
| `placeholder` | 占位文字 | `string` | `''` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `clearable` | 有内容时是否显示清除按钮 | `boolean` | `false` |
| `clearableWhenReadonly` | 原生输入只读时是否仍允许独立的清空操作 | `boolean` | `false` |
| `replaceSuffixOnClear` | 有内容且可清空时，是否用清除按钮替换后缀内容 | `boolean` | `false` |
| `prefixIcon` | 前缀图标组件 | `Component` | `null` |
| `suffixIcon` | 后缀图标组件 | `Component` | `null` |
| `maxlength` | 原生最大字符数 | `number / string` | `null` |
| `showWordLimit` | 设置 maxlength 后是否显示字数 | `boolean` | `false` |
| `invalid` | 是否显示错误状态并设置 `aria-invalid` | `boolean` | `false` |

`class` 与 `style` 作用于组件外壳，其余未声明属性和原生监听器会传递给内部 input，例如 `name`、`autocomplete`、`spellcheck`、`aria-*` 和 `@keydown`。

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 输入值变化 | `(value)` |
| `input` | 完成一次有效输入 | `(value, event)` |
| `change` | 触发原生 change | `(value, event)` |
| `clear` | 点击清除按钮 | `()` |
| `focus` | 输入框获得焦点 | `(event)` |
| `blur` | 输入框失去焦点 | `(event)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `prefix` | 自定义前缀，优先于 `prefixIcon` |
| `suffix` | 自定义后缀，优先于 `suffixIcon` |

### Exposes

| 属性或方法 | 说明 |
| --- | --- |
| `focus(options?)` | 聚焦原生输入框 |
| `blur()` | 移除焦点 |
| `select()` | 选中全部文字 |
| `inputRef` | 原生 input 元素引用 |
