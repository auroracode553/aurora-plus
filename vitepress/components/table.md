<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TableBasic from '../.vitepress/theme/examples/table/TableBasic.vue';
import tableBasicSource from '../.vitepress/theme/examples/table/TableBasic.vue?demo-source';
</script>

# Table 表格

`AuTable` 按单元格内容决定每一行的高度，适合包含多行文字、行数适中的数据。组件渲染全部数据行；大数据列表使用 [VirtualTable 虚拟表格](/components/virtual-table)。

默认没有外框和竖向分隔线，仅以细横线区分表头与数据行。需要网格边框时设置 `border`；可选用 `stripe` 增加斑马纹。

## 基础用法

<DemoBlock title="无边框表格" description="可切换边框和斑马纹，并操作排序、多选、禁选行及当前行高亮。" :source="tableBasicSource">
  <TableBasic />
</DemoBlock>

表格默认高 `400px`，表头保留在滚动区域顶部。设置 `auto-height` 可让表格随所有行自然展开，由外层页面负责纵向滚动。列宽超出表格宽度时，表格内部横向滚动。

列通过 `AuTableColumn` 声明。`prop` 指向行数据字段，`label` 是表头文字，`width` 设置列宽；未设置 `width` 时使用默认列宽。列上的 `#default="{ row, value, index }"` 可定制单元格，`#header="{ column }"` 可定制表头。`AuTable` 与 `AuVirtualTable` 共用这套列 API；非虚拟表格无需提供 `rowHeight` 或 `overscan`。

`type="selection"` 提供全选和逐行多选，可用 `:selectable="(row, index) => boolean"` 禁用指定行；`type="index"` 显示排序后的行号。设置 `highlight-current-row` 后点击行会高亮当前行。选择事件为 `select(selection, row)`、`select-all(selection)`、`selection-change(selection)`；当前行变化时触发 `current-change(currentRow, previousRow)`。选择状态按 `row-key` 跟踪，数据替换时自动移除已不存在的行。

组件实例提供 `selection`、`currentRow`、`toggleRowSelection(row, selected?)`、`toggleAllSelection()`、`clearSelection()` 和 `setCurrentRow(row)`；`setCurrentRow(null)` 清除当前行。

`getRowFromEvent(event)` 可获取指针事件所在行的数据，事件不在行内时返回 `null`。组件还暴露 `scrollContainerRef`、`scrollTo(options)`、`scrollToTop(value?)`、`scrollToLeft(value?)` 与 `scrollToRow(index, align?)`。
