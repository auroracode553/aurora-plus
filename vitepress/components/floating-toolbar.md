<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import FloatingToolbarBasic from '../.vitepress/theme/examples/floating-toolbar/FloatingToolbarBasic.vue';
import floatingToolbarBasicSource from '../.vitepress/theme/examples/floating-toolbar/FloatingToolbarBasic.vue?demo-source';
</script>

# FloatingToolbar 浮动工具条

`AuFloatingToolbar` 根据目标矩形定位，并在上方空间不足时自动切换到下方。

## 基础用法

工具条内容由默认插槽提供，`triggerRect` 可通过目标元素的 `getBoundingClientRect()` 获取。

<DemoBlock
  title="锚点工具条"
  description="点击锚点打开；滚动时刷新位置，点击外部关闭。"
  :source="floatingToolbarBasicSource"
>
  <FloatingToolbarBasic />
</DemoBlock>

## 目标矩形

`triggerRect` 至少应提供以下数值字段。可以直接传 `DOMRect`，也可以保存为普通对象：

```js
const { top, right, bottom, left, width, height } = element.getBoundingClientRect();
toolbarRect.value = { top, right, bottom, left, width, height };
```

若目标会随页面滚动，传入 `refreshTarget` 元素引用或 `refreshSelector`，组件会重新读取矩形；找不到目标时以 `target-missing` 原因关闭。

## FloatingToolbar API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue / v-model` | 显式控制显示；为 `null` 时跟随 `triggerRect` | `boolean / null` | `null` |
| `triggerRect` | 定位目标矩形 | `DOMRect / Record<string, number> / null` | `null` |
| `placement` | 首选方向 | `auto / top / bottom` | `auto` |
| `gap` | 工具条与目标的距离，单位 px | `number` | `6` |
| `viewportPadding` | 与视口边缘的最小距离，单位 px | `number` | `8` |
| `refreshTarget` | 滚动/缩放时重新读取矩形的元素或选择器 | `string / HTMLElement` | `''` |
| `refreshSelector` | `refreshTarget` 的字符串兼容属性 | `string` | `''` |
| `keepVisibleTarget` | 点击该元素内部时不关闭 | `string / HTMLElement` | `''` |
| `keepVisibleSelector` | `keepVisibleTarget` 的字符串兼容属性 | `string` | `''` |
| `ariaLabel` | 工具条无障碍名称 | `string` | `工具条` |
| `teleported` | 是否传送到 `appendTo` | `boolean` | `true` |
| `appendTo` | Teleport 目标 | `string / HTMLElement` | `body` |
| `zIndex` | 工具条层级 | `number` | `9000` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 显示状态变化 | `(visible: boolean)` |
| `show` | 从隐藏变为显示时触发 | — |
| `hide` | 隐藏时触发 | `(reason: string)` |

关闭原因可能为 `api`、`model`、`trigger`、`outside`、`scroll` 或 `target-missing`。

### Slots

| 插槽名 | 作用域参数 | 说明 |
| --- | --- | --- |
| `default` | `{ hide, placement }` | 工具条内容与当前实际方向 |

组件内置 `.au-floating-toolbar__group`、`.au-floating-toolbar__button`、`.au-floating-toolbar__separator`，可用于组织默认插槽内容。

### Exposes

| 属性或方法 | 说明 |
| --- | --- |
| `show(rect?)` | 使用新矩形或已保存矩形显示工具条 |
| `hide(reason?)` | 主动隐藏，默认 reason 为 `api` |
| `updatePosition()` | 使用当前矩形重新定位 |
| `toolbarRef` | 工具条根元素引用 |
