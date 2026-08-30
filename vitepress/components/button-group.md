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

`AuButtonGroup` 将一组相关操作组织成统一的操作单元。它提供 `connected` 连体工具组、`segmented` 等宽分段选择和 `floating` 悬浮控制组三种外观。组件只管理布局与视觉关系，按钮文案、图标和业务事件仍由插槽中的 `AuButton` 提供。

## 连体按钮组

`variant="connected"` 使用统一的半透明材质容器承载多个操作，适合顶部菜单、窗口工具和视图切换。当前项通过 `aria-pressed="true"`、`aria-current="true"`、`aria-expanded="true"` 或 `is-active` 类获得独立材质层。

<DemoBlock
  title="Connected 连体按钮组"
  description="当前项使用独立材质层，其他操作保持透明。"
  :source="buttonGroupConnectedSource"
>
  <ButtonGroupConnected />
</DemoBlock>

带弹层的工具项可使用 `AuButtonGroupItem` 包裹 `AuPopover`，并把 `AuButton` 放入 Popover 的 `trigger` 插槽。连体按钮外观与 `aria-expanded` 选中材质仍由 `AuButtonGroup` 统一管理，浮层定位和关闭行为由 `AuPopover` 负责。

## 分段选择

`variant="segmented"` 将直接子按钮均分为紧凑选项，适合透明度、显示密度等少量互斥值。当前值使用 `aria-pressed="true"` 表达，容器默认占满可用宽度。

<DemoBlock
  title="Segmented 分段选择"
  description="等宽选项与独立选中材质层，适合在设置面板中快速切换。"
  :source="buttonGroupSegmentedSource"
>
  <ButtonGroupSegmented />
</DemoBlock>

## 悬浮控制组

`variant="floating"` 使用独立按钮间距和悬浮面板外观，适合卡片、画布或面板角落中的轻量操作。搭配 `icon-only` 时，直接子按钮会统一为方形图标控制按钮。

<DemoBlock
  title="Floating 悬浮控制组"
  description="紧凑的图标操作组，适合贴近内容区域放置。"
  :source="buttonGroupFloatingSource"
>
  <ButtonGroupFloating />
</DemoBlock>

## 外观选择

| 外观 | 适用场景 | 视觉关系 | 常见内容 |
| --- | --- | --- | --- |
| `connected` | 顶部菜单、工具切换、视图切换 | 统一材质容器与独立展开/选中项 | 文字或文字加图标 |
| `segmented` | 透明度、显示密度、枚举设置 | 等宽选项与独立选中项 | 简短文字或数值 |
| `floating` | 卡片、画布、面板快捷操作 | 独立按钮位于悬浮面板内 | 纯图标 |

`AuButtonGroup` 不负责定位和显隐。按钮触发的任意内容使用 `AuPopover`；跟随编辑选区浮动的工具组使用 `AuFloatingToolbar`。

## 使用建议

- 按钮组用于直接执行的并列操作，不应替代点击后展开选项的 Menu。
- 表示互斥选中状态时，为当前按钮设置 `aria-pressed="true"`；仅执行一次动作的按钮不需要持久选中状态。
- 没有可见文字时，为按钮组提供 `aria-label`，并为每个图标按钮单独提供 `aria-label`。
- `icon-only` 只应用于纯图标按钮；包含文字的按钮应保留默认尺寸。

## ButtonGroup API

### Attributes

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| `variant` | 外观类型 | `string` | `connected / segmented / floating` | `connected` |
| `orientation` | 按钮排列方向 | `string` | `horizontal / vertical` | `horizontal` |
| `role` | 根元素的无障碍角色 | `string` | `group / toolbar` | `group` |
| `iconOnly` | 是否将直接子按钮统一为方形图标按钮 | `boolean` | — | `false` |
| `ariaLabel` | 按钮组的无障碍名称 | `string` | — | `''` |

未声明的原生属性会透传到根元素。每个按钮保留原生键盘与焦点行为；`toolbar` 会同时输出与排列方向一致的 `aria-orientation`。

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 一组直接子级 `AuButton`，或用于承载弹层的 `AuButtonGroupItem` |

### AuButtonGroupItem Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 一个直接子 `AuButton`，或以 `AuButton` 为触发器的 `AuPopover` |
