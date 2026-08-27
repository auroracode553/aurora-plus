<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import VirtualListBasic from '../.vitepress/theme/examples/virtual-list/VirtualListBasic.vue';
import virtualListBasicSource from '../.vitepress/theme/examples/virtual-list/VirtualListBasic.vue?demo-source';
</script>

# VirtualList 虚拟列表

`AuVirtualList` 面向固定行高数据，只渲染视口与 overscan 缓冲区内的项目。

## 基础用法

示例用 1,000 条数据展示筛选、范围变化和命令式滚动。

<DemoBlock
  title="1,000 条项目数据"
  description="输入关键词筛选，或通过组件实例定位到列表中间；DOM 仅保留当前范围和缓冲项。"
  :source="virtualListBasicSource"
  default-expanded
>
  <VirtualListBasic />
</DemoBlock>

## 使用约束

- 容器必须具备可计算高度，例如 `height: 400px` 或由父级布局确定的高度。
- 每个列表项的实际高度必须与 `itemHeight` 完全一致；组件不支持动态行高。
- `items` 应保持稳定引用，数据筛选可使用 `computed`，不应在模板表达式内反复创建数组。
- 数据对象存在稳定 ID 时优先使用 `keyField`；复杂场景使用 `itemKey`。

## VirtualList API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `items` | 完整数据数组 | `T[]` | `[]` |
| `itemHeight` | 固定行高，单位 px，必须大于 0 | `number` | `28` |
| `overscan` | 视口上下额外渲染的行数 | `number` | `8` |
| `keyField` | 从对象数据读取 key 的字段 | `string` | `id` |
| `itemKey` | 自定义 key 计算函数，优先级高于 `keyField` | `(item: T, index: number) => string \| number` | — |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `scroll` | 原生滚动事件 | `(event: Event)` |
| `range-change` | 实际渲染范围变化；`end` 为不包含的结束索引 | `({ start, end })` |

### Slots

| 插槽名 | 作用域参数 | 说明 |
| --- | --- | --- |
| `default` | `{ item: T, index: number }` | 每一个当前可见列表项 |
| `empty` | — | `items` 为空时的内容 |

### Exposes

| 属性或方法 | 说明 |
| --- | --- |
| `scrollToTop()` | 滚动到顶部 |
| `scrollToIndex(index, align?)` | 滚动到指定索引；`align` 支持 `auto / start / center / end` |
| `scrollContainerRef` | 内部滚动容器元素引用 |
