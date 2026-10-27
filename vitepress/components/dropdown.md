<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import DropdownBasic from '../.vitepress/theme/examples/dropdown/DropdownBasic.vue';
import dropdownBasicSource from '../.vitepress/theme/examples/dropdown/DropdownBasic.vue?demo-source';
</script>

# Dropdown 下拉菜单

用于将一组低频或次级操作收纳到触发器附近。

## 基础用法

<DemoBlock
  title="项目操作"
  :source="dropdownBasicSource"
>
  <DropdownBasic />
</DemoBlock>

### 菜单项结构

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| id | 菜单项唯一标识 | string / number |
| label | 显示文字；也可使用 text | string |
| value | 业务值，同时作为未设置 command 时的回传值 | unknown |
| icon | 图标组件 | Component |
| shortcut | 仅展示的快捷键提示 | string |
| disabled | 是否禁用 | boolean |
| danger | 是否使用危险色 | boolean |
| command | command 事件的回传值 | unknown |
| type / divider | type="divider" 或 divider=true 渲染分隔线 | — |

## Dropdown API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 菜单是否打开 | boolean | false |
| items | 菜单项数组 | array | [] |
| placement | 菜单相对触发器的位置 | string | bottom-start |
| offset | 菜单与触发器的间距 | number | 6 |
| matchTriggerWidth | 是否使用触发器宽度作为最小宽度 | boolean | false |
| maxHeight | 菜单最大高度（px）；设为 0 时取消固定上限，按内容展开，超出视口时才滚动 | number | 320 |
| disabled | 是否禁用打开 | boolean | false |
| closeOnSelect | 选择后是否关闭 | boolean | true |
| closeOnClickOutside | 点击外部是否关闭 | boolean | true |
| beforeSelect | 选择前的同步或异步判断；返回 false 会取消 | function | null |
| itemKey | 自定义菜单项 key 解析函数 | function | null |
| teleported | 是否 Teleport 到 appendTo | boolean | true |
| appendTo | Teleport 目标 | string / element | body |
| zIndex | 基础层级；嵌套时实际层级至少比父浮层高 1 | number | 1200 |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 打开状态变化 | (visible) |
| open | 菜单打开 | () |
| close | 菜单关闭 | (reason) |
| select | 选择菜单项 | (item) |
| command | 回传 item.command、item.value 或 item 本身 | (command) |
| cancel | beforeSelect 返回 false | (item) |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| trigger | 触发菜单的按钮或链接 |
| default | 未提供 trigger 时作为触发器内容 |
| menu | 自定义菜单内容；可接收 close 和 select 作用域方法 |
