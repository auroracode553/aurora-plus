<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import ColorPickerBasic from '../.vitepress/theme/examples/color-picker/ColorPickerBasic.vue';
import colorPickerBasicSource from '../.vitepress/theme/examples/color-picker/ColorPickerBasic.vue?demo-source';
import ColorPickerFixed from '../.vitepress/theme/examples/color-picker/ColorPickerFixed.vue';
import colorPickerFixedSource from '../.vitepress/theme/examples/color-picker/ColorPickerFixed.vue?demo-source';
</script>

# ColorPicker 颜色选择器

`AuColorPicker` 默认用于自定义颜色，不传 `type` 或传 `type=""` 均可；固定色板使用 `type="fixed"`。`AuColorSwatch` 用于独立的预设色块。

## 自定义颜色（默认）

使用 `<AuColorPicker v-model="color" />` 即可打开取色画板，仅显示取色区域、色相条与当前颜色预览，不显示 HEX、RGB 或 HSL 输入栏。

<DemoBlock title="自定义颜色：不传 type" :source="colorPickerBasicSource">
  <ColorPickerBasic />
</DemoBlock>

## 固定色板

显式设置 `type="fixed"`，通过 `colors` 指定可选颜色。颜色项可传字符串，或传 `{ name, color }` 为颜色命名；悬浮提示和无障碍标签显示名称，字符串项显示颜色值。不传 `colors` 时使用内置 12 色。选择后关闭色板并返回触发控件，`v-model` 始终输出六位 HEX。

<DemoBlock title="固定色板：type=fixed" :source="colorPickerFixedSource">
  <ColorPickerFixed />
</DemoBlock>

## ColorPicker API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前颜色，支持三位/六位 HEX 或 rgb(r, g, b)，更新时输出六位 HEX | string | #000000 |
| type | 空值为自定义颜色；fixed 为固定色板 | '' / fixed | '' |
| colors | 固定色板颜色，仅 fixed 模式生效；对象项的 name 用于提示文字，color 为颜色值 | Array&lt;string &#124; { name: string; color: string }&gt; | 内置 12 色 |
| fallback | 当前值无效时的显示颜色；自身无效时使用白色 | string | #ffffff |
| size | 控件直径与 [Input 的单行高度](/components/input#尺寸) 一致 | small / default / large | default |
| disabled | 是否禁用 | boolean | false |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 颜色变化 | (value) |
| input | 画板拖动、键盘调整或选择固定色时触发 | (value, event) |
| change | 画板拖动结束、键盘调整提交或选择固定色时触发 | (value, event) |
| focus | 触发控件获得焦点 | (event) |
| blur | 触发控件失去焦点 | (event) |

### Exposes

| 方法或属性 | 说明 |
| --- | --- |
| focus(options?) | 聚焦颜色选择控件 |
| inputRef | 颜色选择触发按钮引用 |

组件只处理不透明颜色。画板可拖动饱和度/明度区域并调整色相条，取色期间更新 v-model；Tab 可依次聚焦饱和度、明度、色相滑块，方向键调整数值。固定色板支持 Tab 聚焦色块、Enter / Space 选择。两种模式均支持 Escape 关闭并返回触发按钮、点击外部关闭；关闭画板保留已选颜色。

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
