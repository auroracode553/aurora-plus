<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import PopconfirmBasic from '../.vitepress/theme/examples/popconfirm/PopconfirmBasic.vue';
import popconfirmBasicSource from '../.vitepress/theme/examples/popconfirm/PopconfirmBasic.vue?demo-source';
</script>

# Popconfirm 气泡确认框

`AuPopconfirm` 在操作触发点附近进行轻量确认，适合删除、覆盖等需要防误触但不需要完整对话框的动作。

## 基础用法

<DemoBlock title="危险操作确认" :source="popconfirmBasicSource">
  <PopconfirmBasic />
</DemoBlock>

## API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 显示状态，支持 v-model | boolean | false |
| title | 确认问题 | string | 确定执行此操作吗？ |
| confirmButtonText / cancelButtonText | 按钮文字 | string | 确定 / 取消 |
| confirmButtonType / cancelButtonType | 按钮类型 | string | primary / default |
| confirmButtonLoading | 确认按钮加载中 | boolean | false |
| confirmButtonDisabled / cancelButtonDisabled | 禁用按钮 | boolean | false |
| icon / iconColor / hideIcon | 图标、颜色与显隐 | Component / string / boolean | IconAlertCircle / '' / false |
| width | 内容宽度 | string / number | 220 |
| placement / offset | 浮层方位与距离 | string / number | top / 8 |
| trigger | 触发方式：click / manual | string | click |
| disabled | 禁止打开 | boolean | false |
| closeOnClickOutside / closeOnPressEscape | 外部点击 / Escape 关闭 | boolean | true |
| teleported / appendTo / zIndex | 浮层挂载与层级 | boolean / string / Element / number | true / body / 1300 |

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| update:modelValue | (visible) | 显示状态更新 |
| confirm | (event) | 确认操作 |
| cancel | (event / reason) | 取消操作 |
| open / opened | — | 开始显示 / 显示完成 |
| close / closed | (reason) / — | 开始关闭 / 关闭完成 |

### Slots

| 插槽 | 说明 |
| --- | --- |
| reference | 触发器 |
| default | 提示内容 |
| icon | 自定义图标 |

### Exposes

| 名称 | 说明 |
| --- | --- |
| open() / close() | 打开 / 关闭 |
| popoverRef | 内部浮层组件引用 |
