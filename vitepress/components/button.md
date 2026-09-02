<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import ButtonBasic from '../.vitepress/theme/examples/button/ButtonBasic.vue';
import ButtonMenu from '../.vitepress/theme/examples/button/ButtonMenu.vue';
import buttonBasicSource from '../.vitepress/theme/examples/button/ButtonBasic.vue?demo-source';
import buttonMenuSource from '../.vitepress/theme/examples/button/ButtonMenu.vue?demo-source';
</script>

# Button 按钮

常用的操作触发器。支持七种视觉类型、三种尺寸、加载态、禁用态以及图标插槽。

## 基础用法

<DemoBlock
  title="类型、状态与尺寸"
  description="类型、尺寸、禁用和 loading 状态集中展示，点击加载按钮可观察即时状态变化。"
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

## 使用建议

- 一个操作区域通常只保留一个 `primary` 按钮，避免多个主操作争夺注意力。
- 异步提交期间使用 `loading`。加载状态会同时禁用按钮，防止重复提交。
- 只有图标的按钮应提供 `aria-label`，让读屏软件能够说明按钮用途。
- 关闭入口直接使用 `<AuButton :icon="IconX" circle aria-label="关闭" />`，其中 `IconX` 从 `aurora-plus` 导入。
- 表单内若不希望触发表单提交，保留默认的 `native-type="button"`。

## Button API

### Attributes

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| `type` | 视觉类型 | `string` | `default / primary / success / info / warning / danger / menu` | `default` |
| `size` | 按钮尺寸 | `string` | `small / default / large` | `default` |
| `selected` | 是否选中；设置后同步输出 `aria-pressed` | `boolean` | — | `undefined` |
| `selectedColor` | `menu` 类型的选中颜色，背景由组件自动生成 | `string` | 十六进制、`rgb()`、`rgba()` 等颜色值 | `''` |
| `nativeType` | 原生 `button` 的 `type` | `string` | `button / submit / reset` | `button` |
| `icon` | 图标组件 | `Component` | — | `null` |
| `plain` | 是否使用朴素样式 | `boolean` | — | `false` |
| `round` | 是否使用胶囊圆角 | `boolean` | — | `false` |
| `circle` | 是否为圆形图标按钮 | `boolean` | — | `false` |
| `disabled` | 是否禁用 | `boolean` | — | `false` |
| `loading` | 是否显示加载状态；开启时按钮不可点击 | `boolean` | — | `false` |

未被组件声明的属性（例如 `aria-label`、`autofocus`、`form`）会透传到原生 `<button>`。

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
