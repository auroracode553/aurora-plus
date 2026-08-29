<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import PopoverBasic from '../.vitepress/theme/examples/popover/PopoverBasic.vue';
import popoverBasicSource from '../.vitepress/theme/examples/popover/PopoverBasic.vue?demo-source';
</script>

# Popover 弹出层

`AuPopover` 是可承载任意 Vue 内容的锚点浮层，提供受控显示、主轴自动翻转、视口避让、点击外部关闭、Escape 关闭和焦点返回。简单命令列表继续使用 `AuDropdown`，复杂设置或混合控件使用 `AuPopover`。

## 基础用法

<DemoBlock
  title="锚定操作面板"
  description="Popover 负责交互与定位，Panel 和其中的所有内容均由使用者组合。"
  :source="popoverBasicSource"
  default-expanded
>
  <PopoverBasic />
</DemoBlock>

## 使用建议

- 触发按钮绑定 `trigger` 插槽提供的 `triggerProps`，同步 `aria-expanded` 与目标面板关系。
- 默认浮层自带材质表面；内容使用 `AuPanel`、`AuCard` 等表面组件时，设置 `:surface="false"`，避免重复材质层。
- 键盘在触发器上按 `ArrowDown` 会打开浮层并聚焦第一个可操作元素；Escape 关闭并把焦点还给触发器。
- `manual` 模式不从触发器自动打开，适合由 `v-model` 或公开方法统一控制；已打开时仍保留点击外部和 Escape 关闭。

## API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 是否显示浮层 | `boolean` | `false` |
| `placement` | 方位，支持 `top / right / bottom / left` 及 `-start / -end` | `string` | `bottom` |
| `offset` | 浮层与触发器的距离 | `number` | `8` |
| `trigger` | 触发方式，可选 `click / manual` | `string` | `click` |
| `disabled` | 是否禁用打开 | `boolean` | `false` |
| `closeOnClickOutside` | 点击浮层外部时关闭 | `boolean` | `true` |
| `closeOnPressEscape` | 按 Escape 时关闭 | `boolean` | `true` |
| `closeOnContentClick` | 点击内容后是否关闭 | `boolean` | `false` |
| `matchTriggerWidth` | 最小宽度是否匹配触发器 | `boolean` | `false` |
| `surface` | 是否提供默认材质、边框和内边距 | `boolean` | `true` |
| `teleported` | 是否传送到 `appendTo` | `boolean` | `true` |
| `appendTo` | Teleport 目标 | `string / Element` | `body` |
| `role` | 浮层语义角色 | `string` | `dialog` |
| `ariaLabel` | 浮层无障碍名称 | `string` | `''` |
| `ariaLabelledby` | 标题元素 ID | `string` | `''` |
| `ariaDescribedby` | 说明元素 ID | `string` | `''` |
| `zIndex` | 浮层层级 | `number` | `1200` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 显示状态变化 | `(visible)` |
| `open` / `opened` | 开始打开 / 进入动效完成 | — |
| `close` | 开始关闭 | `(reason)` |
| `closed` | 离开动效完成 | — |

### Slots

| 插槽名 | 作用域参数 | 说明 |
| --- | --- | --- |
| `trigger` | `{ open, close, toggle, expanded, triggerProps }` | 触发元素 |
| `default` | `{ open, close, toggle, updatePosition }` | 浮层内容 |

### Exposes

| 名称 | 说明 |
| --- | --- |
| `open(focusContent?)` | 打开浮层，可选择聚焦首个控件 |
| `close(reason?, restoreFocus?)` | 关闭浮层，可选择归还焦点 |
| `toggle()` | 切换显示状态 |
| `updatePosition()` | 重新计算位置 |
| `triggerRef` / `contentRef` | 触发器外壳与浮层元素引用 |
