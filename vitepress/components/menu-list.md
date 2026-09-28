<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import MenuListBasic from '../.vitepress/theme/examples/menu-list/MenuListBasic.vue';
import menuListBasicSource from '../.vitepress/theme/examples/menu-list/MenuListBasic.vue?demo-source';
</script>

# MenuList 菜单列表

`AuMenuList` 与 `AuMenuListItem` 用于苹果式分组菜单、设置入口和带尾部控件的配置行。

## 基础用法

<DemoBlock
  title="分组菜单与设置行"
  :source="menuListBasicSource"
>
  <MenuListBasic />
</DemoBlock>

## AuMenuList API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| density | 行密度，可选 compact / default / relaxed | string | default |
| divided | 是否显示内缩分隔线 | boolean | true |
| elevated | 是否显示表面阴影 | boolean | true |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 放置 AuMenuListItem |

## AuMenuListItem API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 主标题 | string | '' |
| description | 次级说明 | string | '' |
| leadingIcon | 前导图标组件 | Component | null |
| leadingVariant | 图标样式，可选 plain / tinted | string | plain |
| tone | 语义色，可选 default / primary / success / warning / danger | string | default |
| accessory | 尾部标识，可选 none / chevron | string | none |
| clickable | 是否渲染为可操作按钮 | boolean | false |
| href | 设置后渲染为链接 | string | '' |
| target | 链接打开目标 | string | '' |
| rel | 链接 rel | string | '' |
| disabled | 是否禁用 | boolean | false |
| selected | 是否显示选中状态 | boolean | false |
| shortcut | 尾部快捷键文本 | string | '' |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| click | 可用菜单项被点击 | (event) |

### Slots

| 插槽名 | 作用域参数 | 说明 |
| --- | --- | --- |
| default | — | 自定义标题内容 |
| title | — | 自定义主标题 |
| description | — | 自定义次级说明 |
| leading | { disabled, selected, tone } | 自定义前导内容 |
| trailing | { disabled, selected, tone } | 尾部控件或状态 |
