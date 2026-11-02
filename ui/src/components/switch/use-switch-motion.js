import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { clamp, createFrameLoop, createSpring, prefersReducedMotion } from '../../utils/glass/motion.js';

// 五条展示通道与受控值分离；手势结束后只向宿主提交一次。
export function useSwitchMotion(props, checked, root, commit) {
  const position = createSpring(checked.value ? 1 : 0);
  const press = createSpring(0);
  const horizontal = createSpring(1, 250, 0.6);
  const vertical = createSpring(1, 250, 0.7);
  const velocity = createSpring(0, 300, 0.5, 0.01);
  const progress = ref(0);
  const thumbStyle = ref({});
  const trackStyle = ref({});
  const disabled = computed(() => props.disabled || props.loading);
  const travel = computed(() => ({ small: 12, default: 16, large: 18 })[props.size]);
  let pointer = null;
  let completedPointer = null;
  let held = false;
  let startX = 0;
  let startY = 0;
  let startValue = 0;
  let direction = 1;
  let dragged = false;
  let samples = [];
  let disposed = false;

  function paint() {
    if (root.value) direction = getComputedStyle(root.value).direction === 'rtl' ? -1 : 1;
    const reduced = prefersReducedMotion();
    const speedX = clamp(velocity.value / 50 * 0.75, -0.2, 0.2);
    const speedY = clamp(velocity.value / 50 * 0.25, -0.2, 0.2);
    thumbStyle.value = {
      transform: `translateX(${position.value * travel.value * direction}px) scale(${reduced ? 1 : horizontal.value / (1 - speedX)},${reduced ? 1 : vertical.value * (1 - speedY)})`,
    };
    const fraction = clamp(position.value) * 100;
    trackStyle.value = { background: `color-mix(in srgb,var(--au-glass-switch-on) ${fraction}%,var(--au-glass-switch-off))` };
    progress.value = clamp(press.value);
  }
  const loop = createFrameLoop((seconds, time) => {
    let moving = position.step(seconds);
    const active = !disabled.value && (held || Math.abs(position.value - position.target) >= 0.025);
    press.target = active ? 1 : 0;
    horizontal.target = vertical.target = active ? 1.5 : 1;
    // 从实际位置样本估计归一化行程/秒，再使用独立弹簧平滑速度。
    samples.push({ time, value: position.value });
    samples = samples.filter((sample) => time - sample.time <= 100);
    if (samples.length > 1) {
      const averageTime = samples.reduce((sum, sample) => sum + sample.time, 0) / samples.length;
      const averageValue = samples.reduce((sum, sample) => sum + sample.value, 0) / samples.length;
      const denominator = samples.reduce((sum, sample) => sum + (sample.time - averageTime) ** 2, 0);
      velocity.target = active && denominator ? 1000 * samples.reduce((sum, sample) => sum
        + (sample.time - averageTime) * (sample.value - averageValue), 0) / denominator : 0;
    }
    for (const channel of [press, horizontal, vertical, velocity]) moving = channel.step(seconds) || moving;
    paint();
    if (!moving) samples = [];
    return moving;
  });
  function animate() {
    if (prefersReducedMotion()) {
      loop.stop(); position.snap(position.target);
      press.snap(held && !disabled.value ? 1 : 0);
      horizontal.snap(1); vertical.snap(1); velocity.snap(0); paint();
    } else loop.start();
  }
  function releaseCapture(id) {
    if (root.value && root.value.hasPointerCapture(id)) root.value.releasePointerCapture(id);
  }
  function cancel() {
    const id = pointer;
    pointer = null; held = false;
    position.target = checked.value ? 1 : 0;
    if (id !== null) { completedPointer = id; releaseCapture(id); }
    animate();
  }
  function down(event) {
    if (disabled.value || pointer !== null || !event.isPrimary || event.button > 0) return;
    direction = getComputedStyle(root.value).direction === 'rtl' ? -1 : 1;
    pointer = event.pointerId; completedPointer = null; held = true; dragged = false;
    startX = event.clientX; startY = event.clientY; startValue = position.target;
    root.value.setPointerCapture(pointer);
    animate();
  }
  function move(event) {
    if (event.pointerId !== pointer) return;
    const delta = event.clientX - startX;
    const verticalDelta = event.clientY - startY;
    if (Math.abs(verticalDelta) > Math.abs(delta) && Math.abs(verticalDelta) > 8) { cancel(); return; }
    if (delta !== 0) dragged = true;
    position.target = clamp(startValue + delta / travel.value * direction);
    animate();
  }
  async function up(event) {
    if (event.pointerId !== pointer) return;
    const requested = dragged ? position.target >= 0.5 : !checked.value;
    const id = pointer;
    completedPointer = id; pointer = null; held = false;
    releaseCapture(id);
    if (requested !== checked.value) commit(requested);
    // 宿主可以拒绝受控更新；不持有第二份业务状态。
    await nextTick();
    if (disposed) return;
    position.target = checked.value ? 1 : 0;
    animate();
  }
  function click(event) {
    if (disabled.value) return;
    if (event.detail !== 0 && event.pointerId === completedPointer) { completedPointer = null; return; }
    commit(!checked.value);
  }
  function lost(event) { if (event.pointerId === pointer) cancel(); }
  function keydown(event) { if (!disabled.value && [' ', 'Enter'].includes(event.key)) { held = true; animate(); } }
  function keyup(event) { if ([' ', 'Enter'].includes(event.key)) { held = false; animate(); } }
  watch([checked, disabled, () => props.size], () => {
    if (disabled.value) cancel();
    else { position.target = checked.value ? 1 : 0; animate(); }
  });
  onMounted(() => { paint(); window.addEventListener('blur', cancel); });
  onBeforeUnmount(() => {
    disposed = true; loop.stop();
    window.removeEventListener('blur', cancel);
    if (pointer !== null) releaseCapture(pointer);
  });
  paint();
  return { progress, thumbStyle, trackStyle, down, move, up, click, lost, cancel, keydown, keyup };
}
