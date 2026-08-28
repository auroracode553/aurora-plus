<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import SelectBasic from '../.vitepress/theme/examples/select/SelectBasic.vue';
import selectBasicSource from '../.vitepress/theme/examples/select/SelectBasic.vue?demo-source';
</script>

# Select 选择器

`AuSelect` 使用原生下拉选择能力，并统一 Aurora UI 的尺寸、焦点、禁用态和错误态。

## 基础用法

<DemoBlock
  title="原生选项与尺寸"
  description="选择器保留系统下拉行为，同时提供 Aurora UI 的默认、小尺寸和禁用状态。"
  :source="selectBasicSource"
>
  <SelectBasic />
</DemoBlock>

## 使用建议

- 选项较少且互斥时使用 `AuSelect`；需要执行命令的操作集合使用 `AuDropdown`。
- 通过默认插槽传入原生 `option` 或 `optgroup`，不要在业务层覆盖选择器内部样式。
- 字段名称使用可见的 `label`，错误状态同时提供文字说明。

## Select API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前选中值 | `string / number / boolean` | `''` |
| `size` | 尺寸 | `small / default / large` | `default` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `invalid` | 是否显示错误态 | `boolean` | `false` |

未声明的原生 select 属性与监听器会透传给内部选择框。

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 选中值变化 | `(value)` |
| `change` | 原生 change 触发 | `(value, event)` |
| `focus` | 获得焦点 | `(event)` |
| `blur` | 失去焦点 | `(event)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 原生 `option` 或 `optgroup` 内容 |

### Exposes

| 方法或属性 | 说明 |
| --- | --- |
| `focus(options?)` | 聚焦选择框 |
| `blur()` | 移除焦点 |
| `selectRef` | 内部 select 元素引用 |
