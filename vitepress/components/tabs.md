<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TabsBasic from '../.vitepress/theme/examples/tabs/TabsBasic.vue';
import tabsBasicSource from '../.vitepress/theme/examples/tabs/TabsBasic.vue?demo-source';
</script>

# Tabs 标签页

`AuTabs` 用于同一内容区域内的并列视图切换。

## 基础用法

<DemoBlock
  title="基础标签页"
  :source="tabsBasicSource"
>
  <TabsBasic />
</DemoBlock>

## Tabs API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前标签值 | `string \| number` | `''` |
| `items` | 标签数组，支持 `value`、`label`、`title`、`disabled` | `Array` | `[]` |
| `valueKey` | 标签值字段名 | `string` | `value` |
| `fill` | 标签按钮等宽填满容器，文字居中，下划线保持文字宽度 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 当前值更新 | `(value)` |
| `select` | 标签被选择 | `(value, item)` |
| `change` | 当前值发生变化 | `(value, previousValue, item)` |
