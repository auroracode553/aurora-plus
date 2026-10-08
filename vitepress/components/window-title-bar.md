<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import WindowTitleBarBasic from '../.vitepress/theme/examples/window-title-bar/WindowTitleBarBasic.vue';
import windowTitleBarBasicSource from '../.vitepress/theme/examples/window-title-bar/WindowTitleBarBasic.vue?demo-source';
</script>

# WindowTitleBar 窗口标题栏

用于 Electron、Tauri 等无边框桌面窗口。

## 基础用法

<DemoBlock
  title="受控窗口状态"
  :source="windowTitleBarBasicSource"
>
  <WindowTitleBarBasic />
</DemoBlock>

## 受限高度视图中的按钮提示

标题栏提示使用 Aurora 的 Tooltip 样式。Teleport 只能避开 DOM 祖先裁剪，不能越过桌面宿主视图的边界。

标题栏独占较矮的桌面视图时，宿主需监听 `tooltip-open-change`：收到 `true` 时为提示扩展视图，收到 `false` 时再收回。组件会合并三个按钮的提示状态，最后一个提示退场结束后才发出 `false`，避免切换按钮或退场时被裁剪。视口扩展尚未生效时，气泡保持不可见，视口变化后重新定位。

替换 `controls` 插槽时，由插槽内容自行管理提示及宿主浮层状态。

## WindowTitleBar API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 窗口标题 | string / number | '' |
| iconSrc | 应用图标 URL；有 icon 插槽时可省略 | string | '' |
| iconAlt | 应用图标替代文本；装饰性图标保持空字符串 | string | '' |
| showIcon | 没有图标内容时仍保留图标区域，适合异步加载图标 | boolean | false |
| maximized | 当前是否为最大化状态 | boolean | false |
| draggable | 是否启用标题栏拖拽区域 | boolean | true |
| controlsPosition | 控制区域位于标题栏起点或终点 | 'start' / 'end' | end |
| maximizeOnDoubleClick | 双击标题区域时是否触发 toggle-maximize | boolean | true |
| showMinimize | 是否显示最小化按钮 | boolean | true |
| showMaximize | 是否显示最大化/还原按钮 | boolean | true |
| showClose | 是否显示关闭按钮 | boolean | true |
| minimizeDisabled | 是否禁用最小化按钮 | boolean | false |
| maximizeDisabled | 是否禁用最大化按钮与标题双击最大化 | boolean | false |
| closeDisabled | 是否禁用关闭按钮 | boolean | false |
| showTooltips | 是否显示控制按钮提示 | boolean | true |
| tooltipPlacement | 控制按钮提示方向 | string | bottom |
| tooltipShowAfter | 控制按钮提示延迟，单位 ms | number | 220 |
| minimizeLabel | 最小化按钮提示 | string | 最小化 |
| maximizeLabel | 最大化按钮提示 | string | 最大化 |
| restoreLabel | 还原按钮提示 | string | 还原 |
| closeLabel | 关闭按钮提示 | string | 关闭 |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| minimize | 请求最小化窗口 | (event: MouseEvent) |
| toggle-maximize | 请求切换最大化/还原状态 | (event: MouseEvent) |
| close | 请求关闭窗口 | (event: MouseEvent) |
| icon-click | 单击应用图标 | (event: MouseEvent) |
| title-double-click | 双击标题区域；先于自动的 toggle-maximize 发出 | (event: MouseEvent) |
| tooltip-open-change | 至少一个默认按钮提示准备显示时为 true，全部退场或卸载后为 false | (open: boolean) |

### Slots

| 插槽名 | 说明 | 插槽参数 |
| --- | --- | --- |
| icon | 自定义应用图标 | { iconSrc, iconAlt } |
| title | 自定义标题内容 | { title } |
| controls-before | 在窗口控制按钮前添加无拖拽交互区 | { maximized, requestMinimize, requestToggleMaximize, requestClose } |
| controls | 完全替换默认窗口控制区域 | { maximized, requestMinimize, requestToggleMaximize, requestClose } |
| minimize-icon | 自定义最小化图标 | — |
| maximize-icon | 自定义最大化图标 | — |
| restore-icon | 自定义还原图标 | — |
| close-icon | 自定义关闭图标 | — |
