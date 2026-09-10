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

在内容就绪前展示与真实布局接近的占位块，适合文章、成员列表和图片卡片的首次加载。`AuSkeleton` 管理加载状态，`AuSkeletonItem` 负责占位形状，也可独立使用。

## 基础用法与占位形状

默认显示一行宽度为 33% 的标题占位，以及三行段落占位，最后一行宽度为 61%。`rows` 只计算段落行数；设为 `0` 时保留标题行。`animated` 默认关闭，开启后使用轻微呼吸动画。

<DemoBlock title="行数、动画与形状" :source="basicSource" default-expanded>
  <SkeletonBasic />
</DemoBlock>

## 自定义模板与内容切换

`template` 插槽定义加载占位，`default` 插槽定义就绪内容。`count` 只重复占位模板，默认插槽只渲染一次；模板参数 `index` 从 `0` 开始。默认模板之间间隔 16px。

<DemoBlock title="成员列表占位" :source="templateSource">
  <SkeletonTemplate />
</DemoBlock>

图片卡片可在 `template` 中组合 `image`、`h3` 和 `text`，并通过 `width`、`height` 或普通 `style` 对齐真实内容尺寸。自定义模板覆盖默认段落，此时 `rows` 不生效。建议按可见内容设置较小的 `count`。

## 延迟显示与隐藏

`throttle` 为数字时表示延迟显示的毫秒数；对象形式的 `leading` 控制延迟显示，`trailing` 控制加载结束后的延迟隐藏。二者默认均为 `0`。`trailing` 不是最短展示时长。

<DemoBlock title="避免短请求闪烁" :source="throttleSource">
  <SkeletonThrottle />
</DemoBlock>

等待延迟显示期间，容器保留但占位块和业务内容均不挂载；可给容器设置与内容匹配的 `min-height`，避免布局跳动。若请求在延迟结束前完成，直接显示业务内容。已显示的占位在延迟隐藏期间继续保留；重新加载会取消待执行的隐藏。卸载时自动清理计时器。

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
| `loading` | 是否正在加载 | `boolean` | `true` |
| `animated` | 子占位块是否启用呼吸动画 | `boolean` | `false` |
| `rows` | 默认模板的段落行数，不含标题；非负整数 | `number` | `3` |
| `count` | 占位模板重复数量；正整数 | `number` | `1` |
| `throttle` | 延迟显示，或分别控制显隐，单位 ms | `number / { leading?: number, trailing?: number }` | `0` |

延迟值应为非负有限数字；负数和非有限值按 `0` 处理。

## AuSkeleton 插槽

| 插槽 | 说明 | 参数 |
| --- | --- | --- |
| `template` | 加载期间重复渲染的占位模板 | `{ index: number }`，从 0 开始 |
| `default` | 加载结束且隐藏延迟完成后的业务内容 | — |

## AuSkeletonItem 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `variant` | 占位形状 | `text / p / h1 / h2 / h3 / caption / button / circle / rect / image` | `text` |
| `width` | 宽度；数字为 px，字符串为 CSS 长度 | `number / string` | 由形状决定 |
| `height` | 高度；数字为 px，字符串为 CSS 长度 | `number / string` | 由形状决定 |
| `animated` | 覆盖容器的动画设置 | `boolean` | 跟随最近的 AuSkeleton，独立使用时为 false |

默认高度：`text` 14px、`p` 16px、`h1` 28px、`h2` 24px、`h3` 20px、`caption` 12px、`button` 32px、`circle` 32px、`rect` 80px、`image` 120px。默认宽度为 100%，其中 `button` 为 80px、`circle` 为 32px；圆形自定义尺寸时应同步设置相等的宽高。

## 主题

容器背景透明，占位颜色跟随全局语义主题。
