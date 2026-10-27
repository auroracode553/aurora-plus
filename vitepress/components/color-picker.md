<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import ColorPickerBasic from '../.vitepress/theme/examples/color-picker/ColorPickerBasic.vue';
import colorPickerBasicSource from '../.vitepress/theme/examples/color-picker/ColorPickerBasic.vue?demo-source';
</script>

# ColorPicker 颜色选择器

`AuColorPicker` 使用系统取色面板；`AuColorSwatch` 用于从固定的预设颜色中选择。

## 基础用法

<DemoBlock
  title="系统取色与预设颜色"
  :source="colorPickerBasicSource"
>
  <ColorPickerBasic />
</DemoBlock>

## ColorPicker API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前十六进制颜色 | string | #000000 |
| fallback | 当前值不是六位十六进制颜色时的显示值 | string | #ffffff |
| size | 尺寸 | small / default / large | default |
| disabled | 是否禁用 | boolean | false |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 颜色变化 | (value) |
| input | 系统取色过程中的颜色变化 | (value, event) |
| change | 确认颜色后触发 | (value, event) |
| focus | 获得焦点 | (event) |
| blur | 失去焦点 | (event) |

### Exposes

| 方法或属性 | 说明 |
| --- | --- |
| focus(options?) | 聚焦颜色选择控件 |
| inputRef | 内部 color input 元素引用 |

## ColorSwatch API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 色块显示及 select 回传的 CSS 颜色 | string | #000000 |
| selected | 是否显示选中环和勾选标识 | boolean | false |
| size | 尺寸 | small / default / large | default |
| disabled | 是否禁用 | boolean | false |
| title | 自定义原生提示文字 | string | '' |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| select | 选择色块 | (color) |
| click | 点击色块 | (event) |
