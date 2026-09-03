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
  description="全选项通过 indeterminate 表示部分选中；选项组使用数组模型维护多个 value。"
  :source="checkboxBasicSource"
>
  <CheckboxBasic />
</DemoBlock>

## 使用建议

- 单个设置使用布尔值模型；同组多选时让每个复选框传入不同的 `value`，并绑定到同一个数组。
- 全选控件使用 `indeterminate` 告知用户当前处于部分选择状态，业务层负责计算全选和半选逻辑。
- 异步提交期间使用 `loading`，它会替换选择标记、设置 `aria-busy` 并阻止重复切换。
- 复选框文字应说明选择后影响的范围；只有图形时请透传 `aria-label`。
- 不要用复选框代替需要立即生效的二元开关，后者使用 `AuSwitch` 更清晰。

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

`size` 可选 `small`、`default`、`large`。未声明的属性会透传到原生 `input`，例如 `id`、`aria-describedby` 和 `form`。

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 选择状态变化后更新绑定值 | `(value)` |
| `change` | 原生 change 事件处理完成后触发 | `(value, event)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义复选框文字；存在时优先于 `label` |

组件使用原生 checkbox 语义，并在半选状态同步 `aria-checked="mixed"`。点击文字区域也会触发选择。
