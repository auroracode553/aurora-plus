import { onBeforeUnmount } from 'vue';

// JS 只测量自然高度，过渡由 au-motion-collapse 公共 CSS 完成。
export function useCollapseTransition(fill) {
  const states = new Map();
  function ensure(element) {
    if (!states.has(element)) states.set(element, {
      height: element.style.height, overflow: element.style.overflow, frame: null, from: 0,
    });
    return states.get(element);
  }
  function restore(element) {
    const state = states.get(element);
    if (!state) return;
    cancelAnimationFrame(state.frame);
    element.style.height = state.height;
    element.style.overflow = state.overflow;
    states.delete(element);
  }
  function beforeEnter(element) {
    if (fill()) return;
    const state = ensure(element);
    cancelAnimationFrame(state.frame);
    element.style.height = state.from + 'px';
    element.style.overflow = 'hidden';
  }
  function enter(element) {
    if (fill()) return;
    const state = ensure(element);
    element.style.height = state.height;
    const target = element.offsetHeight;
    element.style.height = state.from + 'px';
    // 完成起点布局后再设置终点，首次展开和反向切换都走同一条 CSS 过渡。
    void element.offsetHeight;
    state.frame = requestAnimationFrame(() => { element.style.height = target + 'px'; });
  }
  function beforeLeave(element) {
    if (fill()) return;
    const state = ensure(element);
    cancelAnimationFrame(state.frame);
    state.from = Number.parseFloat(getComputedStyle(element).height) || element.offsetHeight;
    element.style.height = state.from + 'px';
    element.style.overflow = 'hidden';
  }
  function leave(element) {
    if (fill()) return;
    const state = ensure(element);
    void element.offsetHeight;
    state.frame = requestAnimationFrame(() => { element.style.height = '0px'; });
  }
  function cancel(element) {
    const state = states.get(element);
    if (!state) return;
    cancelAnimationFrame(state.frame);
    state.from = Number.parseFloat(getComputedStyle(element).height) || 0;
    element.style.height = state.from + 'px';
  }
  onBeforeUnmount(() => { [...states.keys()].forEach(restore); });
  return { beforeEnter, enter, beforeLeave, leave, cancel, restore };
}
