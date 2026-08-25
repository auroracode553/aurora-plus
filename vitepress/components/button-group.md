<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import ButtonGroupBasic from '../.vitepress/theme/examples/button-group/ButtonGroupBasic.vue';
import buttonGroupBasicSource from '../.vitepress/theme/examples/button-group/ButtonGroupBasic.vue?demo-source';
</script>

# ButtonGroup 按钮组

`AuButtonGroup` 将一组相关操作组织成连续按钮或紧凑悬浮控制组。组件只管理布局与视觉关系，按钮文案、图标和业务事件仍由插槽中的 `AuButton` 提供。

## 基础用法

默认样式适合筛选、对齐和视图切换；`floating` 样式适合卡片、画布或浮层角落中的轻量操作。`icon-only` 会将直接子按钮统一为方形控制按钮。

<DemoBlock
  title="连续按钮与悬浮控制组"
  description="两个示例使用同一个通用组件；点击按钮可查看真实事件结果。"
  :source="buttonGroupBasicSource"
>
  <ButtonGroupBasic />
</DemoBlock>

## 使用建议

- 按钮组用于直接执行的并列操作，不应替代点击后展开选项的 Menu。
- 没有可见文字时，为按钮组提供 `aria-label`，并为每个图标按钮单独提供 `aria-label`。
- `icon-only` 只应用于纯图标按钮；包含文字的按钮保留默认尺寸。
- 可通过 `--au-button-group-control-size` 覆盖紧凑按钮尺寸，默认值为 `28px`。

## ButtonGroup API

### Attributes

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| `variant` | 视觉样式 | `string` | `default / floating` | `default` |
| `orientation` | 按钮排列方向 | `string` | `horizontal / vertical` | `horizontal` |
| `iconOnly` | 是否将直接子按钮统一为方形图标按钮 | `boolean` | — | `false` |
| `ariaLabel` | 按钮组的无障碍名称 | `string` | — | `''` |

未声明的原生属性会透传到根元素。根元素使用 `role="group"`，每个按钮保留原生键盘与焦点行为。

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 一组直接子级 `AuButton` |
