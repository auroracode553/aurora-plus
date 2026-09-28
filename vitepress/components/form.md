<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import FormBasic from '../.vitepress/theme/examples/form/FormBasic.vue';
import formBasicSource from '../.vitepress/theme/examples/form/FormBasic.vue?demo-source';
</script>

# Form 表单

`AuForm` 管理字段模型、规则和整体验证，`AuFormItem` 负责标签、错误信息和字段级状态。

## 基础用法

<DemoBlock
  title="基础表单校验"
  :source="formBasicSource"
>
  <FormBasic />
</DemoBlock>

## Form Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 表单模型 | object | {} |
| rules | 按字段路径组织的规则 | object | {} |
| labelPosition | 标签位置 | left / right / top | right |
| labelWidth | 标签宽度 | string / number | '' |
| size | 提供给 FormItem 插槽的尺寸 | small / default / large | default |
| inline | 行内排列 | boolean | false |
| disabled | 提供给 FormItem 插槽的禁用状态 | boolean | false |
| showMessage | 是否显示字段错误 | boolean | true |
| inlineMessage | 错误信息是否与控件同行 | boolean | false |
| statusIcon | 是否显示成功、错误和验证中图标 | boolean | false |
| hideRequiredAsterisk | 隐藏必填星号 | boolean | false |
| requireAsteriskPosition | 星号位置 | left / right | left |
| validateOnRuleChange | 规则变化后重新校验 | boolean | true |
| scrollToError | 整体验证失败时滚动到首个错误 | boolean | false |
| scrollIntoViewOptions | 自动滚动参数；false 使用浏览器默认值 | object / false | { block: 'center', behavior: 'smooth' } |

## Form Events 与 Exposes

| 名称 | 说明 |
| --- | --- |
| validate(prop, valid, message) | 字段完成一次校验 |
| submit(event) | 原生 submit 事件；是否阻止默认行为由使用者决定 |
| validate(callback?) | 验证全部字段，Promise 返回布尔值 |
| validateField(props, callback?) | 验证一个或多个字段 |
| resetFields(props?) | 恢复字段初始值并清除状态 |
| clearValidate(props?) | 清除字段校验状态 |
| scrollToField(prop, options?) | 滚动到字段 |
| getField(prop) | 获取已注册字段上下文 |
| fields | 已注册字段上下文数组 |

## FormItem Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文字 | string | '' |
| labelFor | 标签关联的控件 id | string | '' |
| labelWidth / labelPosition | 覆盖表单标签布局 | string / number | '' |
| prop | 模型字段路径 | string / path[] | '' |
| required | 添加必填规则并显示必填标识 | boolean | false |
| rules | 字段附加规则 | object / array | null |
| error | 外部错误文字 | string | '' |
| validateStatus | 外部状态 | error / success / validating | '' |
| showMessage | 是否显示该字段错误 | boolean | true |
| inlineMessage / statusIcon | 覆盖表单的行内错误 / 状态图标设置 | boolean | — |
| size | 覆盖表单尺寸 | small / default / large | '' |

## FormItem Slots

| 插槽 | 参数 | 说明 |
| --- | --- | --- |
| default | { fieldId, validate, clearValidate, disabled, size, invalid, error, validateStatus } | 字段控件 |
| label | { label } | 自定义标签 |
| error | { error } | 自定义错误内容 |

## FormItem Exposes

| 名称 | 说明 |
| --- | --- |
| validate(trigger?) | 验证当前字段 |
| resetField() | 恢复字段初始值 |
| clearValidate() | 清除验证状态 |
| errorMessage / element | 当前错误文字 / 字段元素 |

## 校验规则

| 字段 | 说明 |
| --- | --- |
| required / whitespace | 必填 / 排除纯空白 |
| type / enum / pattern | 类型、枚举值、正则匹配 |
| len / min / max | 长度或数值限制 |
| transform / defaultField / fields | 值转换与嵌套字段规则 |
| message / trigger | 错误提示与触发时机（change / blur） |
| validator / asyncValidator | 自定义同步或异步校验 |
