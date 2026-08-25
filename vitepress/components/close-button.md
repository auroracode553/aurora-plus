<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import CloseButtonBasic from '../.vitepress/theme/examples/close-button/CloseButtonBasic.vue';
import closeButtonBasicSource from '../.vitepress/theme/examples/close-button/CloseButtonBasic.vue?raw';
</script>

# CloseButton 关闭按钮

圆形关闭按钮，内部组合 `AuIcon` 与 `AuTooltip`，适合标签页、抽屉、卡片和自定义弹层的关闭入口。

## 基础用法

<DemoBlock
  title="提示、禁用与点击事件"
  description="按钮配置来自 closeButtons 数组，事件结果会实时显示在演示区。"
  :source="closeButtonBasicSource"
>
  <CloseButtonBasic />
</DemoBlock>

## CloseButton API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `icon` | 已注册的图标名称 | `string` | `close` |
| `tooltip` | 悬停提示文案 | `string` | `''` |
| `title` | `tooltip` 为空时使用的兼容提示文案 | `string` | `''` |
| `ariaLabel` | 无障碍名称；为空时依次使用提示文案和“关闭” | `string` | `''` |
| `disabled` | 是否禁用按钮及提示 | `boolean` | `false` |

其他原生按钮属性会透传到内部 `<button>`。

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 非禁用状态下点击时触发 | `(event: MouseEvent)` |
