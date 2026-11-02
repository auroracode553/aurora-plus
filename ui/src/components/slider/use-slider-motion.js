import { onBeforeUnmount, ref, watch } from 'vue';
import { clamp, createFrameLoop, createSpring, prefersReducedMotion } from '../../utils/glass/motion.js';

// 位置与材质独立；拖动不插值，键盘/外部值更新沿临界阻尼弹簧移动。
export function useSliderMotion(percentage, dragging, disabled) {
  const position = createSpring(percentage.value);
  const press = createSpring(0);
  const displayedPercentage = ref(percentage.value);
  const progress = ref(0);
  const loop = createFrameLoop((seconds) => {
    const moving = position.step(seconds);
    const pressing = press.step(seconds);
    displayedPercentage.value = clamp(position.value, 0, 100);
    progress.value = clamp(press.value);
    return moving || pressing;
  });
  watch([percentage, dragging, disabled], () => {
    position.target = percentage.value;
    press.target = dragging.value && !disabled.value ? 1 : 0;
    if (dragging.value || prefersReducedMotion()) {
      position.snap(position.target);
      displayedPercentage.value = position.value;
    }
    if (prefersReducedMotion()) {
      press.snap(press.target); progress.value = press.value; loop.stop();
    } else loop.start();
  }, { flush: 'sync' });
  onBeforeUnmount(loop.stop);
  return { displayedPercentage, progress };
}
