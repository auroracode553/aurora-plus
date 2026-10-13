<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import CardBasic from '../.vitepress/theme/examples/card/CardBasic.vue';
import cardBasicSource from '../.vitepress/theme/examples/card/CardBasic.vue?demo-source';
import CardVariants from '../.vitepress/theme/examples/card/CardVariants.vue';
import cardVariantsSource from '../.vitepress/theme/examples/card/CardVariants.vue?demo-source';
import CardInteractive from '../.vitepress/theme/examples/card/CardInteractive.vue';
import cardInteractiveSource from '../.vitepress/theme/examples/card/CardInteractive.vue?demo-source';
</script>

# Card 卡片

`AuCard` 是内容容器组件，提供材质表面、圆角、可选边框/阴影和内边距。

## 基础用法

<DemoBlock
  title="空卡片容器"
  :source="cardBasicSource"
>
  <CardBasic />
</DemoBlock>

## 类型

<DemoBlock
  title="四种卡片类型"
  :source="cardVariantsSource"
>
  <CardVariants />
</DemoBlock>

## 可交互卡片

使用 `hoverable` 开启轻微悬停抬升。操作型卡片可通过 `tag="button"` 使用按钮元素。

<DemoBlock :source="cardInteractiveSource">
  <CardInteractive />
</DemoBlock>

## Card API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| tag | 根元素或动态组件 | string / Component | div |
| type | 卡片类型，可选 default / flat / elevated / subtle | string | default |
| padding | 内容留白，可选 none / compact / default / comfortable | string | default |
| hoverable | 开启悬停抬升 | boolean | false |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 卡片内容 |
