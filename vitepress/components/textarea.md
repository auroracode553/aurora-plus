<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TextareaBasic from '../.vitepress/theme/examples/textarea/TextareaBasic.vue';
import textareaBasicSource from '../.vitepress/theme/examples/textarea/TextareaBasic.vue?demo-source';
</script>

# Textarea 多行输入框

`AuTextarea` 用于提交说明、备注和其他多行文本，默认允许垂直调整尺寸。

## 基础用法

<DemoBlock
  title="多行输入与状态"
  description="展示字数限制、小尺寸、只读、错误和禁用状态，输入内容会实时更新下方结果。"
  :source="textareaBasicSource"
>
  <TextareaBasic />
</DemoBlock>

## 使用建议

- 简短单行内容使用 `AuInput`，备注、说明和提交信息使用 `AuTextarea`。
- 需要固定布局时设置 `resize="none"`；允许用户扩展内容区域时保留默认的垂直缩放。
- 错误状态使用 `invalid`，并通过 `aria-describedby` 关联可见的错误说明。

## Textarea API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前内容 | `string / number` | `''` |
| `size` | 尺寸 | `small / default / large` | `default` |
| `rows` | 可见文本行数 | `number / string` | `3` |
| `placeholder` | 占位文本 | `string` | `''` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `maxlength` | 最大字符数 | `number / string` | — |
| `showWordLimit` | 是否显示字数 | `boolean` | `false` |
| `invalid` | 是否显示错误态 | `boolean` | `false` |
| `resize` | 缩放方向 | `none / both / horizontal / vertical` | `vertical` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 内容变化 | `(value)` |
| `input` | 原生 input 触发 | `(value, event)` |
| `change` | 原生 change 触发 | `(value, event)` |
| `focus` | 获得焦点 | `(event)` |
| `blur` | 失去焦点 | `(event)` |

### Exposes

| 方法或属性 | 说明 |
| --- | --- |
| `focus(options?)` | 聚焦输入框 |
| `blur()` | 移除焦点 |
| `select()` | 选中全部内容 |
| `textareaRef` | 内部 textarea 元素引用 |
