<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import MenuBasic from '../.vitepress/theme/examples/menu/MenuBasic.vue';
import menuBasicSource from '../.vitepress/theme/examples/menu/MenuBasic.vue?demo-source';
</script>

# Menu 导航菜单

`AuMenu` 与 `AuMenuItem` 用于侧栏、设置分类和工作区视图等持续可见的导航。临时操作集合应使用 `AuDropdown` 或 `AuContextMenu`。

## 基础用法

使用 `v-model` 管理当前项，菜单项的 `index` 是唯一业务值。图标既可通过 `icon` 属性传入，也可由 `icon` 插槽完全自定义。

<DemoBlock
  title="设置导航"
  description="支持选中、禁用、图标、尾部内容和完整键盘导航。"
  :source="menuBasicSource"
  default-expanded
>
  <MenuBasic />
</DemoBlock>

## 使用建议

- 默认表面透明，菜单所在的侧栏或容器负责背景与边界。
- 纵向菜单使用 `ArrowUp`、`ArrowDown`，横向菜单使用 `ArrowLeft`、`ArrowRight`；`Home`、`End` 定位首尾项，Enter 和 Space 选择当前项。
- 折叠菜单应为每个菜单项提供 `label`，组件会将它保留为无障碍名称与鼠标提示。
- 业务尺寸与颜色优先通过组件 CSS 变量局部覆盖，不需要穿透修改内部 DOM。

## AuMenu API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前菜单项的 `index` | `string / number` | `''` |
| `mode` | 排列方向，可选 `vertical / horizontal` | `string` | `vertical` |
| `collapse` | 纵向菜单是否折叠为仅图标模式 | `boolean` | `false` |
| `disabled` | 是否禁用整个菜单 | `boolean` | `false` |
| `loop` | 方向键到达边界后是否循环 | `boolean` | `true` |
| `ariaLabel` | 菜单的无障碍名称 | `string` | `导航菜单` |

未声明的属性会透传至根 `ul[role="menu"]`。

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 选中项发生变化 | `(index)` |
| `select` | 菜单项被选择；重复选择当前项也会触发 | `(index, event)` |
| `change` | 选中值实际变化 | `(index, previousIndex)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 放置 `AuMenuItem` |

### Exposes

| 属性或方法 | 说明 |
| --- | --- |
| `focus(index?)` | 聚焦指定可用项；未找到时聚焦当前项或首个可用项 |
| `menuRef` | 菜单根元素引用 |

## AuMenuItem API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `index` | 菜单项唯一值 | `string / number` | 必填 |
| `label` | 文本回退值，并为折叠模式提供无障碍名称 | `string` | `''` |
| `icon` | Aurora UI 图标组件 | `Component` | `null` |
| `iconColor` | 图标颜色 | `string` | `''` |
| `disabled` | 是否禁用当前项 | `boolean` | `false` |
| `title` | 原生鼠标提示；折叠时默认回退为 `label` | `string` | `''` |
| `ariaCurrent` | 选中项的 `aria-current` 值 | `string` | `page` |

### Slots

| 插槽名 | 作用域参数 | 说明 |
| --- | --- | --- |
| `default` | — | 菜单项文字 |
| `icon` | `{ active, disabled }` | 自定义图标 |
| `suffix` | `{ active, disabled }` | 徽标、数量或快捷提示等尾部内容 |

## CSS 变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--au-menu-padding` | `4px` | 菜单内边距 |
| `--au-menu-gap` | `2px` | 菜单项间距 |
| `--au-menu-collapse-width` | `48px` | 折叠宽度 |
| `--au-menu-item-min-height` | `36px` | 菜单项最小高度 |
| `--au-menu-item-padding-block` | `7px` | 菜单项纵向内边距 |
| `--au-menu-item-padding-inline` | `12px` | 菜单项横向内边距 |
| `--au-menu-item-gap` | `10px` | 图标与文字间距 |
| `--au-menu-item-radius` | `var(--au-border-radius-base)` | 菜单项圆角 |
| `--au-menu-item-color` | `var(--au-color-text-regular)` | 默认文字颜色 |
| `--au-menu-item-hover-color` | `var(--au-color-text-primary)` | 悬停文字颜色 |
| `--au-menu-item-hover-bg` | 主题状态色 | 悬停背景 |
| `--au-menu-item-active-color` | `var(--au-color-primary)` | 选中文字颜色 |
| `--au-menu-item-active-bg` | 主题状态色 | 选中背景 |
| `--au-menu-item-pressed-bg` | 主题状态色 | 按下背景 |
