<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import DialogBasic from '../.vitepress/theme/examples/dialog/DialogBasic.vue';
import dialogBasicSource from '../.vitepress/theme/examples/dialog/DialogBasic.vue?demo-source';
</script>

# Dialog 对话框

通过 `v-model` 控制的模态内容容器。组件负责遮罩、Escape、焦点进入与恢复、滚动锁和过渡事件；表单数据及提交逻辑由业务层维护。

Dialog 固定使用不透明实色面板，footer 与正文使用相同背景。模态交互遮罩保持透明，不进行全屏变暗或背景模糊；切换 `data-au-material` 不会让 Dialog 面板变为透明材质。

打开时默认聚焦对话框容器，不会自动聚焦关闭按钮。需要让表单控件或操作按钮获得初始焦点时，在目标元素上显式添加 `autofocus`。

## 基础用法

<DemoBlock
  title="编辑项目资料"
  description="表单绑定 draftProfile，并通过底部操作区完成取消或保存。"
  :source="dialogBasicSource"
>
  <DialogBasic />
</DemoBlock>

## Dialog API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue / v-model` | 是否显示 | `boolean` | `true` |
| `title` | 默认标题 | `string` | `''` |
| `width` | 宽度；数字转换为 px | `string / number` | `min(560px, calc(100vw - 32px))` |
| `height` | 固定高度；数字转换为 px | `string / number` | `''` |
| `maxHeight` | 最大高度；数字转换为 px | `string / number` | `90vh` |
| `top` | 对话框顶部外边距；数字转换为 px | `string / number` | `''` |
| `modal` | 是否启用透明模态交互遮罩并设置 `aria-modal` | `boolean` | `true` |
| `lockScroll` | 显示期间是否锁定页面滚动 | `boolean` | `true` |
| `appendToBody` | 是否 Teleport 到 `body` | `boolean` | `true` |
| `closeOnClickModal` | 点击遮罩是否关闭 | `boolean` | `false` |
| `closeOnOverlay` | `closeOnClickModal` 的兼容属性 | `boolean` | `false` |
| `closeOnPressEscape` | 按 Escape 是否关闭 | `boolean` | `true` |
| `showClose` | 是否显示右上角关闭按钮 | `boolean` | `true` |
| `closeLabel` | 关闭按钮提示和无障碍名称 | `string` | `关闭` |
| `zIndex` | 遮罩层级 | `number` | `10000` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 内部请求关闭时更新绑定值 | `(visible: boolean)` |
| `open` | 开始打开时触发 | — |
| `opened` | 打开过渡结束后触发 | — |
| `close` | 组件内部触发关闭时调用 | `(reason: DialogCloseReason)` |
| `closed` | 关闭过渡结束后触发 | — |

`DialogCloseReason` 为 `api`、`overlay`、`escape` 或 `close-button`。父组件直接把 `v-model` 改为 `false` 时不会额外触发 `close`。

### Slots

| 插槽名 | 作用域参数 | 说明 |
| --- | --- | --- |
| `default` | `{ close }` | 对话框正文 |
| `header` | `{ close }` | 自定义标题区域 |
| `footer` | `{ close }` | 底部操作区；未提供时不渲染 footer |

### Exposes

| 属性或方法 | 说明 |
| --- | --- |
| `close(reason?)` | 从组件实例主动关闭，默认 reason 为 `api` |
| `dialogRef` | 对话框内容根元素引用 |
