<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import ButtonBasic from '../.vitepress/theme/examples/button/ButtonBasic.vue';
import ButtonMenu from '../.vitepress/theme/examples/button/ButtonMenu.vue';
import buttonBasicSource from '../.vitepress/theme/examples/button/ButtonBasic.vue?demo-source';
import buttonMenuSource from '../.vitepress/theme/examples/button/ButtonMenu.vue?demo-source';
</script>

# Button 按钮

常用的操作触发器。

## 基础用法

<DemoBlock
  title="类型、状态与尺寸"
  :source="buttonBasicSource"
>
  <ButtonBasic />
</DemoBlock>

## 菜单式按钮

<DemoBlock
  :source="buttonMenuSource"
>
  <ButtonMenu />
</DemoBlock>

## Button API

### Attributes

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| `type` | 视觉类型 | `string` | `default / primary / success / info / warning / danger / menu` | `default` |
| `size` | 按钮尺寸 | `string` | `small / default / large` | `default` |
| `selected` | 是否选中 | `boolean` | — | `undefined` |
| `selectedColor` | `menu` 类型的选中颜色，背景由组件自动生成 | `string` | 十六进制、`rgb()`、`rgba()` 等颜色值 | `''` |
| `nativeType` | 原生 `button` 的 `type` | `string` | `button / submit / reset` | `button` |
| `icon` | 图标组件 | `Component` | — | `null` |
| `plain` | 是否使用朴素样式 | `boolean` | — | `false` |
| `round` | 是否使用胶囊圆角 | `boolean` | — | `false` |
| `circle` | 是否为圆形图标按钮 | `boolean` | — | `false` |
| `disabled` | 是否禁用 | `boolean` | — | `false` |
| `loading` | 是否显示加载状态；开启时按钮不可点击 | `boolean` | — | `false` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 按钮可用且不处于加载状态时触发 | `(event: MouseEvent)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 按钮文字或其他内容 |
| `icon` | 覆盖 `icon` 属性对应的默认图标 |
| `loading` | 覆盖加载状态的默认旋转图标 |
