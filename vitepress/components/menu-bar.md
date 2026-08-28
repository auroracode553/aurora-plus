<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import MenuBarBasic from '../.vitepress/theme/examples/menu-bar/MenuBarBasic.vue';
import menuBarBasicSource from '../.vitepress/theme/examples/menu-bar/MenuBarBasic.vue?demo-source';
</script>

# MenuBar 应用菜单栏

`AuMenuBar` 用于桌面应用窗口顶部的命令菜单。根菜单保持紧凑文字外观，子菜单支持分隔线、快捷键、复选状态和多级菜单。

## 基础用法

<DemoBlock
  title="桌面应用菜单"
  description="包含快捷键提示、分隔线、禁用命令、复选状态和二级菜单；选择结果显示在菜单下方。"
  :source="menuBarBasicSource"
>
  <MenuBarBasic />
</DemoBlock>

## 使用建议

- `AuMenuBar` 只用于窗口顶部的应用级命令；持久侧栏导航使用 `AuMenu`，内容切换使用 `AuTabs`。
- 菜单项传递命令数据，实际业务行为统一在 `select` 事件中处理。
- `accelerator` 只负责显示快捷键；应用仍需自行注册对应键盘命令。
- Electron 无边框窗口需要拖拽空白区域时再启用 `draggable`。

## MenuBar API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `items` | 根菜单及 `children` 命令项 | `Array` | `[]` |
| `draggable` | 将根菜单后的空白区域设为窗口拖拽区 | `boolean` | `false` |
| `ariaLabel` | 菜单栏无障碍名称 | `string` | `应用菜单` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `select` | 选择可执行叶子菜单项 | `(item)` |
| `open` | 打开根菜单 | `(item, index)` |
| `close` | 关闭根菜单 | `(item, index)` |
