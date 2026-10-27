<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import PageHeaderBasic from '../.vitepress/theme/examples/page-header/PageHeaderBasic.vue';
import exampleSource from '../.vitepress/theme/examples/page-header/PageHeaderBasic.vue?demo-source';
</script>

# PageHeader 页面标题

`AuPageHeader` 组合标题、说明、返回操作及右侧操作区。窄容器中操作区自动换行。

## 基础用法

<DemoBlock :source="exampleSource">
  <PageHeaderBasic />
</DemoBlock>

组件通过 `back` 事件通知返回操作，路由或历史切换由调用方处理。

## PageHeader API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | string | '' |
| description | 标题说明 | string | '' |
| back | 显示返回按钮 | boolean | false |
| titleTag | 标题标签：h1 / h2 / h3 | string | h2 |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| back | 点击返回按钮 | (event) |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| title | 标题 |
| description | 说明 |
| extra | 右侧操作区 |
| default | 标题下方内容 |
