<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import VirtualTableBasic from '../.vitepress/theme/examples/virtual-table/VirtualTableBasic.vue';
import VirtualTableAutoHeight from '../.vitepress/theme/examples/virtual-table/VirtualTableAutoHeight.vue';
import virtualTableBasicSource from '../.vitepress/theme/examples/virtual-table/VirtualTableBasic.vue?demo-source';
import virtualTableAutoHeightSource from '../.vitepress/theme/examples/virtual-table/VirtualTableAutoHeight.vue?demo-source';
</script>

# VirtualTable 虚拟表格

固定行高的大数据表格，仅渲染可见行。列配置见 [TableColumn API](/components/table#tablecolumn-api)。

## 基础用法

<DemoBlock title="10,000 行数据" :source="virtualTableBasicSource">
  <VirtualTableBasic />
</DemoBlock>

## 自动高度

<DemoBlock title="自动展开全部行" :source="virtualTableAutoHeightSource">
  <VirtualTableAutoHeight />
</DemoBlock>

## VirtualTable API

### 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 行数据 | array | [] |
| width | 表格宽度 | string / number | 100% |
| height | 表格高度，数字单位为 px | string / number | 400 |
| autoHeight | 按全部行展开高度，忽略 height | boolean | false |
| rowHeight | 固定行高，单位 px | number | 40 |
| headerHeight | 表头高度，单位 px | number | 36 |
| overscan | 视口上下额外渲染行数 | number | 6 |
| rowKey | 行标识字段路径或函数 | string / Function | id |
| rowClass | 行类名或 ({ row, rowIndex }) =&gt; string | string / Function | '' |
| sortBy | 受控排序 { key, order }，支持 v-model:sort-by | object | — |
| defaultSort | 初始排序 { key, order } | object | { key: '', order: '' } |
| remoteSort | 只发出排序事件，由外部调整数据顺序 | boolean | false |
| stripe | 斑马纹 | boolean | false |
| border | 外框与竖向分隔线 | boolean | false |
| showScroll | 滚动条：桌面悬浮显示，触屏由系统显示 | boolean | false |
| highlightCurrentRow | 点击行时高亮当前行 | boolean | false |
| loading | 显示加载状态 | boolean | false |
| loadingText | 加载文字 | string | 加载中 |
| emptyText | 空数据文字 | string | 暂无数据 |

### 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| update:sortBy | (sort) | 排序状态更新 |
| sort-change | ({ key, order, column }) | 点击排序列 |
| scroll | ({ scrollTop, scrollLeft, event }) | 表体滚动 |
| rows-rendered | ({ start, end }) | 可见行范围更新 |
| row-click / row-dblclick | (row, sourceIndex, event) | 点击 / 双击行 |
| cell-click | (row, column, sourceIndex, event) | 点击单元格 |
| select | (selection, row) | 单行选择变化 |
| select-all | (selection) | 表头全选变化 |
| selection-change | (selection) | 已选行变化 |
| current-change | (currentRow, previousRow) | 当前行变化 |

### 插槽

| 插槽 | 说明 |
| --- | --- |
| default | 声明 AuTableColumn 列 |
| empty | 空数据内容 |
| loading | 加载内容 |

### 实例方法与属性

| 名称 | 说明 |
| --- | --- |
| scrollContainerRef | 表体滚动容器 |
| scrollTo(options) | 滚动到 scrollTop / scrollLeft |
| scrollToTop(value?) / scrollToLeft(value?) | 滚动到指定位置 |
| scrollToRow(index, align?) | 定位行；align 为 auto / start / center / end |
| selection / currentRow | 已选行 / 当前行 |
| toggleRowSelection(row, selected?) | 切换指定行选择 |
| toggleAllSelection() / clearSelection() | 全选切换 / 清空选择 |
| setCurrentRow(row) | 设置当前行；传 null 清除 |
