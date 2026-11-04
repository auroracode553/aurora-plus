import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

// 只维护拖动中的展示位置；普通切换由 CSS 过渡，受控值仍由宿主决定。
export function useSwitchMotion(props, checked, root, commit) {
  const position = ref(checked.value ? 1 : 0);
  const dragging = ref(false);
  const direction = ref(1);
  const disabled = computed(() => props.disabled || props.loading);
  const travel = computed(() => ({ small: 12, default: 16, large: 18 })[props.size]);
  const thumbStyle = computed(() => ({ transform: `translateX(${position.value * travel.value * direction.value}px)` }));
  const trackStyle = computed(() => ({
    backgroundColor: `color-mix(in srgb,var(--au-glass-switch-on) ${position.value * 100}%,var(--au-glass-switch-off))`,
  }));
  let pointer = null;
  let completedPointer = null;
  let startX = 0;
  let startY = 0;
  let startValue = 0;
  let disposed = false;

  function syncDirection() {
    if (root.value) direction.value = getComputedStyle(root.value).direction === 'rtl' ? -1 : 1;
  }
  function releaseCapture(id) {
    if (root.value?.hasPointerCapture(id)) root.value.releasePointerCapture(id);
    window.removeEventListener('blur', cancel);
  }
  function cancel() {
    const id = pointer;
    pointer = null;
    dragging.value = false;
    position.value = checked.value ? 1 : 0;
    if (id !== null) { completedPointer = id; releaseCapture(id); }
  }
  function down(event) {
    if (disabled.value || pointer !== null || !event.isPrimary || event.button > 0) return;
    syncDirection();
    pointer = event.pointerId;
    completedPointer = null;
    startX = event.clientX;
    startY = event.clientY;
    startValue = position.value;
    root.value.setPointerCapture(pointer);
    window.addEventListener('blur', cancel);
  }
  function move(event) {
    if (event.pointerId !== pointer) return;
    const delta = event.clientX - startX;
    const verticalDelta = event.clientY - startY;
    if (Math.abs(verticalDelta) > Math.abs(delta) && Math.abs(verticalDelta) > 8) { cancel(); return; }
    if (delta !== 0) dragging.value = true;
    position.value = Math.min(1, Math.max(0, startValue + delta / travel.value * direction.value));
  }
  async function up(event) {
    if (event.pointerId !== pointer) return;
    const requested = dragging.value ? position.value >= 0.5 : !checked.value;
    const id = pointer;
    completedPointer = id;
    pointer = null;
    dragging.value = false;
    releaseCapture(id);
    if (requested !== checked.value) commit(requested);
    // 下一次 Vue 更新后恢复宿主值，处理宿主拒绝更新的情况。
    await nextTick();
    if (!disposed) position.value = checked.value ? 1 : 0;
  }
  function click(event) {
    if (disabled.value) return;
    if (event.detail !== 0 && event.pointerId === completedPointer) { completedPointer = null; return; }
    commit(!checked.value);
  }
  function lost(event) { if (event.pointerId === pointer) cancel(); }
  watch([checked, disabled, () => props.size, root], () => {
    syncDirection();
    if (disabled.value) cancel();
    else position.value = checked.value ? 1 : 0;
  }, { flush: 'post' });
  onBeforeUnmount(() => {
    disposed = true;
    const id = pointer;
    pointer = null;
    if (id !== null) releaseCapture(id);
  });
  return { dragging, thumbStyle, trackStyle, down, move, up, click, lost, cancel };
}
