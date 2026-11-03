---
platforms: [electron]
---

<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import WindowTitleBarBasic from '../.vitepress/theme/examples/window-title-bar/WindowTitleBarBasic.vue';
import windowTitleBarBasicSource from '../.vitepress/theme/examples/window-title-bar/WindowTitleBarBasic.vue?demo-source';
</script>

# WindowTitleBar 窗口标题栏

用于 Electron 桌面窗口。浏览器中可预览标题栏外观与按钮交互；实际窗口的最小化、最大化和关闭由 Electron 宿主处理。

标题栏默认高 32px，使用贴边玻璃表面；窗口控件默认透明、无圆角和独立按钮底面，悬停与按压时在完整的 40px 命中区域显示矩形反馈，保留键盘焦点提示，不缩放控件。关闭按钮使用主题危险色，最大化图标随受控状态切换。

## 基础用法

<DemoBlock
  title="受控窗口状态"
  :source="windowTitleBarBasicSource"
>
  <WindowTitleBarBasic />
</DemoBlock>

## Windows 原生窗口控件

Win11 最大化/还原按钮悬停时的贴靠布局由系统提供，受系统多任务设置控制。Electron 主进程通过 `aurora-plus/electron` 创建标题栏适配器，统一配置原生控件、同步主题并识别原生关闭操作；渲染进程的 `AuWindowTitleBar` 自动识别 Electron 的 Window Controls Overlay，无需重复传递平台标志或增加预加载接口。

```js
// Electron 主进程
import { app, BrowserWindow } from 'electron';
import { createElectronWindowTitleBar } from 'aurora-plus/electron';

app.whenReady().then(() => {
  const titleBar = createElectronWindowTitleBar();
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    ...titleBar.windowOptions,
  });
  titleBar.bind(win);
  win.loadFile('index.html');
});
```

组件自动隐藏默认控件及 `controls` 插槽，通过 `titlebar-area-x/width/height` 环境变量为原生控件预留区域，尺寸随窗口缩放和 DPI 变化。此时显示、禁用、图标、提示及最小化/关闭操作由宿主管理，组件的对应属性和事件只影响自绘控件；标题双击仍由 `maximizeOnDoubleClick` 与 `maximizeDisabled` 控制。浏览器预览和没有启用原生覆盖区的 Electron 窗口均使用自绘控件，窗口操作通过组件事件交给应用处理。

### Electron 适配器 API

`createElectronWindowTitleBar({ nativeTitleBar = false } = {})` 仅在 Electron 主进程调用，返回 `{ windowOptions, bind }`：

- `windowOptions`：Windows 自定义标题栏使用透明的原生覆盖区，高 32 个设备无关像素；其他平台使用自绘控件。`nativeTitleBar: true` 保留完整系统标题栏，此时不应渲染页面内标题栏。
- `bind(win, { onCloseRequested } = {})`：创建窗口后调用一次，须先于应用的 `close` 监听注册。同步亮暗主题，原生控件或系统菜单请求关闭时调用可选回调；返回提前解绑函数，窗口销毁时也会自动清理。未保存确认、关闭取消和文件恢复仍由应用的 `close` 处理管理，回调本身不关闭窗口。

`aurora-plus/electron` 与浏览器组件入口相互独立。组件仅检查 Electron 环境中的 Window Controls Overlay，监听其 `geometrychange` 事件，卸载时移除监听，不访问 Node 或 IPC。

## 受限高度视图中的按钮提示

Teleport 不能超出宿主视图边界。受限高度下可通过 `tooltip-open-change` 扩展或收回视图；使用自定义 `controls` 插槽时，由插槽内容管理提示。

## WindowTitleBar API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 窗口标题 | string / number | '' |
| iconSrc | 应用图标 URL；有 icon 插槽时可省略 | string | '' |
| iconAlt | 应用图标的 alt 属性 | string | '' |
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
