<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import MenuBarBasic from '../.vitepress/theme/examples/menu-bar/MenuBarBasic.vue';
import menuBarBasicSource from '../.vitepress/theme/examples/menu-bar/MenuBarBasic.vue?demo-source';
</script>

# MenuBar 应用菜单栏

`AuMenuBar` 用于桌面应用窗口顶部的命令菜单。

菜单栏高 30px，与窗口标题栏共用贴边玻璃表面；根菜单高 26px，悬停、键盘焦点和展开状态使用共享按钮玻璃面、细轮廓与中性轻阴影，按压沿用统一材质反馈。菜单面板与栏体间隔 4px，保留快捷键、复选状态及多级菜单。

## 基础用法

<DemoBlock
  title="桌面应用菜单"
  :source="menuBarBasicSource"
>
  <MenuBarBasic />
</DemoBlock>

### 菜单项结构

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| label | 菜单或命令名称 | string |
| command | 业务命令标识 | unknown |
| children | 子菜单项 | Array |
| icon | 菜单项前导图标 | Component |
| accelerator | 仅用于展示的快捷键提示 | string |
| disabled | 是否禁用 | boolean |
| type | checkbox 表示复选命令，separator 表示分隔线 | string |
| checked | 复选命令是否选中 | boolean |

## MenuBar API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 根菜单及 children 命令项 | Array | [] |
| draggable | 将根菜单后的空白区域设为窗口拖拽区 | boolean | false |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| select | 选择可执行叶子菜单项 | (item) |
| open | 打开根菜单 | (item, index) |
| close | 关闭根菜单 | (item, index) |
