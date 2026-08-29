<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import LinkBasic from '../.vitepress/theme/examples/link/LinkBasic.vue';
import linkBasicSource from '../.vitepress/theme/examples/link/LinkBasic.vue?demo-source';
</script>

# Link 文字链接

用于页面跳转、打开外部资源或触发与导航含义一致的轻量交互。组件保持原生 `<a>` 语义，不使用按钮表面。

## 基础用法

<DemoBlock
  title="类型、下划线、禁用与图标"
  description="默认在悬停时显示下划线；语义类型只改变文字颜色，不增加背景、边框或按钮内边距。"
  :source="linkBasicSource"
>
  <LinkBasic />
</DemoBlock>

## 使用建议

- 页面跳转或打开资源使用 `AuLink`，提交、确认等操作使用 `AuButton`。
- `target="_blank"` 时同时传入 `rel="noopener noreferrer"`。
- `href` 会直接透传给原生 `<a>`；对于不可信输入，业务侧必须校验协议和目标地址。
- 禁用状态不会渲染 `href` 和 `target`，也不会触发组件的 `click` 事件。

## Link API

### Attributes

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| `type` | 语义类型 | `string` | `default / primary / success / warning / danger / info` | `default` |
| `underline` | 下划线显示策略 | `string` | `always / hover / never` | `hover` |
| `disabled` | 是否禁用 | `boolean` | — | `false` |
| `href` | 原生链接地址 | `string` | — | `''` |
| `target` | 原生链接目标 | `string` | `_self / _blank / _parent / _top` 或其他合法目标 | `_self` |
| `icon` | 链接前置图标组件 | `Component` | — | `null` |

未被组件声明的属性（例如 `rel`、`download`、`hreflang`、`aria-label`）会透传到原生 `<a>`。

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 链接可用时触发；禁用状态不会触发 | `(event: MouseEvent)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 链接文字或其他行内内容 |
| `icon` | 覆盖 `icon` 属性对应的前置图标 |
