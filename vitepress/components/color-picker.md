<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import ColorPickerBasic from '../.vitepress/theme/examples/color-picker/ColorPickerBasic.vue';
import colorPickerBasicSource from '../.vitepress/theme/examples/color-picker/ColorPickerBasic.vue?demo-source';
</script>

# ColorPicker 颜色选择器

`AuColorPicker` 使用系统取色面板，并提供与 Aurora UI 按钮一致的紧凑尺寸和焦点反馈。

## 基础用法

<DemoBlock
  title="颜色与尺寸"
  description="三个尺寸可以绑定同一个颜色值；点击任意可用控件会打开系统取色面板。"
  :source="colorPickerBasicSource"
>
  <ColorPickerBasic />
</DemoBlock>

## 使用建议

- `modelValue` 使用完整的六位十六进制颜色，例如 `#3478f6`。
- 每个颜色控件都应提供描述用途的 `aria-label`，不要只写“选择颜色”。
- 禁用状态用于展示不可修改的颜色；需要展示颜色值时在控件旁提供文本。

## ColorPicker API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前十六进制颜色 | `string` | `#000000` |
| `fallback` | 当前值不是六位十六进制颜色时的显示值 | `string` | `#ffffff` |
| `size` | 尺寸 | `small / default / large` | `default` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `ariaLabel` | 无障碍名称 | `string` | `选择颜色` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 颜色变化 | `(value)` |
| `input` | 系统取色过程中的颜色变化 | `(value, event)` |
| `change` | 确认颜色后触发 | `(value, event)` |
| `focus` | 获得焦点 | `(event)` |
| `blur` | 失去焦点 | `(event)` |

### Exposes

| 方法或属性 | 说明 |
| --- | --- |
| `focus(options?)` | 聚焦颜色选择控件 |
| `inputRef` | 内部 color input 元素引用 |
