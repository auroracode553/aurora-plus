<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import ButtonGroupConnected from '../.vitepress/theme/examples/button-group/ButtonGroupConnected.vue';
import ButtonGroupSegmented from '../.vitepress/theme/examples/button-group/ButtonGroupSegmented.vue';
import ButtonGroupFloating from '../.vitepress/theme/examples/button-group/ButtonGroupFloating.vue';
import buttonGroupConnectedSource from '../.vitepress/theme/examples/button-group/ButtonGroupConnected.vue?demo-source';
import buttonGroupSegmentedSource from '../.vitepress/theme/examples/button-group/ButtonGroupSegmented.vue?demo-source';
import buttonGroupFloatingSource from '../.vitepress/theme/examples/button-group/ButtonGroupFloating.vue?demo-source';
</script>

# ButtonGroup 按钮组

`AuButtonGroup` 将一组相关操作组织成统一的操作单元。

## 连体按钮组

<DemoBlock
  title="Connected 连体按钮组"
  :source="buttonGroupConnectedSource"
>
  <ButtonGroupConnected />
</DemoBlock>

## 分段选择

<DemoBlock
  title="Segmented 分段选择"
  :source="buttonGroupSegmentedSource"
>
  <ButtonGroupSegmented />
</DemoBlock>

## 悬浮控制组

<DemoBlock
  title="Floating 悬浮控制组"
  :source="buttonGroupFloatingSource"
>
  <ButtonGroupFloating />
</DemoBlock>

## ButtonGroup API

### Attributes

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| `variant` | 外观类型 | `string` | `connected / segmented / floating` | `connected` |
| `orientation` | 按钮排列方向 | `string` | `horizontal / vertical` | `horizontal` |
| `size` | 控制组尺寸 | `string` | `small / default / large` | `default` |
| `iconOnly` | 是否将直接子按钮统一为方形图标按钮 | `boolean` | — | `false` |
| `inverse` | 使用适合灰色遮罩等深色背景的反色材质 | `boolean` | — | `false` |

### AuButtonGroupItem Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | 颜色类型：`default / primary / success / info / warning / danger` | `string` | `default` |
| `selected` | 选中状态 | `boolean` | — |
| `selectedColor` | 选中时的文字颜色 | `string` | `''` |
| `nativeType` | 原生按钮类型：`button / submit / reset` | `string` | `button` |
| `icon` | 图标组件 | `Component` | `null` |
| `disabled` | 禁用操作项 | `boolean` | `false` |
| `loading` | 显示加载状态并禁用操作项 | `boolean` | `false` |

### AuButtonGroupItem Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `click` | `(event)` | 点击操作项 |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 一组 `AuButtonGroupItem`，也可包含以该操作项作为触发器的 `AuPopover` |

### AuButtonGroupItem Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 操作项的文字内容 |
| `icon` | 自定义操作项图标 |
| `loading` | 自定义加载图标 |
