<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import WindowTitleBarBasic from '../.vitepress/theme/examples/window-title-bar/WindowTitleBarBasic.vue';
import windowTitleBarBasicSource from '../.vitepress/theme/examples/window-title-bar/WindowTitleBarBasic.vue?demo-source';
</script>

# WindowTitleBar 窗口标题栏

用于 Electron、Tauri 等无边框桌面窗口。组件只负责标题栏布局、拖拽区域、窗口控制按钮和无障碍状态，不直接调用任何宿主 API；应用通过事件连接自己的窗口控制能力。

## 基础用法

<DemoBlock
  title="受控窗口状态"
  description="最大化状态由应用持有，标题栏只发送操作请求。浏览器中的示例仅演示交互状态。"
  :source="windowTitleBarBasicSource"
>
  <WindowTitleBarBasic />
</DemoBlock>

## 宿主接入

将宿主返回的真实窗口状态传给 `maximized`。收到 `minimize`、`toggle-maximize` 或 `close` 事件后，再调用 Electron、Tauri 或其他桌面容器提供的窗口 API。这样标题栏不会依赖特定 IPC 通道，也不会在内部复制宿主状态。

## WindowTitleBar API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 窗口标题 | `string / number` | `''` |
| `iconSrc` | 应用图标 URL；有 `icon` 插槽时可省略 | `string` | `''` |
| `iconAlt` | 应用图标替代文本；装饰性图标保持空字符串 | `string` | `''` |
| `showIcon` | 没有图标内容时仍保留图标区域，适合异步加载图标 | `boolean` | `false` |
| `maximized` | 当前是否为最大化状态 | `boolean` | `false` |
| `draggable` | 是否启用标题栏拖拽区域 | `boolean` | `true` |
| `controlsPosition` | 控制区域位于标题栏起点或终点 | `'start' / 'end'` | `end` |
| `maximizeOnDoubleClick` | 双击标题区域时是否触发 `toggle-maximize` | `boolean` | `true` |
| `showMinimize` | 是否显示最小化按钮 | `boolean` | `true` |
| `showMaximize` | 是否显示最大化/还原按钮 | `boolean` | `true` |
| `showClose` | 是否显示关闭按钮 | `boolean` | `true` |
| `minimizeDisabled` | 是否禁用最小化按钮 | `boolean` | `false` |
| `maximizeDisabled` | 是否禁用最大化按钮与标题双击最大化 | `boolean` | `false` |
| `closeDisabled` | 是否禁用关闭按钮 | `boolean` | `false` |
| `showTooltips` | 是否显示控制按钮提示 | `boolean` | `true` |
| `tooltipPlacement` | 控制按钮提示方向 | `string` | `bottom` |
| `tooltipShowAfter` | 控制按钮提示延迟，单位 ms | `number` | `220` |
| `minimizeLabel` | 最小化按钮提示和无障碍名称 | `string` | `最小化` |
| `maximizeLabel` | 最大化按钮提示和无障碍名称 | `string` | `最大化` |
| `restoreLabel` | 还原按钮提示和无障碍名称 | `string` | `还原` |
| `closeLabel` | 关闭按钮提示和无障碍名称 | `string` | `关闭` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `minimize` | 请求最小化窗口 | `(event: MouseEvent)` |
| `toggle-maximize` | 请求切换最大化/还原状态 | `(event: MouseEvent)` |
| `close` | 请求关闭窗口 | `(event: MouseEvent)` |
| `icon-click` | 单击应用图标 | `(event: MouseEvent)` |
| `title-double-click` | 双击标题区域；先于自动的 `toggle-maximize` 发出 | `(event: MouseEvent)` |

### Slots

| 插槽名 | 说明 | 插槽参数 |
| --- | --- | --- |
| `icon` | 自定义应用图标 | `{ iconSrc, iconAlt }` |
| `title` | 自定义标题内容 | `{ title }` |
| `controls-before` | 在窗口控制按钮前添加无拖拽交互区 | `{ maximized, requestMinimize, requestToggleMaximize, requestClose }` |
| `controls` | 完全替换默认窗口控制区域 | `{ maximized, requestMinimize, requestToggleMaximize, requestClose }` |
| `minimize-icon` | 自定义最小化图标 | — |
| `maximize-icon` | 自定义最大化图标 | — |
| `restore-icon` | 自定义还原图标 | — |
| `close-icon` | 自定义关闭图标 | — |

### CSS Variables

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `--au-window-title-bar-height` | 标题栏高度 | `32px` |
| `--au-window-title-bar-z-index` | 标题栏层级 | `10001` |
| `--au-window-title-bar-bg` | 标题栏背景 | `--au-color-bg-overlay` |
| `--au-window-title-bar-border-color` | 底部分隔线颜色 | `--au-color-border` |
| `--au-window-title-bar-text-color` | 标题与按钮颜色 | `--au-color-text-primary` |
| `--au-window-title-bar-hover-bg` | 普通控制按钮悬停背景 | `--au-color-bg-hover` |
| `--au-window-title-bar-close-hover-bg` | 关闭按钮悬停背景 | `#e81123` |
| `--au-window-title-bar-close-hover-color` | 关闭按钮悬停文字颜色 | `#ffffff` |
| `--au-window-title-bar-icon-area-width` | 应用图标区域宽度 | `32px` |
| `--au-window-title-bar-icon-size` | 应用图标尺寸 | `18px` |
| `--au-window-title-bar-font-size` | 标题字号 | `13px` |
| `--au-window-title-bar-control-width` | 单个控制按钮宽度 | `40px` |
| `--au-window-title-bar-control-icon-size` | 控制按钮图标尺寸 | `12px` |
