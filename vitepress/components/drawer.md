<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import DrawerBasic from '../.vitepress/theme/examples/drawer/DrawerBasic.vue';
import drawerBasicSource from '../.vitepress/theme/examples/drawer/DrawerBasic.vue?demo-source';
</script>

# Drawer 抽屉

从视口边缘滑出的内容容器，适合设置面板、详情面板和分步编辑。组件提供四向打开、响应式尺寸、透明模态交互层、滚动锁、Escape 关闭、焦点管理和关闭前守卫。

抽屉面板继承全局或局部的 `soft`、`clear`、`solid` 材质设置。模态交互层保持透明，不改变抽屉之外页面的亮度；面板使用通用浮层阴影与细边框表达层级。

## 基础用法

<DemoBlock
  title="编辑项目设置"
  description="抽屉内容由默认插槽承载，底部操作使用 footer 插槽。"
  :source="drawerBasicSource"
>
  <DrawerBasic />
</DemoBlock>

## Drawer API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue / v-model` | 是否显示 | `boolean` | `false` |
| `title` | 默认标题；用于生成无障碍标题关联 | `string` | `` |
| `direction` | 打开方向：`ltr` 左侧、`rtl` 右侧、`ttb` 顶部、`btt` 底部 | `string` | `rtl` |
| `size` | 水平方向为宽度，垂直方向为高度；数字转换为 px | `string / number` | `min(420px, calc(100vw - 16px))` |
| `modal` | 是否启用透明模态交互层并设置 `aria-modal` | `boolean` | `true` |
| `lockScroll` | 显示期间是否锁定页面滚动 | `boolean` | `true` |
| `teleported` | 是否 Teleport 到 `appendTo` | `boolean` | `true` |
| `appendTo` | Teleport 目标节点或选择器 | `string / object` | `body` |
| `closeOnClickModal` | 点击模态交互层是否关闭 | `boolean` | `true` |
| `closeOnPressEscape` | 按 Escape 是否关闭 | `boolean` | `true` |
| `showClose` | 是否显示标题栏关闭按钮 | `boolean` | `true` |
| `withHeader` | 是否渲染标题栏；关闭后标题、关闭按钮和 `header` 插槽均不渲染 | `boolean` | `true` |
| `closeLabel` | 关闭按钮提示和无障碍名称 | `string` | `关闭抽屉` |
| `destroyOnClose` | 关闭过渡完成后是否销毁内容 | `boolean` | `false` |
| `beforeClose` | 关闭前守卫；接收 `done`，也支持返回布尔值或 Promise | `(done) => void \| boolean \| Promise<boolean>` | — |
| `ariaLabel` | 自定义抽屉无障碍名称 | `string` | `` |
| `ariaLabelledby` | 自定义标题元素 ID | `string` | `` |
| `ariaDescribedby` | 自定义描述元素 ID | `string` | `` |
| `zIndex` | 模态层级 | `number` | `10000` |

`beforeClose` 使用回调风格时调用 `done()` 允许关闭；调用 `done(false)` 或返回 `false` 会保留抽屉。Promise 解析为 `false` 也会阻止关闭。守卫执行期间关闭按钮会暂时禁用，重复关闭请求会被忽略。

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 组件内部请求关闭时更新绑定值 | `(visible: boolean)` |
| `open` | 开始打开时触发 | — |
| `opened` | 打开过渡结束后触发 | — |
| `close` | 组件内部触发关闭时调用 | `(reason: DrawerCloseReason)` |
| `closed` | 关闭过渡结束后触发 | — |
| `before-close-error` | `beforeClose` 抛出异常或 Promise reject | `(error: unknown)` |

`DrawerCloseReason` 为 `api`、`overlay`、`escape` 或 `close-button`。父组件直接把 `v-model` 改为 `false` 时不会额外触发 `close`。

### Slots

| 插槽名 | 作用域参数 | 说明 |
| --- | --- | --- |
| `default` | `{ close }` | 抽屉正文 |
| `header` | `{ close }` | 自定义标题栏内容 |
| `footer` | `{ close }` | 底部操作区；未提供时不渲染 footer |

### Exposes

| 属性或方法 | 说明 |
| --- | --- |
| `close(reason?)` | 从组件实例主动关闭；默认 reason 为 `api`，仍会执行 `beforeClose` |
| `drawerRef` | 抽屉内容根元素引用 |
