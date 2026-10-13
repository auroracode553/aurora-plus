<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import TransitionBasic from '../.vitepress/theme/examples/transition/TransitionBasic.vue';
import exampleSource from '../.vitepress/theme/examples/transition/TransitionBasic.vue?demo-source';
</script>

# Transition 动画

`AuTransition / AuTransitionGroup` 为内容显隐与列表增删提供轻量、可中断的进入和退出动画。列表支持依次进入。

## 基础用法

<DemoBlock :source="exampleSource">
  <TransitionBasic />
</DemoBlock>

`AuTransition` 的默认插槽需要一个可动画的元素，配合 `v-if` 或 `v-show` 使用。`AuTransitionGroup` 的每个直接子项必须具有稳定且唯一的 `key`，支持增删与排序时的位置过渡。进入和退出预设使用独立的位移、缩放属性，保留内容自身的 transform 定位。列表位置过渡会使用外层 transform；需要保留自定位变换时，将该元素放在具有稳定 key 的容器内。

## Transition / TransitionGroup API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| preset | 动画：fade / slide-up / slide-down / scale | string | slide-up |
| duration | 动画时长，毫秒；未传入时按全局动效时长区分进入与退出节奏 | number | undefined |
| animated | 启用动画；关闭后直接完成显隐 | boolean | true |
| appear | 首次挂载时播放进入动画 | boolean | false |
| mode | 仅 AuTransition：out-in / in-out，未传入时同时过渡 | string | undefined |
| tag | 仅 AuTransitionGroup：容器标签 | string | div |
| stagger | 仅 AuTransitionGroup：相邻子项进入间隔，毫秒；最多按前 18 项递增 | number | 30 |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| after-enter | 进入完成 | (element) |
| after-leave | 退出完成 | (element) |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 需要过渡的元素 |
