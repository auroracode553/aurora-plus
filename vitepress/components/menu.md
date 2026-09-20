<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import MenuBasic from '../.vitepress/theme/examples/menu/MenuBasic.vue';
import menuBasicSource from '../.vitepress/theme/examples/menu/MenuBasic.vue?demo-source';
import MenuRail from '../.vitepress/theme/examples/menu/MenuRail.vue';
import menuRailSource from '../.vitepress/theme/examples/menu/MenuRail.vue?demo-source';
</script>

# Menu 导航菜单

`AuMenu`、`AuMenuGroup` 与 `AuMenuItem` 用于侧栏、设置分类和工作区视图等持续可见的导航。临时操作集合应使用 `AuDropdown` 或 `AuContextMenu`。

## 基础用法

使用 `v-model` 管理当前项，菜单项的 `index` 是唯一业务值。图标既可通过 `icon` 属性传入，也可由 `icon` 插槽完全自定义。

<DemoBlock
  title="侧栏导航"
  description="支持分组、选中、图标、徽标、状态点和完整键盘导航。"
  :source="menuBasicSource"
  default-expanded
>
  <MenuBasic />
</DemoBlock>

## 图标侧边栏

`mode="rail"` 将菜单渲染为窄图标侧边栏：图标在上、文字在下，适合高频导航放置于应用边缘。徽标会退化为图标右上角的计数点；`#bottom` 插槽可固定通知、账户等底部入口，菜单容器需要设置高度才能让底部区域贴底。

<DemoBlock
  title="图标侧边栏"
  description="窄栏纵向排布，底部插槽固定通知与账户入口。"
  :source="menuRailSource"
  default-expanded
>
  <MenuRail />
</DemoBlock>

## 使用建议

- 菜单适合放在持续可见的侧栏或设置区域中，当前项会显示浅色选中面和左侧激活条。
- 分组标题使用 `AuMenuGroup`，需要更大的段落间距时设置 `spaced`。
- 纵向菜单使用 `ArrowUp`、`ArrowDown`，横向菜单使用 `ArrowLeft`、`ArrowRight`；`Home`、`End` 定位首尾项，Enter 和 Space 选择当前项。
- `mode="rail"` 适合应用边缘的高频导航：保持 56px 窄栏，分组标题不展示，`spaced` 分组退化为段落间距；为菜单容器设置高度后，`#bottom` 插槽会贴底固定。
- 折叠菜单应为每个菜单项提供 `label`，组件会将它保留为鼠标提示；rail 模式同样支持 `collapse` 折叠为纯图标。

## AuMenu API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前菜单项的 `index` | `string / number` | `''` |
| `mode` | 排列方向，可选 `vertical / horizontal / rail` | `string` | `vertical` |
| `collapse` | 纵向菜单是否折叠为仅图标模式 | `boolean` | `false` |
| `disabled` | 是否禁用整个菜单 | `boolean` | `false` |
| `loop` | 方向键到达边界后是否循环 | `boolean` | `true` |

未声明的属性会透传至根 `ul`。

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
| `bottom` | 仅 `rail` 模式下渲染；底部固定内容，不参与键盘导航与选中 |

### Exposes

| 属性或方法 | 说明 |
| --- | --- |
| `focus(index?)` | 聚焦指定可用项；未找到时聚焦当前项或首个可用项 |
| `menuRef` | 菜单根元素引用 |

## AuMenuGroup API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `label` | 分组标题 | `string` | `''` |
| `spaced` | 是否增加与上一组的间距 | `boolean` | `false` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义分组标题 |

## AuMenuItem API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `index` | 菜单项唯一值 | `string / number` | 必填 |
| `label` | 文本回退值，并为折叠模式提供鼠标提示 | `string` | `''` |
| `icon` | Aurora Plus 图标组件 | `Component` | `null` |
| `iconColor` | 图标颜色 | `string` | `''` |
| `badge` | 尾部徽标文本；`rail` 模式下退化为右上角计数点 | `string / number` | `''` |
| `indicator` | 是否显示尾部状态点 | `boolean` | `false` |
| `disabled` | 是否禁用当前项 | `boolean` | `false` |
| `title` | 原生鼠标提示；折叠时默认回退为 `label` | `string` | `''` |

### Slots

| 插槽名 | 作用域参数 | 说明 |
| --- | --- | --- |
| `default` | — | 菜单项文字 |
| `icon` | `{ active, disabled }` | 自定义图标 |
| `suffix` | `{ active, disabled }` | 徽标、数量或快捷提示等尾部内容 |
