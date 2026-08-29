<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TreeBasic from '../.vitepress/theme/examples/tree/TreeBasic.vue';
import treeBasicSource from '../.vitepress/theme/examples/tree/TreeBasic.vue?demo-source';
</script>

# Tree 树形导航

`AuTree` 用于紧凑的层级导航。组件内部使用固定行高虚拟列表，并提供默认的选中、悬停、折叠和空状态外观。

## 基础用法

`items` 接收已展开为可见行的节点数组；折叠状态由业务侧维护，并在 `toggle` 事件后重新计算可见节点。下方示例包含三级节点，开关可切换 `collapsible`，对比普通多级列表与可折叠树的显示效果。

<DemoBlock
  title="文档导航"
  description="包含三级节点；切换折叠模式后，可使用折叠按钮和左右方向键展开、收起各级分组。"
  :source="treeBasicSource"
  default-expanded
>
  <TreeBasic />
</DemoBlock>

## 使用建议

- 每个节点需要稳定的唯一 key；可用 `itemKey` 与 `labelKey` 映射已有数据字段。
- `collapsible` 默认为 `false`；关闭时按普通层级列表显示，不渲染展开/收起控件。
- 开启 `collapsible` 后，父节点需提供 `hasChildren` 与 `isCollapsed`，并由 `toggle` 事件更新折叠状态。
- 组件负责渲染可见行，业务侧负责将嵌套数据转换为带 `displayDepth` 的扁平数组。

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
| `collapsible` | 是否启用折叠模式；开启后显示节点折叠控件 | `boolean` | `false` |
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
