<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import SegmentedBasic from '../.vitepress/theme/examples/segmented/SegmentedBasic.vue';
import exampleSource from '../.vitepress/theme/examples/segmented/SegmentedBasic.vue?demo-source';
</script>

# Segmented 分段选择

`AuSegmented` 使用连续滑动的材质选中层切换互斥选项。支持左右方向键、Home 和 End，禁用选项不会被选中。

## 基础用法

<DemoBlock :source="exampleSource">
  <SegmentedBasic />
</DemoBlock>

`items` 可以是字符串或数字数组，也可以是包含 `label`、`value`、`icon`、`disabled` 的对象数组。各项的值须唯一；无匹配值时不显示选中层。

## Segmented API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前值，支持 v-model | string \| number | undefined |
| items | 选项数组 | Array | [] |
| valueKey | 对象选项的值字段 | string | value |
| size | 尺寸：small / default / large；选项高度 24 / 28 / 36px | string | default |
| disabled | 禁用整个选择器 | boolean | false |
| fill | 等宽填满容器 | boolean | false |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 当前值更新 | (value) |
| change | 当前值发生变化 | (value, previousValue, item) |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| item | 自定义选项内容，参数 `{ item, selected }` |
