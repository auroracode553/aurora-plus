<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import SelectBasic from '../.vitepress/theme/examples/select/SelectBasic.vue';
import selectBasicSource from '../.vitepress/theme/examples/select/SelectBasic.vue?demo-source';
</script>

# Select 选择器

`AuSelect` 使用 Aurora Plus 的紧凑列表弹层呈现选项，并统一尺寸、焦点、禁用态和错误态。

`small`、`default`、`large` 触发框高度分别为 28、32、40px。视口宽度不超过 640px，或设备主要使用无悬停能力的触屏时，分别为 36、44、48px，选项最小行高同步适配，文字为 16px。

## 基础用法

<DemoBlock
  title="选项与尺寸"
  :source="selectBasicSource"
>
  <SelectBasic />
</DemoBlock>

## Select API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前选中值 | string / number / boolean | '' |
| size | 尺寸 | small / default / large | default |
| disabled | 是否禁用 | boolean | false |
| invalid | 是否显示错误态 | boolean | false |
| fitContent | 是否根据全部可见选项中的最长内容自适应宽度 | boolean | false |
| maxWidth | 自适应模式的最大宽度，数字会转换为 px | string / number | 320 |
| teleported | 是否将选项弹层传送到目标容器 | boolean | true |
| appendTo | 选项弹层挂载目标 | string / HTMLElement | 'body' |
| zIndex | 选项弹层层级 | number | 1200 |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化 | (value) |
| change | 选中值变化 | (value, sourceEvent) |
| focus | 获得焦点 | (event) |
| blur | 失去焦点 | (event) |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | option 或 optgroup 选项声明 |

### Exposes

| 方法或属性 | 说明 |
| --- | --- |
| focus(options?) | 聚焦选择框 |
| blur() | 移除焦点 |
| open() | 打开选项弹层 |
| close() | 关闭选项弹层 |
| toggle() | 切换选项弹层 |
| selectRef | 选择触发按钮引用 |
| listboxRef | 选项列表引用 |
