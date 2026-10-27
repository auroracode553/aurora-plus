<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TagBasic from '../.vitepress/theme/examples/tag/TagBasic.vue';
import exampleSource from '../.vitepress/theme/examples/tag/TagBasic.vue?demo-source';
</script>

# Tag 标签

`AuTag` 用于状态、分类和可移除条目的紧凑文字标签。

## 基础用法

<DemoBlock :source="exampleSource">
  <TagBasic />
</DemoBlock>

`close` 只通知调用方，由调用方控制标签是否移除。

## Tag API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 语义类型：default / primary / success / warning / danger / info | string | default |
| size | 尺寸：small / default / large | string | default |
| dot | 显示语义色状态点 | boolean | false |
| closable | 显示关闭按钮 | boolean | false |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| close | 点击关闭按钮 | (event) |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 标签文字 |
