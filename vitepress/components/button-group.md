<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import ButtonGroupConnected from '../.vitepress/theme/examples/button-group/ButtonGroupConnected.vue';
import ButtonGroupFloating from '../.vitepress/theme/examples/button-group/ButtonGroupFloating.vue';
import buttonGroupConnectedSource from '../.vitepress/theme/examples/button-group/ButtonGroupConnected.vue?demo-source';
import buttonGroupFloatingSource from '../.vitepress/theme/examples/button-group/ButtonGroupFloating.vue?demo-source';
</script>

# ButtonGroup 按钮组

`AuButtonGroup` 将一组相关操作组织成统一的操作单元。它提供两种职责明确的外观：`connected` 连体按钮组和 `floating` 悬浮控制组。组件只管理布局与视觉关系，按钮文案、图标和业务事件仍由插槽中的 `AuButton` 提供。

## 连体按钮组

`variant="connected"` 使用统一的半透明材质容器承载多个分段操作，适合窗口工具、筛选和视图切换。当前项通过 `aria-pressed="true"`、`aria-current="true"` 或 `is-active` 类获得独立材质层。

<DemoBlock
  title="Connected 连体按钮组"
  description="当前项使用独立材质层，其他操作保持透明。"
  :source="buttonGroupConnectedSource"
>
  <ButtonGroupConnected />
</DemoBlock>

## 悬浮控制组

`variant="floating"` 使用独立按钮间距和悬浮面板外观，适合卡片、画布或面板角落中的轻量操作。搭配 `icon-only` 时，直接子按钮会统一为方形图标控制按钮。示例的 `data-au-theme="dark"` 只给控制组自身应用深色主题，不需要外层深色卡片。

<DemoBlock
  title="Floating 悬浮控制组"
  description="紧凑的图标操作组；深色主题仅作用于组件本身。"
  :source="buttonGroupFloatingSource"
>
  <ButtonGroupFloating />
</DemoBlock>

## 外观选择

| 外观 | 适用场景 | 视觉关系 | 常见内容 |
| --- | --- | --- | --- |
| `connected` | 工具切换、筛选、视图切换 | 统一材质容器与独立选中项 | 文字或文字加图标 |
| `floating` | 卡片、画布、面板快捷操作 | 独立按钮位于悬浮面板内 | 纯图标 |

`AuButtonGroup` 不负责定位和显隐。如果控件需要跟随选区或锚点浮动，请使用 `AuFloatingToolbar` 处理定位，并在其插槽中组织操作内容。

## 使用建议

- 按钮组用于直接执行的并列操作，不应替代点击后展开选项的 Menu。
- 表示互斥选中状态时，为当前按钮设置 `aria-pressed="true"`；仅执行一次动作的按钮不需要持久选中状态。
- 没有可见文字时，为按钮组提供 `aria-label`，并为每个图标按钮单独提供 `aria-label`。
- `icon-only` 只应用于纯图标按钮；包含文字的按钮应保留默认尺寸。
- 可通过 `--au-button-group-control-size` 覆盖紧凑按钮尺寸，默认值为 `28px`。

## ButtonGroup API

### Attributes

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| `variant` | 外观类型 | `string` | `connected / floating` | `connected` |
| `orientation` | 按钮排列方向 | `string` | `horizontal / vertical` | `horizontal` |
| `iconOnly` | 是否将直接子按钮统一为方形图标按钮 | `boolean` | — | `false` |
| `ariaLabel` | 按钮组的无障碍名称 | `string` | — | `''` |

未声明的原生属性会透传到根元素。根元素使用 `role="group"`，每个按钮保留原生键盘与焦点行为。

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 一组直接子级 `AuButton` |
