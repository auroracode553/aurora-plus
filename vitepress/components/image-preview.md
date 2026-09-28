<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import ImagePreviewBasic from '../.vitepress/theme/examples/image-preview/ImagePreviewBasic.vue';
import imagePreviewBasicSource from '../.vitepress/theme/examples/image-preview/ImagePreviewBasic.vue?demo-source';
</script>

# ImagePreview 图片预览

`AuImagePreview` 支持多图切换、缩放、拖拽与旋转。

## 基础用法

<DemoBlock title="多图预览" :source="imagePreviewBasicSource">
  <ImagePreviewBasic />
</DemoBlock>

## Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 显示状态，支持 v-model | boolean | true |
| images / urlList | 图片对象或 URL 列表；images 优先 | array | [] |
| initialIndex | 初始图片索引 | number | 0 |
| infinite | 循环切换 | boolean | true |
| initialScale | 初始缩放 | number | 1 |
| zoomRate | 单次缩放倍率 | number | 1.2 |
| minScale / maxScale | 缩放范围 | number | 0.2 / 5 |
| rotateStep | 单次旋转角度 | number | 90 |
| fit | 图片适配方式，同 object-fit | string | contain |
| wheelZoom | 滚轮缩放 | boolean | true |
| hideOnClickModal | 点击舞台空白处关闭 | boolean | false |
| closeOnPressEscape | 按 Escape 关闭 | boolean | true |
| lockScroll | 显示时锁定页面滚动 | boolean | true |
| showToolbar / showProgress | 显示工具条 / 图片序号 | boolean | true |
| teleported / appendTo | 浮层挂载方式和目标 | boolean / string / Element | true / body |
| topOffset | 顶部保留空间 | string / number | 0 |
| zIndex | 层级 | number | 10000 |
| closeLabel | 关闭按钮提示 | string | 关闭预览 |
| previousLabel / nextLabel | 切图按钮提示 | string | 上一张图片 / 下一张图片 |

## Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| update:modelValue | (visible) | 显示状态更新 |
| open / opened | — | 开始显示 / 显示完成 |
| close | (reason) | 请求关闭 |
| closed | — | 关闭完成 |
| switch | (index, image) | 切换图片 |
| zoom | (scale, source) | 缩放图片 |
| rotate | (rotation, direction) | 旋转图片 |
| load / error | (event, image, index) | 图片加载成功 / 失败 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| empty | 无图片内容 |
| error | 图片加载失败内容；提供 { image, index } |
| progress | 图片序号；提供 { current, total, image } |
| toolbar | 操作工具条及缩放、旋转方法 |

## Exposes

| 名称 | 说明 |
| --- | --- |
| open() / close(reason?) | 打开 / 关闭 |
| showPrevious() / showNext() / setActiveItem(index) | 切换图片 |
| zoomIn() / zoomOut() / setScale(value) | 调整缩放 |
| rotateLeft() / rotateRight() / resetTransform() | 旋转 / 重置变换 |
| activeIndex / scale / viewerRef | 当前图片索引 / 缩放比例 / 容器引用 |
