<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TreeBasic from '../.vitepress/theme/examples/tree/TreeBasic.vue';
import treeBasicSource from '../.vitepress/theme/examples/tree/TreeBasic.vue?demo-source';
</script>

# Tree 树形导航

`AuTree` 用于紧凑的层级导航。

## 基础用法

<DemoBlock
  title="文档导航"
  :source="treeBasicSource"
>
  <TreeBasic />
</DemoBlock>

## Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 已展开为可见行的树节点数组 | Array | [] |
| selectedKey | 当前选中节点 key | string \| number \| null | null |
| itemKey | 节点 key 字段名 | string | id |
| labelKey | 节点标题字段名 | string | label |
| disabledKey | 节点禁用字段名 | string | disabled |
| itemHeight | 固定行高 | number | 28 |
| overscan | 视口外预渲染行数 | number | 8 |
| baseIndent | 根节点起始缩进 | number | 10 |
| indent | 每层缩进距离 | number | 16 |
| collapsible | 是否启用折叠模式；开启后显示节点折叠控件 | boolean | false |
| emptyText | 空状态文本 | string | 暂无数据 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| select | 选择节点 | (item) |
| toggle | 请求切换节点展开状态 | (item) |

## Exposes

| 属性或方法 | 说明 |
| --- | --- |
| scrollToTop() | 滚动到顶部 |
| scrollToIndex(index, align?) | 滚动到指定节点 |
