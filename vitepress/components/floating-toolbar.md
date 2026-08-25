<script setup>
import FloatingToolbarDemo from '../.vitepress/theme/components/FloatingToolbarDemo.vue';
</script>

# 浮动工具条

`AuFloatingToolbar` 根据目标矩形定位，并在上方空间不足时自动切换到下方。

<FloatingToolbarDemo />

```vue
<AuFloatingToolbar
  :trigger-rect="selectionRect"
  refresh-selector=".selected-content"
  keep-visible-selector=".selected-content"
>
  <button class="au-floating-toolbar__button">操作</button>
</AuFloatingToolbar>
```

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `triggerRect` | `object` | `null` | 目标元素的矩形信息 |
| `placement` | `auto / top / bottom` | `auto` | 首选方向 |
| `gap` | `number` | `8` | 与目标的距离 |
| `viewportPadding` | `number` | `8` | 与视口边缘的最小距离 |
| `refreshTarget` | `string / Element` | 空 | 滚动时重新取矩形的目标 |
| `keepVisibleTarget` | `string / Element` | 空 | 点击后不关闭工具条的目标 |

组件实例暴露 `show(rect)`、`hide(reason)` 和 `updatePosition()`。
