# Table 表格

`AuTable` 按单元格内容决定每一行的高度，适合包含多行文字、行数适中的数据。组件渲染全部数据行；大数据列表使用 [VirtualTable 虚拟表格](/components/virtual-table)。

```vue
<script setup>
import { AuTable, AuTableColumn } from 'aurora-plus';
const rows = [
  { id: 1, name: '示例一', summary: '一行内容' },
  { id: 2, name: '示例二', summary: '较长的正文会根据列宽自然换行，所在数据行也会随内容增加高度。' },
];
</script>

<template>
  <AuTable :data="rows" :height="240" row-key="id">
    <AuTableColumn prop="name" label="名称" :width="140" />
    <AuTableColumn prop="summary" label="摘要" :width="240" />
  </AuTable>
</template>
```

表格默认高 `400px`，表头保留在滚动区域顶部。设置 `auto-height` 可让表格随所有行自然展开，由外层页面负责纵向滚动。列宽超出表格宽度时，表格内部横向滚动。

列通过 `AuTableColumn` 声明。`prop` 指向行数据字段，`label` 是表头文字，`width` 设置列宽；未设置 `width` 时使用默认列宽。列上的 `#default="{ row, value, index }"` 可定制单元格，`#header="{ column }"` 可定制表头。`AuTable` 与 `AuVirtualTable` 共用这套列 API；非虚拟表格无需提供 `rowHeight` 或 `overscan`。

`getRowFromEvent(event)` 可获取指针事件所在行的数据，事件不在行内时返回 `null`。组件还暴露 `scrollContainerRef`、`scrollTo(options)`、`scrollToTop(value?)`、`scrollToLeft(value?)` 与 `scrollToRow(index, align?)`。
