<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import MotionFeedback from '../.vitepress/theme/examples/transition/MotionFeedback.vue';
import motionFeedbackSource from '../.vitepress/theme/examples/transition/MotionFeedback.vue?demo-source';
</script>

# Motion 通用动效

Aurora Plus 按交互阶段提供统一反馈：按压快速响应，释放平滑恢复，进入略长于退出。动效保持原有组件尺寸，使用轻微缩放、位移、透明度和状态色变化。

## 交互反馈

按钮、链接、菜单项和窗口操作使用按压反馈；输入与选择器平滑切换悬停、编辑及选中状态。弹层共用进入和退出节奏，关闭中的浮层停止接收指针操作。

<DemoBlock :source="motionFeedbackSource">
  <MotionFeedback />
</DemoBlock>

滑块拖动即时跟随指针，外部数值更新使用平滑过渡。表格与树的行通过悬停及选中色变化表达状态，虚拟滚动偏移保持即时更新。内容容器默认使用状态过渡，可交互卡片通过 `hoverable` 启用抬升。

## 通用 CSS 类

以下类可直接用于自定义元素，元素的尺寸、外观及事件由调用方定义。

| 类名 | 用途 |
| --- | --- |
| au-motion-state | 文字、背景、边框、阴影与透明度的状态过渡 |
| au-motion-control | 按压缩小与释放恢复；识别原生 disabled 及 is-disabled / is-loading / is-readonly 状态 |
| au-motion-row | 列表行的文字、背景、边框与透明度过渡 |
| au-motion-lift | 悬停轻微抬升、按压恢复原位置 |
| au-motion-reveal | 元素挂载时一次淡入 |
| au-motion-pulse | 操作进行中的轻微呼吸反馈 |
| au-spin | 持续旋转，适用于加载图标 |

`au-motion-control` 和 `au-motion-lift` 使用独立缩放或位移属性，保留元素自身的 `transform` 定位。已有透明度动画的元素不宜再叠加 `au-motion-reveal` 或 `au-motion-pulse`，可以给外层元素应用需要的反馈。

## 内容进入与退出

使用 [Transition](/components/transition) 为条件内容提供淡入、位移或缩放过渡。列表的直接子项提供稳定的 `key` 后，`AuTransitionGroup` 支持增删、依次进入和顺序调整。

## 时长与曲线

动效复用全局 `--au-transition-duration` 和 `--au-transition-timing`。默认基础时长为 200ms，状态过渡 200ms、按压 110ms、释放 320ms、进入 300ms、退出 160ms；修改基础时长后各阶段按比例调整。

```css
:root {
  --au-transition-duration: 0.2s;
  --au-transition-timing: cubic-bezier(0.2, 0.8, 0.2, 1);
}
```

独立数字和进度组件可通过 `animated` 关闭对应动画；`AuTransition` 和 `AuTransitionGroup` 也支持 `animated` 与 `duration`。
