<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import FloatingToolbarBasic from '../.vitepress/theme/examples/floating-toolbar/FloatingToolbarBasic.vue';
import floatingToolbarBasicSource from '../.vitepress/theme/examples/floating-toolbar/FloatingToolbarBasic.vue?demo-source';
</script>

# FloatingToolbar 浮动工具条

`AuFloatingToolbar` 根据目标矩形定位，并在上方空间不足时自动切换到下方。

工具条使用玻璃胶囊轮廓。插槽内的 `AuButtonGroupItem` 自动继承工具条尺寸，图标操作项保持正圆，边框与留白合计 4px；`AuDivider` 自动采用控制组间距。无需再嵌套带背景的按钮组容器。

## 基础用法

<DemoBlock
  title="锚点工具条"
  :source="floatingToolbarBasicSource"
>
  <FloatingToolbarBasic />
</DemoBlock>

## FloatingToolbar API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 显式控制显示；为 null 时跟随 triggerRect | boolean / null | null |
| triggerRect | 定位目标矩形 | DOMRect / Record&lt;string, number&gt; / null | null |
| size | 操作项尺寸，small / default / large；图标项为 24 / 28 / 40px，工具条最小高度为 32 / 36 / 48px | string | default |
| placement | 首选方向 | auto / top / bottom | auto |
| gap | 工具条与目标的距离，单位 px | number | 6 |
| viewportPadding | 与视口边缘的最小距离，单位 px | number | 8 |
| refreshTarget | 滚动/缩放时重新读取矩形的元素或选择器 | string / HTMLElement | '' |
| refreshSelector | refreshTarget 的字符串兼容属性 | string | '' |
| keepVisibleTarget | 点击该元素内部时不关闭 | string / HTMLElement | '' |
| keepVisibleSelector | keepVisibleTarget 的字符串兼容属性 | string | '' |
| teleported | 是否传送到 appendTo | boolean | true |
| appendTo | Teleport 目标 | string / HTMLElement | body |
| zIndex | 工具条层级 | number | 9000 |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 显示状态变化 | (visible: boolean) |
| show | 从隐藏变为显示时触发 | — |
| hide | 隐藏时触发 | (reason: string) |

### Slots

| 插槽名 | 作用域参数 | 说明 |
| --- | --- | --- |
| default | { hide, placement } | 工具条内容与当前实际方向 |

### Exposes

| 属性或方法 | 说明 |
| --- | --- |
| show(rect?) | 使用新矩形或已保存矩形显示工具条 |
| hide(reason?) | 主动隐藏，默认 reason 为 api |
| updatePosition() | 使用当前矩形重新定位 |
| toolbarRef | 工具条根元素引用 |
