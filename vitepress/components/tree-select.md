<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TreeSelectBasic from '../.vitepress/theme/examples/tree-select/TreeSelectBasic.vue';
import treeSelectBasicSource from '../.vitepress/theme/examples/tree-select/TreeSelectBasic.vue?demo-source';
</script>

# TreeSelect 树形选择

`AuTreeSelect` 在紧凑输入框中选择单个层级节点。

## 基础用法

<DemoBlock
  title="搜索与叶节点选择"
  :source="treeSelectBasicSource"
>
  <TreeSelectBasic />
</DemoBlock>

## Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 选中节点 key | `string / number / null` | `null` |
| `data` | 嵌套节点数据 | `array` | `[]` |
| `itemKey` / `labelKey` / `childrenKey` / `disabledKey` | 字段映射 | `string` | `id / label / children / disabled` |
| `expandedKeys` | 受控展开 key | `array / null` | `null` |
| `defaultExpandedKeys` | 非受控初始展开 key | `array` | `[]` |
| `defaultExpandAll` | 初始展开全部父节点 | `boolean` | `false` |
| `leafOnly` | 仅允许选择叶节点 | `boolean` | `false` |
| `filterable` | 是否允许输入搜索 | `boolean` | `false` |
| `filterPlaceholder` | 搜索占位文字 | `string` | `搜索节点` |
| `placeholder` | 未选择时占位文字 | `string` | `选择节点` |
| `emptyText` / `noMatchText` | 空数据 / 无匹配文字 | `string` | `暂无数据 / 无匹配节点` |
| `clearable` | 是否允许清空；有值时清除按钮原位替换展开图标 | `boolean` | `true` |
| `disabled` / `invalid` | 禁用 / 错误状态 | `boolean` | `false` |
| `size` | 尺寸 | `small / default / large` | `default` |
| `itemHeight` / `overscan` | 虚拟列表行高 / 预渲染数 | `number` | `28 / 8` |
| `placement` | 浮层方位 | `string` | `bottom-start` |
| `teleported` / `appendTo` / `zIndex` | 浮层挂载与层级 | `boolean / string \| Element / number` | `true / body / 1200` |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 选中值变化 | `(key)` |
| `change` | 选择或清空 | `(key, node, event?)` |
| `select` | 选择节点 | `(node)` |
| `clear` | 清空 | `(event)` |
| `update:expandedKeys` | 展开 key 变化 | `(keys)` |
| `expand-change` | 请求切换展开状态 | `(keys, node)` |
| `focus` / `blur` | 输入框焦点变化 | `(event)` |
| `visible-change` | 浮层显隐变化 | `(visible)` |

## Exposes

| 名称 | 说明 |
| --- | --- |
| `focus(options?)` / `blur()` | 输入框聚焦 / 失焦 |
| `open()` / `close(reason?)` | 打开 / 关闭浮层 |
| `inputRef` / `treeRef` / `popoverRef` | 输入框、树、浮层引用 |
