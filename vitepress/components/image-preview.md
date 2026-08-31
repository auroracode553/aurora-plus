<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import ImagePreviewBasic from '../.vitepress/theme/examples/image-preview/ImagePreviewBasic.vue';
import imagePreviewBasicSource from '../.vitepress/theme/examples/image-preview/ImagePreviewBasic.vue?demo-source';
</script>

# ImagePreview 图片预览

`AuImagePreview` 是从桌面编辑器场景抽离出的通用查看器，支持多图切换、滚轮与双指缩放、放大后拖拽、旋转、键盘控制、焦点恢复和滚动锁定。图片项既可传 URL 字符串，也可传 `{ src, alt, title }` 对象。

## 基础用法

<DemoBlock title="多图预览" description="点击缩略图打开；方向键切图，+ / - 缩放，0 还原，Escape 关闭。" :source="imagePreviewBasicSource" default-expanded>
  <ImagePreviewBasic />
</DemoBlock>

## Attributes

| 属性 | 说明 | 默认值 |
| --- | --- | --- |
| `v-model` | 显示状态；组件直接挂载时默认显示 | `true` |
| `images` / `urlList` | 图片对象或 URL 列表；`images` 优先 | `[]` |
| `initialIndex` / `infinite` | 初始索引 / 循环切换 | `0 / true` |
| `initialScale` | 打开和切图后的缩放 | `1` |
| `zoomRate` / `minScale` / `maxScale` | 缩放倍率与范围 | `1.2 / 0.2 / 5` |
| `rotateStep` | 单次旋转角度 | `90` |
| `fit` | 图片适配方式，同 `object-fit` | `contain` |
| `wheelZoom` | 滚轮缩放 | `true` |
| `hideOnClickModal` | 点击图片之外的舞台关闭 | `false` |
| `closeOnPressEscape` / `lockScroll` | Escape 关闭 / 锁定页面滚动 | `true` |
| `showToolbar` / `showProgress` | 工具条 / 图片序号 | `true` |
| `teleported` / `appendTo` | 是否传送及目标 | `true / body` |
| `topOffset` | 顶部保留空间，桌面自定义标题栏可传 `40` | `0` |
| `zIndex` / `ariaLabel` | 层级 / 无障碍名称 | `10000 / 图片预览` |

## Events、Slots 与 Exposes

事件包括 `open`、`opened`、`close(reason)`、`closed`、`switch(index, image)`、`zoom(scale, source)`、`rotate(degree, direction)`、`load`、`error` 和 `update:modelValue`。

插槽包括 `toolbar`、`progress`、`error` 和 `empty`。组件暴露 `open()`、`close()`、`setActiveItem(index)`、`showPrevious()`、`showNext()`、`zoomIn()`、`zoomOut()`、`setScale()`、`rotateLeft()`、`rotateRight()`、`resetTransform()`、`activeIndex`、`scale` 与 `viewerRef`。
