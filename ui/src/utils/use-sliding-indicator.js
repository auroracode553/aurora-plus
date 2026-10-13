import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { getLayoutBox } from './layout-box.js';

// Tabs 与 Segmented 共用测量逻辑；组件只提供目标元素和几何变换。
export function useSlidingIndicator(root, { target, dependencies, geometry = (value) => value }) {
  const style = ref({ opacity: 0 });
  const animated = ref(false);
  let observer;
  let frame;
  let disposed = false;

  function sync(instant = false) {
    const container = root.value;
    const selected = target();
    if (!container || !selected) {
      style.value = { opacity: 0 };
      return;
    }
    // 使用布局坐标，避免把按压缩放和祖先变换后的尺寸固化到选中层。
    const box = geometry(getLayoutBox(selected, container));
    if (instant) animated.value = false;
    style.value = {
      opacity: selected.offsetWidth && selected.offsetHeight ? 1 : 0,
      transform: `translate(${box.x}px, ${box.y}px)`,
      width: `${box.width}px`, height: `${box.height}px`,
    };
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => { animated.value = true; });
  }

  function observe() {
    observer?.disconnect();
    if (!root.value || !observer) return;
    observer.observe(root.value);
    root.value.querySelectorAll('button, [data-au-indicator-target]').forEach((element) => observer.observe(element));
  }

  onMounted(() => {
    // 选中字体引发的尺寸变化也沿当前轨迹更新，避免测量回调打断滑动。
    if (typeof ResizeObserver !== 'undefined') observer = new ResizeObserver(() => sync());
    observe();
    sync(true);
  });
  watch(dependencies, async () => {
    await nextTick();
    if (disposed) return;
    observe();
    sync();
  }, { deep: true, flush: 'post' });
  onBeforeUnmount(() => {
    disposed = true;
    observer?.disconnect();
    cancelAnimationFrame(frame);
  });
  return { style, animated };
}
