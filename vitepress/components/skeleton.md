<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import SkeletonBasic from '../.vitepress/theme/examples/skeleton/SkeletonBasic.vue';
import SkeletonTemplate from '../.vitepress/theme/examples/skeleton/SkeletonTemplate.vue';
import SkeletonThrottle from '../.vitepress/theme/examples/skeleton/SkeletonThrottle.vue';
import basicSource from '../.vitepress/theme/examples/skeleton/SkeletonBasic.vue?demo-source';
import templateSource from '../.vitepress/theme/examples/skeleton/SkeletonTemplate.vue?demo-source';
import throttleSource from '../.vitepress/theme/examples/skeleton/SkeletonThrottle.vue?demo-source';
</script>

# Skeleton 骨架屏

在内容就绪前展示与真实布局接近的占位块，适合文章、成员列表和图片卡片的首次加载。

## 基础用法与占位形状

<DemoBlock title="行数、动画与形状" :source="basicSource">
  <SkeletonBasic />
</DemoBlock>

## 自定义模板与内容切换

<DemoBlock title="成员列表占位" :source="templateSource">
  <SkeletonTemplate />
</DemoBlock>

## 延迟显示与隐藏

<DemoBlock title="避免短请求闪烁" :source="throttleSource">
  <SkeletonThrottle />
</DemoBlock>

## 按需引入

```vue
<script setup>
import { ref } from 'vue';
import { AuSkeleton, AuSkeletonItem } from 'aurora-plus';
import 'aurora-plus/style.css';

const loading = ref(true);
</script>

<template>
  <AuSkeleton :loading="loading" animated>
    <template #template>
      <AuSkeletonItem variant="image" :height="120" />
    </template>
    <template #default>内容已加载</template>
  </AuSkeleton>
</template>
```

## AuSkeleton 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否正在加载 | boolean | true |
| animated | 子占位块是否启用呼吸动画 | boolean | false |
| rows | 默认模板的段落行数，不含标题；非负整数 | number | 3 |
| count | 占位模板重复数量；正整数 | number | 1 |
| throttle | 延迟显示，或分别控制显隐，单位 ms | number / { leading?: number, trailing?: number } | 0 |

## AuSkeleton 插槽

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| template | 加载期间重复渲染的占位模板 | { index: number }，从 0 开始 |
| default | 加载结束且隐藏延迟完成后的业务内容 | — |

## AuSkeletonItem 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| variant | 占位形状 | text / p / h1 / h2 / h3 / caption / button / circle / rect / image | text |
| width | 宽度；数字为 px，字符串为 CSS 长度 | number / string | 由形状决定 |
| height | 高度；数字为 px，字符串为 CSS 长度 | number / string | 由形状决定 |
| animated | 覆盖容器的动画设置 | boolean | 跟随最近的 AuSkeleton，独立使用时为 false |
