<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import FormBasic from '../.vitepress/theme/examples/form/FormBasic.vue';
import formBasicSource from '../.vitepress/theme/examples/form/FormBasic.vue?demo-source';
</script>

# Form 表单

`AuForm` 管理字段模型、规则和整体验证，`AuFormItem` 负责标签、错误信息和字段级状态。它们不改变内部控件的值，适合组合 Aurora UI 控件或原生表单元素。

## 基础用法

<DemoBlock
  title="字段校验"
  description="字段变化与失焦可触发不同规则，提交时统一验证，重置恢复组件挂载时的初始值。"
  :source="formBasicSource"
  default-expanded
>
  <FormBasic />
</DemoBlock>

## 校验规则

规则支持 `required`、`type`、`enum`、`pattern`、`len`、`min`、`max`、`message` 和 `trigger`。`trigger` 可为 `change`、`blur` 或数组；未设置时所有验证入口都会执行。`validator(rule, value, callback, model)` 可以同步返回、返回 Promise，或调用 callback。

`type` 支持 `string`、`number`、`integer`、`boolean`、`array`、`object`、`date`、`email` 和 `url`。字符串与数组的 `min` / `max` 表示长度，数字则比较数值。

## Form Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model` | 表单模型 | `object` | `{}` |
| `rules` | 按字段路径组织的规则 | `object` | `{}` |
| `labelPosition` | 标签位置 | `left / right / top` | `right` |
| `labelWidth` | 标签宽度 | `string / number` | `''` |
| `size` | 提供给 FormItem 插槽的尺寸 | `small / default / large` | `default` |
| `inline` | 行内排列 | `boolean` | `false` |
| `disabled` | 提供给 FormItem 插槽的禁用状态 | `boolean` | `false` |
| `showMessage` | 是否显示字段错误 | `boolean` | `true` |
| `validateOnRuleChange` | 规则变化后重新校验 | `boolean` | `true` |
| `scrollToError` | 整体验证失败时滚动到首个错误 | `boolean` | `false` |

`size`、`disabled`、`invalid`、`error` 和 `fieldId` 通过 FormItem 默认插槽参数提供，避免表单直接修改子组件内部属性。需要同步控件错误外观时可将 `invalid` 绑定给输入控件。

## Form Events 与 Exposes

| 名称 | 说明 |
| --- | --- |
| `validate(prop, valid, message)` | 字段完成一次校验 |
| `submit(event)` | 原生 submit 事件；是否阻止默认行为由使用者决定 |
| `validate(callback?)` | 验证全部字段，Promise 返回布尔值 |
| `validateField(props, callback?)` | 验证一个或多个字段 |
| `resetFields(props?)` | 恢复字段初始值并清除状态 |
| `clearValidate(props?)` | 清除字段校验状态 |
| `scrollToField(prop, options?)` | 滚动到字段 |

字段路径支持 `profile.name` 和 `items[0].title`。

## FormItem Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `label` | 标签文字 | `string` | `''` |
| `labelFor` | 标签关联的控件 id | `string` | `''` |
| `labelWidth` / `labelPosition` | 覆盖表单标签布局 | `string / number` | `''` |
| `prop` | 模型字段路径 | `string` | `''` |
| `required` | 仅显示必填标识；校验仍应配置规则 | `boolean` | `false` |
| `rules` | 字段附加规则 | `object / array` | `null` |
| `error` | 外部错误文字 | `string` | `''` |
| `validateStatus` | 外部状态 | `error / success / validating` | `''` |
| `showMessage` | 是否显示该字段错误 | `boolean` | `true` |
| `size` | 覆盖表单尺寸 | `small / default / large` | `''` |

插槽包括 `default`、`label` 和 `error`。组件暴露 `validate(trigger?)`、`resetField()`、`clearValidate()`、`errorMessage` 与 `element`。
