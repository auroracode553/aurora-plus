import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { getLayoutBox } from './layout-box.js';
import { clamp, createFrameLoop, createSpring, prefersReducedMotion } from './glass/motion.js';

// Tabs 与 Segmented 共用测量逻辑；组件只提供目标元素和几何变换。
export function useSlidingIndicator(root, { target, dependencies, geometry = (value) => value, liquid = false, onDragSelect }) {
  const style = ref({ opacity: 0 });
  const animated = ref(false);
  const progress = ref(0);
  const channels = Object.fromEntries(['x', 'y', 'width', 'height'].map((name) => [name, createSpring(0)]));
  const press = createSpring(0);
  const horizontal = createSpring(1, 250, 0.6);
  const vertical = createSpring(1, 250, 0.7);
  const velocity = createSpring(0, 300, 0.5, 0.01);
  let held = false;
  let pointer = null;
  let initialized = false;
  let startX = 0;
  let startY = 0;
  let startPosition = 0;
  let dragged = false;
  let completedPointer = null;
  let candidates = [];
  const loop = createFrameLoop((seconds) => {
    let moving = false;
    for (const channel of Object.values(channels)) moving = channel.step(seconds) || moving;
    const active = liquid && (held || Math.abs(channels.x.value - channels.x.target) / Math.max(channels.width.target, 1)
      > Math.max(0, (root.value.querySelectorAll('button').length - 1) * 0.025));
    press.target = active ? 1 : 0;
    horizontal.target = vertical.target = active ? 78 / 56 : 1;
    velocity.target = active ? channels.x.velocity / Math.max(root.value.offsetWidth, 1) : 0;
    for (const channel of [press, horizontal, vertical, velocity]) moving = channel.step(seconds) || moving;
    paint();
    return moving;
  });
  function paint() {
    const reduced = prefersReducedMotion();
    style.value = {
      opacity: channels.width.target && channels.height.target ? 1 : 0,
      transform: `translate(${channels.x.value}px, ${channels.y.value}px)`,
      width: `${channels.width.value}px`, height: `${channels.height.value}px`,
      scale: liquid && !reduced ? `${horizontal.value / (1 - clamp(velocity.value / 10 * 0.75, -0.2, 0.2))} ${vertical.value * (1 - clamp(velocity.value / 10 * 0.25, -0.2, 0.2))}` : '1',
    };
    progress.value = clamp(press.value);
  }
  function pressDown(event) {
    if (!liquid || pointer !== null || !event.isPrimary || event.button > 0 || event.target.closest('button:disabled')) return;
    pointer = event.pointerId; held = true; dragged = false; completedPointer = null;
    startX = event.clientX; startY = event.clientY; startPosition = channels.x.target;
    candidates = Array.from(root.value.querySelectorAll(':scope > button:not(:disabled)'));
    if (prefersReducedMotion()) { press.snap(1); paint(); }
    else loop.start();
  }
  function pressMove(event) {
    if (event.pointerId !== pointer || !onDragSelect) return;
    const delta = event.clientX - startX;
    const verticalDelta = event.clientY - startY;
    if (!dragged && Math.abs(verticalDelta) > Math.abs(delta) && Math.abs(verticalDelta) > 8) { cancelPress(); return; }
    if (!dragged && Math.abs(delta) < 3) return;
    if (!candidates.length) return;
    dragged = true;
    root.value.setPointerCapture(pointer);
    const boxes = candidates.map((element) => getLayoutBox(element, root.value));
    channels.x.target = clamp(startPosition + delta, Math.min(...boxes.map((box) => box.x)), Math.max(...boxes.map((box) => box.x)));
    const nearest = boxes.reduce((best, box) => Math.abs(box.x - channels.x.target) < Math.abs(best.x - channels.x.target) ? box : best);
    channels.width.target = nearest.width;
    if (prefersReducedMotion()) { channels.x.snap(channels.x.target); channels.width.snap(nearest.width); paint(); }
    else loop.start();
  }
  function pressUp(event) {
    if (event.pointerId !== pointer) return;
    const accepted = event.type === 'pointerup' && dragged && !root.value.classList.contains('is-disabled');
    const id = pointer;
    completedPointer = dragged ? id : null;
    pointer = null; held = false;
    if (root.value.hasPointerCapture(id)) root.value.releasePointerCapture(id);
    if (accepted && candidates.length) {
      const selected = candidates.reduce((best, element) => Math.abs(getLayoutBox(element, root.value).x - channels.x.target)
        < Math.abs(getLayoutBox(best, root.value).x - channels.x.target) ? element : best);
      onDragSelect(selected);
    }
    nextTick(() => { if (!disposed) sync(); });
    if (prefersReducedMotion()) { press.snap(0); paint(); }
    else loop.start();
  }
  function cancelPress() {
    if (pointer !== null) pressUp({ pointerId: pointer, type: 'pointercancel' });
  }
  function suppressDragClick(event) {
    if (event.detail && event.pointerId === completedPointer) {
      completedPointer = null; event.preventDefault(); event.stopImmediatePropagation();
    }
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
    if (container.classList.contains('is-disabled') && pointer !== null) cancelPress();
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
    root.value.addEventListener('pointerdown', pressDown);
    root.value.addEventListener('pointermove', pressMove);
    root.value.addEventListener('lostpointercapture', pressUp);
    root.value.addEventListener('click', suppressDragClick, true);
    window.addEventListener('pointerup', pressUp);
    window.addEventListener('pointercancel', pressUp);
    window.addEventListener('blur', cancelPress);
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
    if (root.value) {
      if (pointer !== null && root.value.hasPointerCapture(pointer)) root.value.releasePointerCapture(pointer);
      root.value.removeEventListener('pointerdown', pressDown);
      root.value.removeEventListener('pointermove', pressMove);
      root.value.removeEventListener('lostpointercapture', pressUp);
      root.value.removeEventListener('click', suppressDragClick, true);
    }
    window.removeEventListener('pointerup', pressUp);
    window.removeEventListener('pointercancel', pressUp);
    window.removeEventListener('blur', cancelPress);
  });
  return { style, animated, progress };
}
