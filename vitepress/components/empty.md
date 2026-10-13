<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import EmptyBasic from '../.vitepress/theme/examples/empty/EmptyBasic.vue';
import exampleSource from '../.vitepress/theme/examples/empty/EmptyBasic.vue?demo-source';
</script>

# Empty 空状态

`AuEmpty` 为无内容区域提供图标、说明和操作位置，默认继承容器背景。

## 基础用法

<DemoBlock :source="exampleSource">
  <EmptyBasic />
</DemoBlock>

## Empty API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | string | 暂无数据 |
| description | 补充说明 | string | '' |
| icon | 图标组件 | Component | null |
| size | 尺寸：small / default | string | default |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| image | 替换默认图标 |
| title | 标题 |
| description | 补充说明 |
| default | 操作区 |
