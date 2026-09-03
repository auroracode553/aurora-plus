<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import VirtualTableBasic from '../.vitepress/theme/examples/virtual-table/VirtualTableBasic.vue';
import virtualTableBasicSource from '../.vitepress/theme/examples/virtual-table/VirtualTableBasic.vue?demo-source';
</script>

# VirtualTable 虚拟表格

`AuVirtualTable` 面向固定行高的大数据表格，只渲染视口和缓冲区中的行。列通过 JavaScript 对象配置，支持弹性宽度、左右固定、排序、格式化与具名插槽。

## 基础用法

<DemoBlock title="10,000 行数据" description="支持切换刷新加载态；滚动时 DOM 中只保留当前可见行和 overscan 缓冲行。" :source="virtualTableBasicSource" default-expanded>
  <VirtualTableBasic />
</DemoBlock>

## Column 配置

| 字段 | 说明 |
| --- | --- |
| `key` | 列唯一标识，也是具名插槽后缀 |
| `dataKey` | 行对象字段路径，支持 `profile.name` |
| `title` / `label` | 表头文字 |
| `width` / `minWidth` / `maxWidth` | 列宽边界，单位 px |
| `flexGrow` | 容器有剩余空间时的扩展比例 |
| `align` | `left / center / right` |
| `fixed` | `left / right / true`，`true` 等同左固定 |
| `sortable` | 开启列排序 |
| `sortMethod(leftRow, rightRow, column)` | 自定义本地比较函数 |
| `formatter(row, column, value, index)` | 文本格式化函数 |
| `class` | 列单元格类名 |

## Attributes

| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| `columns` / `data` | 列配置 / 完整行数据 | `[] / []` |
| `width` / `height` | 表格外部尺寸 | `100% / 400` |
| `rowHeight` / `headerHeight` | 固定行高 / 表头高度 | `40 / 36` |
| `overscan` | 视口上下额外渲染行数 | `6` |
| `rowKey` | key 字段路径或函数 | `id` |
| `rowClass` | 行类名或 `({ row, rowIndex }) => string` | `''` |
| `sortBy` / `v-model:sort-by` | `{ key, order }`，order 为 `ascending / descending / ''` | — |
| `defaultSort` | 初始排序 | `{ key: '', order: '' }` |
| `remoteSort` | 只发出排序事件，不在组件内重排数据 | `false` |
| `stripe` / `border` | 斑马纹 / 单元格分隔线 | `false` |
| `loading` / `loadingText` | 加载状态与文字 | `false / 加载中` |
| `emptyText` / `ariaLabel` | 空数据文字 / 表格名称 | `暂无数据 / 虚拟表格` |

## Slots、Events 与 Exposes

列 `key` 为 `name` 时，可使用 `#header-name="{ column }"` 和 `#cell-name="{ row, column, value, index }"`。另有 `empty` 与 `loading` 插槽。

事件包括 `sort-change`、`scroll`、`rows-rendered({ start, end })`、`row-click`、`row-dblclick` 和 `cell-click`。组件暴露 `scrollTo(options)`、`scrollToTop(value?)`、`scrollToLeft(value?)`、`scrollToRow(index, align?)` 与 `scrollContainerRef`。

行高必须与 `rowHeight` 一致；需要动态行高或合并单元格时应使用普通表格组件。
