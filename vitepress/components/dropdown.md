<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import DropdownBasic from '../.vitepress/theme/examples/dropdown/DropdownBasic.vue';
import dropdownBasicSource from '../.vitepress/theme/examples/dropdown/DropdownBasic.vue?demo-source';
</script>

# Dropdown 下拉菜单

用于将一组低频或次级操作收纳到触发器附近。菜单是独立的半透明材质层，打开后会自动进行视口避让，并支持鼠标、键盘和点击外部关闭。

## 基础用法

`items` 是菜单项数组，触发器通过 `trigger` 插槽传入任意按钮或链接。菜单选择后会触发 `select`，默认关闭菜单。

<DemoBlock
  title="项目操作"
  description="支持图标、快捷键提示、分隔线、禁用项和危险操作。"
  :source="dropdownBasicSource"
>
  <DropdownBasic />
</DemoBlock>

### 菜单项结构

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `id` | 菜单项唯一标识 | `string / number` |
| `label` | 显示文字；也可使用 `text` | `string` |
| `value` | 业务值，同时作为未设置 command 时的回传值 | `unknown` |
| `icon` | 图标组件 | `Component` |
| `shortcut` | 仅展示的快捷键提示 | `string` |
| `disabled` | 是否禁用 | `boolean` |
| `danger` | 是否使用危险色 | `boolean` |
| `command` | `command` 事件的回传值 | `unknown` |
| `type` / `divider` | `type="divider"` 或 `divider=true` 渲染分隔线 | — |

## 使用建议

- 菜单项应使用明确的动词和对象；同一层级避免放入过多低频操作。
- 需要二元开关或多选状态时使用 `AuSwitch` / `AuCheckbox`，不要把菜单项当作持久状态控件。
- 触发器应提供可见文字；纯图标触发器需要 `aria-label` 和 `title`。
- 破坏性操作设置 `danger`，并在 `beforeSelect` 中完成确认或权限判断。

## Dropdown API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 菜单是否打开 | `boolean` | `false` |
| `items` | 菜单项数组 | `array` | `[]` |
| `placement` | 菜单相对触发器的位置 | `string` | `bottom-start` |
| `offset` | 菜单与触发器的间距 | `number` | `6` |
| `matchTriggerWidth` | 是否使用触发器宽度作为最小宽度 | `boolean` | `false` |
| `disabled` | 是否禁用打开 | `boolean` | `false` |
| `closeOnSelect` | 选择后是否关闭 | `boolean` | `true` |
| `closeOnClickOutside` | 点击外部是否关闭 | `boolean` | `true` |
| `beforeSelect` | 选择前的同步或异步判断；返回 `false` 会取消 | `function` | `null` |
| `itemKey` | 自定义菜单项 key 解析函数 | `function` | `null` |
| `teleported` | 是否 Teleport 到 `appendTo` | `boolean` | `true` |
| `appendTo` | Teleport 目标 | `string / element` | `body` |
| `ariaLabel` | 菜单无障碍名称 | `string` | `下拉菜单` |
| `zIndex` | 菜单层级 | `number` | `1200` |

`placement` 可选 `top-start`、`top`、`top-end`、`bottom-start`、`bottom`、`bottom-end`。未声明的属性会透传到根元素。

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 打开状态变化 | `(visible)` |
| `open` | 菜单打开 | `()` |
| `close` | 菜单关闭 | `(reason)` |
| `select` | 选择菜单项 | `(item)` |
| `command` | 回传 `item.command`、`item.value` 或 item 本身 | `(command)` |
| `cancel` | `beforeSelect` 返回 false | `(item)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `trigger` | 触发菜单的按钮或链接 |
| `default` | 未提供 `trigger` 时作为触发器内容 |
| `menu` | 自定义菜单内容；可接收 `close` 和 `select` 作用域方法 |

打开菜单后，`ArrowUp`、`ArrowDown`、`Home`、`End` 在可用菜单项间移动，Escape 关闭并恢复触发器焦点。
