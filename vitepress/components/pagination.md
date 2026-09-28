<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import PaginationBasic from '../.vitepress/theme/examples/pagination/PaginationBasic.vue';
import paginationBasicSource from '../.vitepress/theme/examples/pagination/PaginationBasic.vue?demo-source';
</script>

# Pagination 分页

`AuPagination` 用于切换分段数据，支持页码折叠、每页条数、跳页与自定义布局。

## 基础用法

<DemoBlock title="完整分页" :source="paginationBasicSource">
  <PaginationBasic />
</DemoBlock>

## Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `currentPage` / `v-model:current-page` | 当前页 | `number` | `1` |
| `pageSize` / `v-model:page-size` | 每页条数 | `number` | `10` |
| `total` | 总条数 | `number` | `0` |
| `pageCount` | 直接指定总页数，优先于 `total` | `number` | — |
| `pagerCount` | 显示的页码数量，5–21 的奇数 | `number` | `7` |
| `layout` | `total / sizes / prev / pager / next / jumper / slot / ->` 的逗号分隔组合 | `string` | `prev, pager, next` |
| `pageSizes` | 每页条数选项 | `number[]` | `[10, 20, 30, 40, 50, 100]` |
| `size` | 尺寸 | `small / default / large` | `default` |
| `disabled` / `background` | 禁用 / 为页码按钮添加表面 | `boolean` | `false` |
| `hideOnSinglePage` | 只有一页时隐藏 | `boolean` | `false` |
| `prevText` / `nextText` | 替代前后翻页图标的文字 | `string` | `''` |
| `jumpText` | 跳页输入框前的文字 | `string` | `前往` |
| `totalFormatter` | 总数文字格式化 | `(total) => string` | — |
| `pageSizeFormatter` | 每页条数文字格式化 | `(size) => string` | — |

## Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:currentPage` / `current-change` | `(page)` | 当前页变化 |
| `update:pageSize` / `size-change` | `(size)` | 每页条数变化 |
| `change` | `(page, size)` | 页码或每页条数变化 |
| `prev-click` / `next-click` | `(page)` | 点击上一页 / 下一页 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `prev` / `next` | 前后翻页按钮内容；提供 `{ disabled }` |
| `default` | `layout` 中 `slot` 的内容 |

## Exposes

| 名称 | 说明 |
| --- | --- |
| `currentPage` / `pageCount` | 当前页 / 总页数 |
| `setCurrentPage(value)` | 切换当前页 |
