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

`AuButtonGroup` 将一组相关操作组织成统一的操作单元。它提供 `connected` 连体工具组、`segmented` 等宽分段选择和 `floating` 悬浮控制组三种外观。容器只管理布局和材质，组内操作统一使用 `AuButtonGroupItem`，不会覆盖普通 `AuButton` 的样式。

## 连体按钮组

`variant="connected"` 使用统一的半透明材质容器承载多个操作，适合顶部菜单、窗口工具和视图切换。当前项通过 `:selected="true"` 获得独立材质层与轻微强调色。

<DemoBlock
  title="Connected 连体按钮组"
  description="当前项使用独立材质层，同时展示不可重复触发的加载操作项。"
  :source="buttonGroupConnectedSource"
>
  <ButtonGroupConnected />
</DemoBlock>

需要弹层时可将 `AuPopover` 直接放入控制组，并在其 `trigger` 插槽中使用 `AuButtonGroupItem`。操作项通过控制组上下文获得尺寸和外观，浮层定位和关闭行为仍由 `AuPopover` 负责。

## 分段选择

`variant="segmented"` 将直接子按钮均分为紧凑选项，适合透明度、显示密度等少量互斥值。当前值使用 `:selected="true"` 表达，容器默认占满可用宽度。

<DemoBlock
  title="Segmented 分段选择"
  description="等宽选项与独立选中材质层，适合在设置面板中快速切换。"
  :source="buttonGroupSegmentedSource"
>
  <ButtonGroupSegmented />
</DemoBlock>

## 悬浮控制组

`variant="floating"` 使用统一玻璃容器承载透明图标控制，适合卡片、画布或面板角落中的轻量操作。搭配 `icon-only` 时，直接子按钮会统一为方形控制，只有悬停、按下或选中时显示状态层。按钮与面板使用同心圆角；需要更大的画布控制时可设置 `size="large"`。

<DemoBlock
  title="Floating 悬浮控制组"
  description="紧凑的图标操作组，适合贴近内容区域放置。"
  :source="buttonGroupFloatingSource"
>
  <ButtonGroupFloating />
</DemoBlock>

## 外观选择

悬停、按下与选中表面覆盖操作项的完整高度，容器始终保留 2px 内边距。默认操作项高 28px，小号 24px，大号 40px；显式设置更高的容器时，直接子操作项随内侧空间拉伸。按下反馈只改变颜色，不缩小按钮表面。

| 外观 | 适用场景 | 视觉关系 | 常见内容 |
| --- | --- | --- | --- |
| `connected` | 顶部菜单、工具切换、视图切换 | 统一材质容器与独立展开/选中项 | 文字或文字加图标 |
| `segmented` | 透明度、显示密度、枚举设置 | 等宽选项与独立选中项 | 简短文字或数值 |
| `floating` | 卡片、画布、面板快捷操作 | 统一悬浮玻璃容器内的透明控制 | 纯图标 |

`AuButtonGroup` 不负责定位和显隐。按钮触发的任意内容使用 `AuPopover`；跟随编辑选区浮动的工具组使用 `AuFloatingToolbar`。

## 使用建议

- 按钮组用于直接执行的并列操作，不应替代点击后展开选项的 Menu。
- 表示互斥选中状态时，为当前按钮设置 `:selected="true"`；仅执行一次动作的按钮不需要持久选中状态。
- `icon-only` 只应用于纯图标按钮；包含文字的按钮应保留默认尺寸。
- 原先放在控制组中的普通 `AuButton` 应替换为 `AuButtonGroupItem`，两种组件的样式与职责互不覆盖。

## ButtonGroup API

### Attributes

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| `variant` | 外观类型 | `string` | `connected / segmented / floating` | `connected` |
| `orientation` | 按钮排列方向 | `string` | `horizontal / vertical` | `horizontal` |
| `size` | 控制组尺寸 | `string` | `small / default / large` | `default` |
| `iconOnly` | 是否将直接子按钮统一为方形图标按钮 | `boolean` | — | `false` |
| `inverse` | 使用适合灰色遮罩等深色背景的反色材质 | `boolean` | — | `false` |

未声明的原生属性会透传到根元素。每个按钮保留原生键盘与焦点行为。

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 一组 `AuButtonGroupItem`，也可包含以该操作项作为触发器的 `AuPopover` |

### AuButtonGroupItem

组内操作项本身就是原生按钮，支持 `type`、`nativeType`、`icon`、`selected`、`selectedColor`、`disabled` 和 `loading` 属性，以及 `default`、`icon`、`loading` 插槽与 `click` 事件。尺寸、排列、悬浮圆角和反色状态由最近的 `AuButtonGroup` 通过上下文提供。

### AuButtonGroupItem Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 操作项的文字内容 |
| `icon` | 自定义操作项图标 |
| `loading` | 自定义加载图标 |
