<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import LoadingBasic from '../.vitepress/theme/examples/loading/LoadingBasic.vue';
import LoadingService from '../.vitepress/theme/examples/loading/LoadingService.vue';
import loadingBasicSource from '../.vitepress/theme/examples/loading/LoadingBasic.vue?demo-source';
import loadingServiceSource from '../.vitepress/theme/examples/loading/LoadingService.vue?demo-source';
</script>

# Loading 加载

在异步数据尚未就绪时覆盖目标区域并显示进度状态。支持组件、`v-loading` 指令和命令式服务三种用法；短请求可通过 `delay` 避免加载层闪烁。

## 区域加载

完整安装 Aurora Plus 后可直接使用 `v-loading`。指令既接受布尔值，也接受包含 `loading` 的配置对象。

<DemoBlock
  title="区域加载与自定义图标"
  description="加载层继承页面表面；自定义 SVG 只改变进度图标，不改变目标区域尺寸。"
  :source="loadingBasicSource"
  default-expanded
>
  <LoadingBasic />
</DemoBlock>

按需注册指令：

```js
import { vLoading } from 'aurora-plus';

app.directive('loading', vLoading);
```

`.body` 将区域加载层挂到 `document.body` 并持续对齐目标元素；`.fullscreen` 覆盖视口；`.lock` 在加载层显示期间锁定页面滚动：

```vue
<main v-loading.body="loading">...</main>
<AuButton v-loading.fullscreen.lock="saving" @click="save">保存</AuButton>
```

## Loading 服务

服务默认创建全屏加载层；传入 `target` 后默认只覆盖该元素。返回实例可更新文案、更新视觉配置或主动关闭。

<DemoBlock
  title="区域与全屏服务"
  description="全屏 Loading 是单例；重复打开会返回当前实例。"
  :source="loadingServiceSource"
>
  <LoadingService />
</DemoBlock>

```js
import { AuLoadingService } from 'aurora-plus';

const loading = AuLoadingService({
  lock: true,
  text: '正在保存…',
});

loading.setText('正在刷新列表…');
loading.close();
```

完整安装后，Options API 中也可以调用 `this.$loading(options)`。需要继承当前应用上下文时，可将 `appContext` 作为第二个参数传给 `AuLoadingService(options, appContext)`。

## AuLoading 组件

组件用默认插槽包裹内容，通过 `loading` 控制区域加载；设置 `fullscreen` 后加载层会传送到 `body`，默认插槽仍保留原位置。

```vue
<AuLoading :loading="loading" text="加载中…" :delay="120">
  <ProjectList :items="items" />
</AuLoading>
```

## Options / Attributes

| 配置 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `loading` | 是否显示加载层；服务调用默认显示 | `boolean` | `false`（组件） |
| `target` | 服务需要覆盖的 DOM 节点或选择器 | `HTMLElement / string` | `document.body` |
| `body` | 将区域服务挂载到 `body` 并对齐目标 | `boolean` | `false` |
| `fullscreen` | 是否覆盖整个视口；服务未传 target 时默认为 true | `boolean` | `false`（组件） |
| `lock` | 显示期间是否锁定页面滚动 | `boolean` | `false` |
| `text` | 加载文案；服务还接受 `VNode / VNode[]` | `string / number / VNode / VNode[]` | `''` |
| `size` | 图标与文字尺寸，可选 `small / default / large` | `string` | `default` |
| `spinner` | 自定义 Vue 图标组件；服务中的字符串值按 SVG 标记处理 | `Component / string` | — |
| `svg` | 自定义 SVG 内部标记 | `string` | `''` |
| `svgViewBox` | 自定义 SVG 的 `viewBox` | `string` | `0 0 24 24` |
| `color` | 加载图标颜色 | `string` | 主题主色 |
| `background` | 加载层背景 CSS 值 | `string` | 当前材质半透明表面 |
| `customClass` | 加载层自定义类名 | `string / array / object` | `''` |
| `zIndex` | 加载层层级 | `number` | `1000` |
| `ariaLabel` | 加载状态的无障碍名称 | `string` | `加载中` |
| `delay` | 延迟显示时间，单位 ms | `number` | `0` |
| `beforeClose` | 服务关闭前调用；返回 false 可阻止关闭 | `() => boolean / void` | — |
| `closed` | 服务关闭过渡和 DOM 清理完成后调用 | `() => void` | — |

`target` 与 `body` 仅用于服务；服务实例创建后不能通过 `update()` 改变 `target`、`body` 或 `fullscreen`。

## 指令附加属性

布尔值指令可以通过以下属性配置内容；配置对象中的同名选项优先级更高。

| 属性 | 说明 |
| --- | --- |
| `au-loading-text` | 加载文案 |
| `au-loading-svg` / `au-loading-spinner` | 自定义 SVG 内部标记 |
| `au-loading-svg-view-box` | SVG viewBox |
| `au-loading-background` | 加载层背景 |
| `au-loading-custom-class` | 自定义类名 |
| `au-loading-color` | 加载图标颜色 |
| `au-loading-aria-label` | 无障碍名称 |

从 Element Plus 迁移时，同名的 `element-loading-*` 属性仍可使用；新代码建议统一采用 `au-loading-*`。

::: warning 安全提示
`svg`、`au-loading-svg`、`au-loading-spinner` 及兼容的 `element-loading-spinner / element-loading-svg` 会渲染为 SVG 标记。只使用源码内可信内容，不要传入用户提交或未经清理的字符串，以免造成 XSS。
:::

## Service API

| 方法或属性 | 说明 |
| --- | --- |
| `AuLoadingService(options, appContext?)` | 创建加载实例；无 target 时为全屏单例 |
| `AuLoading.service(options, appContext?)` | 与 `AuLoadingService` 相同的快捷入口 |
| `AuLoadingService.closeAll()` | 请求关闭全部服务实例；关闭守卫仍会执行 |
| `instance.close()` | 请求关闭当前实例 |
| `instance.setText(text)` | 更新加载文案 |
| `instance.update(options)` | 更新文案、图标、颜色、背景、层级等视觉配置 |
| `instance.closed` | 实例是否已完成清理，只读 |

## Component Slots / Events / Exposes

| 名称 | 说明 |
| --- | --- |
| `default` | 被加载层覆盖的内容 |
| `spinner` | 自定义加载图标，作用域参数为 `{ size }` |
| `opened` | 加载层进入过渡完成后触发 |
| `closed` | 加载层离开过渡完成后触发 |
| `rootRef` | 组件内容根元素引用 |

组件和服务均设置 `role="status"`、`aria-live="polite"`，目标组件同步 `aria-busy`。系统启用减少动态、减少透明度、高对比度或强制色彩时会自动采用对应回退。

## AuLoadingSpinner

需要在自定义控件中复用同一加载图标时，可按需导入 `AuLoadingSpinner`。它支持 `size`、`text`、`color`、`spinner`、`svg`、`svgViewBox` 和紧凑图标模式 `compact`；默认不包含遮罩和滚动锁行为。
