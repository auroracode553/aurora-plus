<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import MenuBasic from '../.vitepress/theme/examples/menu/MenuBasic.vue';
import menuBasicSource from '../.vitepress/theme/examples/menu/MenuBasic.vue?demo-source';
import MenuRail from '../.vitepress/theme/examples/menu/MenuRail.vue';
import menuRailSource from '../.vitepress/theme/examples/menu/MenuRail.vue?demo-source';
</script>

# Menu 导航菜单

`AuMenu`、`AuMenuGroup` 与 `AuMenuItem` 用于侧栏、设置分类和工作区视图等持续可见的导航。

## 基础用法

<DemoBlock
  title="侧栏导航"
  :source="menuBasicSource"
>
  <MenuBasic />
</DemoBlock>

## 图标侧边栏

<DemoBlock
  title="图标侧边栏"
  :source="menuRailSource"
>
  <MenuRail />
</DemoBlock>

## AuMenu API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前菜单项的 `index` | `string / number` | `''` |
| `mode` | 排列方向，可选 `vertical / horizontal / rail` | `string` | `vertical` |
| `collapse` | 纵向菜单是否折叠为仅图标模式 | `boolean` | `false` |
| `disabled` | 是否禁用整个菜单 | `boolean` | `false` |
| `loop` | 方向键到达边界后是否循环 | `boolean` | `true` |

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
