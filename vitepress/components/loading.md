<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import LoadingBasic from '../.vitepress/theme/examples/loading/LoadingBasic.vue';
import LoadingComponent from '../.vitepress/theme/examples/loading/LoadingComponent.vue';
import LoadingControlStates from '../.vitepress/theme/examples/loading/LoadingControlStates.vue';
import LoadingService from '../.vitepress/theme/examples/loading/LoadingService.vue';
import loadingBasicSource from '../.vitepress/theme/examples/loading/LoadingBasic.vue?demo-source';
import loadingComponentSource from '../.vitepress/theme/examples/loading/LoadingComponent.vue?demo-source';
import loadingControlStatesSource from '../.vitepress/theme/examples/loading/LoadingControlStates.vue?demo-source';
import loadingServiceSource from '../.vitepress/theme/examples/loading/LoadingService.vue?demo-source';
</script>

# Loading 加载

在异步数据尚未就绪时覆盖目标区域并显示进度状态。

## 区域加载

<DemoBlock
  title="区域加载与自定义图标"
  :source="loadingBasicSource"
>
  <LoadingBasic />
</DemoBlock>

```js
import { vLoading } from 'aurora-plus';

app.directive('loading', vLoading);
```

```vue
<main v-loading.body="loading">...</main>
<AuButton v-loading.fullscreen.lock="saving" @click="save">保存</AuButton>
```

## Loading 服务

<DemoBlock
  title="区域与全屏服务"
  :source="loadingServiceSource"
>
  <LoadingService />
</DemoBlock>

```js
import { AuLoading } from 'aurora-plus';

const loading = AuLoading.service({
  lock: true,
  text: '正在保存…',
});

loading.setText('正在刷新列表…');
loading.close();
```

## AuLoading 组件

<DemoBlock
  title="组件容器与独立 Spinner"
  :source="loadingComponentSource"
>
  <LoadingComponent />
</DemoBlock>

## 组件内加载状态

<DemoBlock
  title="控件与数据组件加载态"
  :source="loadingControlStatesSource"
>
  <LoadingControlStates />
</DemoBlock>

## Options / Attributes

| 配置 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否显示加载层；服务调用默认显示 | boolean | false（组件） |
| target | 服务需要覆盖的 DOM 节点或选择器 | HTMLElement / string | document.body |
| body | 将区域服务挂载到 body 并对齐目标 | boolean | false |
| fullscreen | 是否覆盖整个视口；服务未传 target 时默认为 true | boolean | false（组件） |
| lock | 显示期间是否锁定页面滚动 | boolean | false |
| text | 加载文案；服务还接受 VNode / VNode[] | string / number / VNode / VNode[] | '' |
| size | 图标与文字尺寸，可选 small / default / large | string | default |
| spinner | 自定义 Vue 图标组件；服务中的字符串值按 SVG 标记处理 | Component / string | — |
| svg | 自定义 SVG 内部标记 | string | '' |
| svgViewBox | 自定义 SVG 的 viewBox | string | 0 0 24 24 |
| color | 加载图标颜色 | string | 主题主色 |
| background | 加载层背景 CSS 值 | string | 当前材质半透明表面 |
| customClass | 加载层自定义类名 | string / array / object | '' |
| zIndex | 加载层层级 | number | 1000 |
| delay | 延迟显示时间，单位 ms | number | 0 |
| beforeClose | 服务关闭前调用；返回 false 可阻止关闭 | () =&gt; boolean / void | — |
| closed | 服务关闭过渡和 DOM 清理完成后调用 | () =&gt; void | — |

## 指令附加属性

| 属性 | 说明 |
| --- | --- |
| au-loading-text | 加载文案 |
| au-loading-svg / au-loading-spinner | 自定义 SVG 内部标记 |
| au-loading-svg-view-box | SVG viewBox |
| au-loading-background | 加载层背景 |
| au-loading-custom-class | 自定义类名 |
| au-loading-color | 加载图标颜色 |

::: warning 安全提示
`svg`、`au-loading-svg`、`au-loading-spinner` 及兼容的 `element-loading-spinner / element-loading-svg` 会渲染为 SVG 标记。只使用源码内可信内容，不要传入用户提交或未经清理的字符串，以免造成 XSS。
:::

## Service API

| 方法或属性 | 说明 |
| --- | --- |
| AuLoading.service(options) | 创建加载实例；无 target 时为全屏单例 |
| AuLoading.service.closeAll() | 请求关闭全部服务实例；关闭守卫仍会执行 |
| instance.close() | 请求关闭当前实例 |
| instance.setText(text) | 更新加载文案 |
| instance.update(options) | 更新文案、图标、颜色、背景、层级等视觉配置 |
| instance.closed | 实例是否已完成清理，只读 |

## Component Slots / Events / Exposes

| 名称 | 说明 |
| --- | --- |
| default | 被加载层覆盖的内容 |
| spinner | 自定义加载图标，作用域参数为 { size } |
| opened | 加载层进入过渡完成后触发 |
| closed | 加载层离开过渡完成后触发 |
| rootRef | 组件内容根元素引用 |

## AuLoadingSpinner 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 尺寸：small / default / large | string | default |
| text | 加载文字 | string | '' |
| color | 图标颜色 | string | '' |
| spinner | 图标组件 | Component | null |
| compact | 紧凑布局 | boolean | false |
| svg | 可信 SVG 内部标记 | string | '' |
| svgViewBox | SVG viewBox | string | 0 0 24 24 |
