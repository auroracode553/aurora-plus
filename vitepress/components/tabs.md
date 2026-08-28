<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TabsBasic from '../.vitepress/theme/examples/tabs/TabsBasic.vue';
import tabsBasicSource from '../.vitepress/theme/examples/tabs/TabsBasic.vue?demo-source';
</script>

# Tabs 标签页

`AuTabs` 用于同一内容区域内的并列视图切换。组件自带紧凑下划线样式和键盘方向键导航，业务侧无需覆盖视觉样式。

## 基础用法

<DemoBlock
  title="等宽标签页"
  description="切换标签会更新对应内容；支持禁用项以及方向键、Home、End 键导航。"
  :source="tabsBasicSource"
>
  <TabsBasic />
</DemoBlock>

## 使用建议

- 标签用于切换同一空间内的内容视图，不用于执行一次性命令。
- 标签数量保持克制，标题使用短名词；不可进入的标签使用 `disabled`。
- 侧栏等分标签启用 `fill`，内容宽度不一致的顶部标签保留默认自适应宽度。

## Tabs API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前标签值 | `string \| number` | `''` |
| `items` | 标签数组，支持 `value`、`label`、`title`、`disabled` | `Array` | `[]` |
| `valueKey` | 标签值字段名 | `string` | `value` |
| `fill` | 标签等宽填满容器 | `boolean` | `false` |
| `ariaLabel` | 标签组无障碍名称 | `string` | `标签页` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 当前值更新 | `(value)` |
| `select` | 标签被选择 | `(value, item)` |
| `change` | 当前值发生变化 | `(value, previousValue, item)` |
