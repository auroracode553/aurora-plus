<script setup>
import VirtualListDemo from '../.vitepress/theme/components/VirtualListDemo.vue';
</script>

# 虚拟列表

`AuVirtualList` 面向固定行高数据，只渲染视口与 overscan 缓冲区内的项目。

<VirtualListDemo />

```vue
<AuVirtualList class="file-list" :items="files" :item-height="36" v-slot="{ item, index }">
  <div class="file-row">{{ index + 1 }}. {{ item.name }}</div>
</AuVirtualList>
```

容器必须具备可计算高度，每个列表项的实际高度应与 `itemHeight` 一致。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `array` | `[]` | 完整数据列表 |
| `itemHeight` | `number` | `28` | 固定行高，单位 px |
| `overscan` | `number` | `8` | 视口外预渲染行数 |
| `keyField` | `string` | `id` | 默认 key 字段 |
| `itemKey` | `function` | 空 | 自定义 key 计算函数 |

组件实例暴露 `scrollToTop()` 和 `scrollToIndex(index, align)`；`align` 支持 `auto`、`start`、`center` 和 `end`。
