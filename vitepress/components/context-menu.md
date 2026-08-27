<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import ContextMenuBasic from '../.vitepress/theme/examples/context-menu/ContextMenuBasic.vue';
import contextMenuBasicSource from '../.vitepress/theme/examples/context-menu/ContextMenuBasic.vue?demo-source';
</script>

# ContextMenu 右键菜单

`AuContextMenu` 只负责菜单展示与交互，业务确认通过 `beforeSelect` 注入。

## 基础用法

下面的演示包含图标行、按钮组、二级菜单、禁用项、分隔线和危险操作。

<DemoBlock
  title="配置式菜单"
  description="在演示区点击右键；删除动作会先进入 beforeSelect 注入的确认流程。"
  :source="contextMenuBasicSource"
  default-expanded
>
  <ContextMenuBasic />
</DemoBlock>

## 数据结构

`items` 接收 `AuContextMenuSection[]`。Section 决定布局，Section 内的 item 决定具体动作。

### Section 类型

| `type` | 使用字段 | 说明 |
| --- | --- | --- |
| `button` / `item` | `item`，也兼容直接写在 section 上 | 单个菜单项 |
| `button-group` / `group` | `items` | 纵向普通菜单项组 |
| `icon-row` | `items`、`ariaLabel` | 单行图标按钮 |
| `icon-grid` | `items`、`ariaLabel` | 图标网格 |
| `submenu` | `id`、`label`、`items` | 二级菜单；内部 item 可用 `kind: 'separator'` |
| `separator` | — | 分隔线 |

### MenuItem 字段

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `id` | 业务动作标识，建议必填且唯一 | `string / number` |
| `label` | 展示文本及图标按钮提示 | `string` |
| `title` | 原生 title，主要用于普通菜单项 | `string` |
| `icon` | 图标组件 | `Component` |
| `shortcut` | 右侧快捷键提示，仅展示、不监听键盘 | `string` |
| `danger` | 是否使用危险色 | `boolean` |
| `disabled` | 是否禁用 | `boolean` |
| `kind / type` | 子菜单分隔项可设为 `separator` | `string` |
| 其他字段 | 原样保留并随事件返回，例如 `confirmMessage` | `unknown` |

## ContextMenu API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue / v-model` | 是否显示菜单 | `boolean` | `true` |
| `items` | 菜单 Section 数据 | `AuContextMenuSection[]` | `[]` |
| `position` | 视口坐标 | `{ x: number, y: number }` | `{ x: 0, y: 0 }` |
| `iconColor` | 图标行统一颜色 | `string` | `''` |
| `ariaLabel` | 菜单无障碍名称 | `string` | `上下文菜单` |
| `beforeSelect` | 选择前守卫；返回 `false` 取消动作 | `(item) => boolean \| Promise<boolean>` | — |
| `hideOnSelect` | 成功选择后是否关闭 | `boolean` | `true` |
| `closeOnClickOutside` | 点击外部是否关闭 | `boolean` | `true` |
| `teleported` | 是否传送到 `appendTo` | `boolean` | `true` |
| `appendTo` | Teleport 目标 | `string / HTMLElement` | `body` |
| `zIndex` | 菜单层级 | `number` | `2200` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 内部关闭时更新绑定值 | `(visible: boolean)` |
| `select` | 守卫通过后触发 | `(item: AuContextMenuItem)` |
| `action` | `select` 的兼容事件，参数相同 | `(item: AuContextMenuItem)` |
| `cancel` | `beforeSelect` 返回 `false` 时触发 | `(item: AuContextMenuItem)` |
| `close` | 菜单关闭时触发 | `(reason: string)` |

关闭原因包括 `api`、`select`、`outside` 和 `escape`。

### Exposes

| 属性或方法 | 说明 |
| --- | --- |
| `close(reason?)` | 主动关闭菜单 |
| `updatePosition()` | 根据最新坐标和菜单尺寸执行视口避让 |
| `menuRef` | 菜单根元素引用 |

## 交互说明

菜单打开后会获得焦点。`ArrowUp`、`ArrowDown`、`Home`、`End` 可在可用按钮间移动，Escape 关闭菜单。组件只展示 `shortcut`，快捷键监听仍应由业务层实现。
