# Tree 树形导航

`AuTree` 用于紧凑的层级导航。组件内部使用固定行高虚拟列表，并提供默认的选中、悬停、折叠和空状态外观。

```vue
<script setup>
import { ref } from 'vue';
import { AuTree } from 'aurora-ui';

const selectedKey = ref(1);
const items = [
  { id: 1, title: '介绍', displayDepth: 0, hasChildren: true, isCollapsed: false },
  { id: 2, title: '安装', displayDepth: 1, hasChildren: false, isCollapsed: false },
];
</script>

<template>
  <AuTree
    :items="items"
    :selected-key="selectedKey"
    item-key="id"
    label-key="title"
    collapsible
    @select="selectedKey = $event.id"
  />
</template>
```

## Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `items` | 已展开为可见行的树节点数组 | `Array` | `[]` |
| `selectedKey` | 当前选中节点 key | `string \| number \| null` | `null` |
| `itemKey` | 节点 key 字段名 | `string` | `id` |
| `labelKey` | 节点标题字段名 | `string` | `label` |
| `itemHeight` | 固定行高 | `number` | `28` |
| `overscan` | 视口外预渲染行数 | `number` | `8` |
| `baseIndent` | 根节点起始缩进 | `number` | `10` |
| `indent` | 每层缩进距离 | `number` | `16` |
| `collapsible` | 显示节点折叠控件 | `boolean` | `false` |
| `emptyText` | 空状态文本 | `string` | `暂无数据` |
| `ariaLabel` | 树导航无障碍名称 | `string` | `树形导航` |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `select` | 选择节点 | `(item)` |
| `toggle` | 请求切换节点展开状态 | `(item)` |

## Exposes

| 属性或方法 | 说明 |
| --- | --- |
| `scrollToTop()` | 滚动到顶部 |
| `scrollToIndex(index, align?)` | 滚动到指定节点 |
