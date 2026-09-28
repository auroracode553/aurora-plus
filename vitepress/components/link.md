<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import LinkBasic from '../.vitepress/theme/examples/link/LinkBasic.vue';
import linkBasicSource from '../.vitepress/theme/examples/link/LinkBasic.vue?demo-source';
</script>

# Link 文字链接

用于页面跳转、打开外部资源或触发与导航含义一致的轻量交互。

## 基础用法

<DemoBlock
  title="类型、下划线、禁用与图标"
  :source="linkBasicSource"
>
  <LinkBasic />
</DemoBlock>

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

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 链接可用时触发；禁用状态不会触发 | `(event: MouseEvent)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 链接文字或其他行内内容 |
| `icon` | 覆盖 `icon` 属性对应的前置图标 |
