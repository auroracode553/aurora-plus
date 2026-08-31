<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import PaginationBasic from '../.vitepress/theme/examples/pagination/PaginationBasic.vue';
import paginationBasicSource from '../.vitepress/theme/examples/pagination/PaginationBasic.vue?demo-source';
</script>

# Pagination 分页

`AuPagination` 用于切换分段数据，支持页码折叠、每页条数、跳页与自定义布局。当前页和每页条数均可独立使用 `v-model`。

## 基础用法

<DemoBlock title="完整分页" description="布局中的箭头分隔符会把后续控件推到容器右侧。" :source="paginationBasicSource" default-expanded>
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
| `totalFormatter` | 总数文字格式化 | `(total) => string` | — |
| `pageSizeFormatter` | 每页条数文字格式化 | `(size) => string` | — |
| `ariaLabel` | 分页导航名称 | `string` | `分页导航` |

## Events 与 Slots

事件包括 `update:currentPage`、`update:pageSize`、`current-change(page)`、`size-change(size)`、`change(page, size)`、`prev-click(page)` 和 `next-click(page)`。插槽包括 `prev`、`next`，以及 `layout` 含 `slot` 时使用的默认插槽。

组件暴露 `setCurrentPage(page)`、`currentPage` 和 `pageCount`。
