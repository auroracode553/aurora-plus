<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import CheckboxBasic from '../.vitepress/theme/examples/checkbox/CheckboxBasic.vue';
import checkboxBasicSource from '../.vitepress/theme/examples/checkbox/CheckboxBasic.vue?demo-source';
</script>

# Checkbox 多选框

用于表达可独立选择的选项，也可以把多个复选框绑定到同一个数组来管理多选结果。

## 基础用法

<DemoBlock
  title="布尔值、数组与半选"
  :source="checkboxBasicSource"
>
  <CheckboxBasic />
</DemoBlock>

## Checkbox API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前值；传数组时启用多选模式 | `boolean / array` | `false` |
| `value` | 数组模式下当前选项的值 | `string / number / boolean / object` | `true` |
| `trueValue` | 非数组模型选中时写入的值 | `boolean / string / number` | `true` |
| `falseValue` | 非数组模型取消时写入的值 | `boolean / string / number` | `false` |
| `label` | 复选框文字 | `string` | `''` |
| `name` | 原生表单名称 | `string` | `''` |
| `indeterminate` | 是否显示半选状态 | `boolean` | `false` |
| `size` | 控件尺寸 | `string` | `default` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `loading` | 是否处于加载中；开启时不可切换 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 选择状态变化后更新绑定值 | `(value)` |
| `change` | 原生 change 事件处理完成后触发 | `(value, event)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义复选框文字；存在时优先于 `label` |
