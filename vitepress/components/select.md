<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import SelectBasic from '../.vitepress/theme/examples/select/SelectBasic.vue';
import selectBasicSource from '../.vitepress/theme/examples/select/SelectBasic.vue?demo-source';
</script>

# Select 选择器

`AuSelect` 使用 Aurora Plus 的紧凑列表弹层呈现选项，并统一尺寸、焦点、禁用态和错误态。选项仍通过熟悉的 `option` 与 `optgroup` 声明。

## 基础用法

<DemoBlock
  title="选项与尺寸"
  description="下拉选项使用轻量材质、状态色和选中标记，同时提供默认、小尺寸和禁用状态。"
  :source="selectBasicSource"
>
  <SelectBasic />
</DemoBlock>

## 使用建议

- 选项较少且互斥时使用 `AuSelect`；需要执行命令的操作集合使用 `AuDropdown`。
- 通过默认插槽传入 `option` 或 `optgroup`；组件会将这些声明转换为统一风格的选项列表。
- 需要根据最长选项自适应宽度时使用 `fit-content`，并通过 `max-width` 限制最大宽度；超过限制后才会省略文字。
- 字段名称使用可见的 `label`，错误状态同时提供文字说明。
- 键盘可使用方向键、`Home`、`End` 导航，使用 `Enter` 或空格确认，使用 `Escape` 关闭。

## Select API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前选中值 | `string / number / boolean` | `''` |
| `size` | 尺寸 | `small / default / large` | `default` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `invalid` | 是否显示错误态 | `boolean` | `false` |
| `fitContent` | 是否根据全部可见选项中的最长内容自适应宽度 | `boolean` | `false` |
| `maxWidth` | 自适应模式的最大宽度，数字会转换为 px | `string / number` | `320` |
| `teleported` | 是否将选项弹层传送到目标容器 | `boolean` | `true` |
| `appendTo` | 选项弹层挂载目标 | `string / HTMLElement` | `'body'` |
| `zIndex` | 选项弹层层级 | `number` | `1200` |

未声明的 `id`、`title`、`tabindex`、`aria-*`、`data-*` 和监听器会作用于选择触发器。传入 `name` 与 `form` 时，当前值会通过隐藏字段参与表单提交；`required` 会映射为 `aria-required`。

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 选中值变化 | `(value)` |
| `change` | 选中值变化 | `(value, sourceEvent)` |
| `focus` | 获得焦点 | `(event)` |
| `blur` | 失去焦点 | `(event)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | `option` 或 `optgroup` 选项声明 |

### Exposes

| 方法或属性 | 说明 |
| --- | --- |
| `focus(options?)` | 聚焦选择框 |
| `blur()` | 移除焦点 |
| `open()` | 打开选项弹层 |
| `close()` | 关闭选项弹层 |
| `toggle()` | 切换选项弹层 |
| `selectRef` | 选择触发按钮引用 |
| `listboxRef` | 选项列表引用 |
