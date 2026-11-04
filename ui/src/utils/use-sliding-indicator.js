import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { getLayoutBox } from './layout-box.js';
import { createFrameLoop, createSpring, prefersReducedMotion } from './glass/motion.js';

// 根据目标元素的布局坐标同步 Tabs 指示线，组件负责提供几何变换。
export function useSlidingIndicator(root, { target, dependencies, geometry = (value) => value }) {
  const style = ref({ opacity: 0 });
  const animated = ref(false);
  const channels = Object.fromEntries(['x', 'y', 'width', 'height'].map((name) => [name, createSpring(0)]));
  let initialized = false;
  const loop = createFrameLoop((seconds) => {
    let moving = false;
    for (const channel of Object.values(channels)) moving = channel.step(seconds) || moving;
    paint();
    return moving;
  });
  function paint() {
    style.value = {
      opacity: channels.width.target && channels.height.target ? 1 : 0,
      transform: `translate(${channels.x.value}px, ${channels.y.value}px)`,
      width: `${channels.width.value}px`, height: `${channels.height.value}px`,
    };
  }
  let observer;
  let frame;
  let disposed = false;

  function sync(instant = false) {
    const container = root.value;
    const selected = target();
    if (!container || !selected) {
      loop.stop();
      initialized = false;
      style.value = { opacity: 0 };
      return;
    }
    // 使用布局坐标，避免把按压缩放和祖先变换后的尺寸固化到选中层。
    const box = geometry(getLayoutBox(selected, container));
    if (instant) animated.value = false;
    for (const [name, channel] of Object.entries(channels)) {
      channel.target = box[name];
      if (instant || !initialized || prefersReducedMotion()) channel.snap(box[name]);
    }
    initialized = true;
    paint();
    if (!prefersReducedMotion()) loop.start();
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
    loop.stop();
  });
  return { style, animated };
}
