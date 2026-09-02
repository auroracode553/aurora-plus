<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import MenuListBasic from '../.vitepress/theme/examples/menu-list/MenuListBasic.vue';
import menuListBasicSource from '../.vitepress/theme/examples/menu-list/MenuListBasic.vue?demo-source';
</script>

# MenuList 菜单列表

`AuMenuList` 与 `AuMenuListItem` 用于苹果式分组菜单、设置入口和带尾部控件的配置行。它与导航选中的 `AuMenu`、大数据滚动的 `AuVirtualList` 职责不同。

默认面板使用 Aurora Plus 的材质、圆角与表面阴影，自动适配明暗主题、减少透明度和高对比度偏好。

## 基础用法

<DemoBlock
  title="分组菜单与设置行"
  description="同一组件既可承载分组菜单，也可只声明一个 MenuListItem 作为独立操作入口。"
  :source="menuListBasicSource"
  default-expanded
>
  <MenuListBasic />
</DemoBlock>

## 使用建议

- 带 `clickable` 或 `href` 的菜单项会获得即时按压反馈和完整键盘焦点。
- 页面跳转或进入下一级时使用 `accessory="chevron"`，普通设置行不显示箭头。
- 需要强化入口识别时使用 `leadingVariant="tinted"`；危险操作配合 `tone="danger"`，不要仅靠图标颜色表达风险。
- 快捷键使用 `shortcut`，组件会以适合尾部信息的 `kbd` 样式展示。
- `trailing` 可放置 `AuSwitch`、状态文字或业务按钮；包含交互控件时不要同时设置 `clickable`，避免嵌套交互元素。
- 标题保持短而明确，补充信息放在 `description`，不要把整段说明塞入标题。
- 面板阴影由组件内置处理，业务页面不需要重复设置背景、圆角、分隔线或 box-shadow。

## AuMenuList API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `density` | 行密度，可选 `compact / default / relaxed` | `string` | `default` |
| `divided` | 是否显示内缩分隔线 | `boolean` | `true` |
| `elevated` | 是否显示表面阴影 | `boolean` | `true` |
| `ariaLabel` | 列表无障碍名称 | `string` | `''` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 放置 `AuMenuListItem` |

## AuMenuListItem API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 主标题 | `string` | `''` |
| `description` | 次级说明 | `string` | `''` |
| `leadingIcon` | 前导图标组件 | `Component` | `null` |
| `leadingVariant` | 图标样式，可选 `plain / tinted` | `string` | `plain` |
| `tone` | 语义色，可选 `default / primary / success / warning / danger` | `string` | `default` |
| `accessory` | 尾部标识，可选 `none / chevron` | `string` | `none` |
| `clickable` | 是否渲染为可操作按钮 | `boolean` | `false` |
| `href` | 设置后渲染为链接 | `string` | `''` |
| `target` | 链接打开目标 | `string` | `''` |
| `rel` | 链接 rel | `string` | `''` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `selected` | 是否显示选中状态 | `boolean` | `false` |
| `ariaCurrent` | 选中项的 `aria-current` 值 | `string` | `page` |
| `shortcut` | 尾部快捷键文本 | `string` | `''` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 可用菜单项被点击 | `(event)` |

### Slots

| 插槽名 | 作用域参数 | 说明 |
| --- | --- | --- |
| `default` | — | 自定义标题内容 |
| `title` | — | 自定义主标题 |
| `description` | — | 自定义次级说明 |
| `leading` | `{ disabled, selected, tone }` | 自定义前导内容 |
| `trailing` | `{ disabled, selected, tone }` | 尾部控件或状态 |
