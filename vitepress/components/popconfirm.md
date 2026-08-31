<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import PopconfirmBasic from '../.vitepress/theme/examples/popconfirm/PopconfirmBasic.vue';
import popconfirmBasicSource from '../.vitepress/theme/examples/popconfirm/PopconfirmBasic.vue?demo-source';
</script>

# Popconfirm 气泡确认框

`AuPopconfirm` 在操作触发点附近进行轻量确认，适合删除、覆盖等需要防误触但不需要完整对话框的动作。

## 基础用法

<DemoBlock title="危险操作确认" description="确认与取消后自动关闭，并把焦点还给触发按钮。" :source="popconfirmBasicSource" default-expanded>
  <PopconfirmBasic />
</DemoBlock>

## API

| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| `v-model` | 显示状态 | `false` |
| `title` | 确认问题 | `确定执行此操作吗？` |
| `confirmButtonText` / `cancelButtonText` | 按钮文字 | `确定 / 取消` |
| `confirmButtonType` / `cancelButtonType` | Aurora Button 类型 | `primary / default` |
| `confirmButtonLoading` | 确认按钮加载中 | `false` |
| `confirmButtonDisabled` / `cancelButtonDisabled` | 按钮禁用 | `false` |
| `icon` / `iconColor` / `hideIcon` | 图标组件、颜色与隐藏 | `IconAlertCircle / '' / false` |
| `width` | 内容宽度 | `220` |
| `placement` / `offset` | 浮层方位与距离 | `top / 8` |
| `trigger` | `click / manual` | `click` |
| `disabled` | 禁止打开 | `false` |
| `closeOnClickOutside` / `closeOnPressEscape` | 外部点击 / Escape 关闭 | `true` |
| `teleported` / `appendTo` / `zIndex` | 浮层挂载与层级 | `true / body / 1300` |

`reference` 插槽放置触发元素，默认插槽替换标题，`icon` 插槽替换图标。事件包括 `confirm`、`cancel`、`open`、`opened`、`close(reason)`、`closed` 和 `update:modelValue`；组件暴露 `open()`、`close()` 与 `popoverRef`。
