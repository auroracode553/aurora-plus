<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import CardBasic from '../.vitepress/theme/examples/card/CardBasic.vue';
import cardBasicSource from '../.vitepress/theme/examples/card/CardBasic.vue?demo-source';
</script>

# Card 卡片

`AuCard` 是一个空卡片容器，只提供背景、边框、圆角、阴影和内边距。

<DemoBlock title="基础卡片" :source="cardBasicSource">
  <CardBasic />
</DemoBlock>

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 卡片内容 |
