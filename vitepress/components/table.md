<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TableBasic from '../.vitepress/theme/examples/table/TableBasic.vue';
import TableScroll from '../.vitepress/theme/examples/table/TableScroll.vue';
import tableBasicSource from '../.vitepress/theme/examples/table/TableBasic.vue?demo-source';
import tableScrollSource from '../.vitepress/theme/examples/table/TableScroll.vue?demo-source';
</script>

# Table 表格

展示可排序、选择的数据；单元格内容可换行。大数据列表使用 [VirtualTable](/components/virtual-table)。

## 基础用法

<DemoBlock title="表格、排序与选择" :source="tableBasicSource">
  <TableBasic />
</DemoBlock>

## 滚动条

<DemoBlock title="滚动条显示与隐藏" :source="tableScrollSource">
  <TableScroll />
</DemoBlock>

## Table API

### 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `data` | 行数据 | `array` | `[]` |
| `width` | 表格宽度 | `string / number` | `100%` |
| `height` | 表格高度，数字单位为 px | `string / number` | `400` |
| `autoHeight` | 按内容展开高度，忽略 `height` | `boolean` | `false` |
| `headerHeight` | 表头高度，单位 px | `number` | `36` |
| `rowKey` | 行标识字段路径或函数 | `string / Function` | `id` |
| `rowClass` | 行类名或 `({ row, rowIndex }) => string` | `string / Function` | `''` |
| `sortBy` | 受控排序 `{ key, order }`，支持 `v-model:sort-by` | `object` | — |
| `defaultSort` | 初始排序 `{ key, order }` | `object` | `{ key: '', order: '' }` |
| `remoteSort` | 只发出排序事件，由外部调整数据顺序 | `boolean` | `false` |
| `stripe` | 斑马纹 | `boolean` | `false` |
| `border` | 外框与竖向分隔线 | `boolean` | `false` |
| `showScroll` | 滚动条：桌面悬浮显示，触屏由系统显示 | `boolean` | `false` |
| `highlightCurrentRow` | 点击行时高亮当前行 | `boolean` | `false` |
| `loading` | 显示加载状态 | `boolean` | `false` |
| `loadingText` | 加载文字 | `string` | `加载中` |
| `emptyText` | 空数据文字 | `string` | `暂无数据` |

### 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:sortBy` | `(sort)` | 排序状态更新 |
| `sort-change` | `({ key, order, column })` | 点击排序列 |
| `scroll` | `({ scrollTop, scrollLeft, event })` | 表体滚动 |
| `rows-rendered` | `({ start, end })` | 数据行更新 |
| `row-click` / `row-dblclick` | `(row, sourceIndex, event)` | 点击 / 双击行 |
| `cell-click` | `(row, column, sourceIndex, event)` | 点击单元格 |
| `select` | `(selection, row)` | 单行选择变化 |
| `select-all` | `(selection)` | 表头全选变化 |
| `selection-change` | `(selection)` | 已选行变化 |
| `current-change` | `(currentRow, previousRow)` | 当前行变化 |

### 插槽

| 插槽 | 说明 |
| --- | --- |
| `default` | 声明 `AuTableColumn` 列 |
| `empty` | 空数据内容 |
| `loading` | 加载内容 |

### 实例方法与属性

| 名称 | 说明 |
| --- | --- |
| `scrollContainerRef` | 表体滚动容器 |
| `scrollTo(options)` | 滚动到 `scrollTop` / `scrollLeft` |
| `scrollToTop(value?)` / `scrollToLeft(value?)` | 滚动到指定位置 |
| `scrollToRow(index, align?)` | 定位行；`align` 为 `auto / start / center / end` |
| `getRowFromEvent(event)` | 获取事件所在行；未命中返回 `null` |
| `selection` / `currentRow` | 已选行 / 当前行 |
| `toggleRowSelection(row, selected?)` | 切换指定行选择 |
| `toggleAllSelection()` / `clearSelection()` | 全选切换 / 清空选择 |
| `setCurrentRow(row)` | 设置当前行；传 `null` 清除 |

## TableColumn API

### 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `type` | `default / selection / index` | `string` | `default` |
| `prop` | 行对象字段路径，支持 `profile.name` | `string` | `''` |
| `label` | 表头文字 | `string` | `''` |
| `width` | 列宽，单位 px | `number / string` | 普通列 `120`，选择 / 索引列 `48` |
| `minWidth` | 最小列宽，单位 px | `number / string` | 普通列 `60`，选择 / 索引列 `44` |
| `maxWidth` | 最大列宽，单位 px | `number / string` | 无上限 |
| `flexGrow` | 剩余宽度的扩展比例 | `number` | `0` |
| `align` | `left / center / right` | `string` | `left`；选择 / 索引列居中 |
| `fixed` | 固定位置：`true / left / right` | `boolean / string` | `false` |
| `sortable` | 开启列排序 | `boolean` | `false` |
| `sortMethod` | 自定义比较 `(leftRow, rightRow, column)` | `Function` | — |
| `formatter` | 文本格式化 `(row, column, value, index)` | `Function` | — |
| `selectable` | 选择列禁选条件 `(row, index) => boolean` | `Function` | — |
| `columnClass` | 列单元格类名 | `string` | `''` |

### 插槽

| 插槽 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `{ row, column, value, index }` | 单元格内容 |
| `header` | `{ column }` | 表头内容 |
