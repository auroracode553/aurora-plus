import { onBeforeUnmount, ref } from 'vue';

const CLOSE_DELAY = 240;
const AIM_DELAY = 320;
const POINTER_MAX_AGE = 300;
const CORRIDOR_PADDING = 8;

// 管理级联菜单的悬停意图；面板通过回调提供子菜单元素，避免依赖组件结构。
export function useSubmenuHover({ getSubmenuElement }) {
  const activeSubmenuKey = ref('');
  let activeHost = null;
  let previousPoint = null;
  let departurePoint = null;
  let pending = null;
  let timer = null;

  function cancelPending() {
    if (timer !== null) globalThis.clearTimeout(timer);
    timer = null;
    pending = null;
  }

  function activateItem(key, host = null) {
    cancelPending();
    activeSubmenuKey.value = key;
    activeHost = key ? host : null;
    departurePoint = null;
    previousPoint = null;
  }

  function schedule(key, host, delay, reason) {
    cancelPending();
    pending = { key, host, reason };
    timer = globalThis.setTimeout(applyPending, delay);
  }

  function applyPending() {
    if (pending) activateItem(pending.key, pending.host);
  }

  function readPoint(event) {
    return { x: event.clientX, y: event.clientY, time: Date.now() };
  }

  function isAimingAtSubmenu(event) {
    const origin = departurePoint || previousPoint;
    if (!origin || Date.now() - origin.time > POINTER_MAX_AGE) return false;
    const submenu = activeHost && getSubmenuElement(activeHost);
    if (!submenu) return false;
    const rect = submenu.getBoundingClientRect();
    const direction = rect.left >= origin.x ? 1 : rect.right <= origin.x ? -1 : 0;
    // 窄屏内联子菜单不需要横向通道；反向移动时立即响应新的菜单项。
    if (!direction || (previousPoint && (event.clientX - previousPoint.x) * direction < -1)) return false;
    const edge = direction > 0 ? rect.left : rect.right;
    const progress = (event.clientX - origin.x) / (edge - origin.x);
    if (progress <= 0 || progress > 1) return false;
    const top = origin.y + (rect.top - CORRIDOR_PADDING - origin.y) * progress;
    const bottom = origin.y + (rect.bottom + CORRIDOR_PADDING - origin.y) * progress;
    return event.clientY >= top && event.clientY <= bottom;
  }

  function hoverItem(key, event) {
    if (key === activeSubmenuKey.value) {
      keepOpen();
      previousPoint = readPoint(event);
      return;
    }
    if (activeSubmenuKey.value && isAimingAtSubmenu(event)) {
      // 斜向进入子菜单时暂缓切换相邻项；停留超过上限仍会执行切换。
      departurePoint ||= previousPoint;
      schedule(key, event.currentTarget, AIM_DELAY, 'aim');
      return;
    }
    activateItem(key, event.currentTarget);
    previousPoint = readPoint(event);
  }

  function leaveItem(key, event) {
    if (key !== activeSubmenuKey.value && pending?.host !== event.currentTarget) return;
    departurePoint ||= previousPoint || readPoint(event);
    schedule('', null, CLOSE_DELAY, 'close');
  }

  function leavePanel() {
    if (activeSubmenuKey.value) schedule('', null, CLOSE_DELAY, 'close');
  }

  function keepOpen() {
    cancelPending();
    departurePoint = null;
  }

  function trackPointer(event) {
    if (activeHost && activeHost.contains(event.target)) {
      keepOpen();
    } else if (pending?.reason === 'aim' && !isAimingAtSubmenu(event)) {
      applyPending();
    }
    previousPoint = readPoint(event);
  }

  onBeforeUnmount(cancelPending);
  return { activeSubmenuKey, activateItem, hoverItem, leaveItem, leavePanel, keepOpen, trackPointer };
}
