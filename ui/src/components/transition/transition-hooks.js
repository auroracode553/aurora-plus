import { computed, onBeforeUnmount } from 'vue';
import { getLayoutBox } from '../../utils/layout-box.js';

export const TRANSITION_PRESETS = ['fade', 'slide-up', 'slide-down', 'scale'];
export const transitionProps = {
  preset: { type: String, default: 'slide-up', validator: (value) => TRANSITION_PRESETS.includes(value) },
  duration: { type: Number, default: undefined, validator: (value) => Number.isFinite(value) && value >= 0 },
  animated: { type: Boolean, default: true },
  appear: { type: Boolean, default: false },
};

// JS 设置动态时长、列表间隔和退出布局，动画帧与进退节奏归公共 CSS。
export function useTransitionHooks(props, emit, group = false) {
  const originalStyles = new Map();
  const name = computed(() => 'au-motion-' + (TRANSITION_PRESETS.includes(props.preset) ? props.preset : 'fade'));

  function restore(element) {
    const style = originalStyles.get(element);
    if (!style) return;
    if (style.duration) element.style.setProperty('transition-duration', style.duration, style.priority);
    else element.style.removeProperty('transition-duration');
    if (style.delay) element.style.setProperty('transition-delay', style.delay, style.delayPriority);
    else element.style.removeProperty('transition-delay');
    for (const [property, value, priority] of style.layout || []) {
      if (value) element.style.setProperty(property, value, priority);
      else element.style.removeProperty(property);
    }
    originalStyles.delete(element);
  }

  function prepare(element) {
    restore(element);
    originalStyles.set(element, { duration: element.style.transitionDuration, priority: element.style.getPropertyPriority('transition-duration'), delay: element.style.transitionDelay, delayPriority: element.style.getPropertyPriority('transition-delay') });
    if (Number.isFinite(props.duration)) element.style.setProperty('transition-duration', Math.max(0, props.duration) + 'ms', 'important');
    if (group) {
      element.style.transitionDelay = '0ms';
    }
  }

  function prepareLeave(element) {
    prepare(element);
    if (!group || !props.animated) return;
    const box = getLayoutBox(element, element.parentElement);
    const properties = ['position', 'left', 'top', 'width', 'height', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'box-sizing'];
    originalStyles.get(element).layout = properties.map((property) => [property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property)]);
    // 移出正常流前锁定原布局，避免 grid/flex 条目退出时跳到首项或收缩。
    const values = ['absolute', box.x + 'px', box.y + 'px', box.width + 'px', box.height + 'px', '0', '0', '0', '0', 'border-box'];
    properties.forEach((property, index) => element.style.setProperty(property, values[index]));
  }

  function staggerEnter(element) {
    if (!group || !props.animated) return;
    // beforeEnter 时首屏元素尚未插入；插入后才能读取同级顺序。
    const index = Math.max(0, [...(element.parentElement?.children || [])].indexOf(element));
    element.style.transitionDelay = Math.min(index, 17) * Math.max(0, props.stagger) + 'ms';
  }

  onBeforeUnmount(() => { [...originalStyles.keys()].forEach(restore); });
  return {
    name,
    hooks: {
      onBeforeEnter: prepare,
      onEnter: staggerEnter,
      onBeforeLeave: prepareLeave,
      onEnterCancelled: restore, onLeaveCancelled: restore,
      onAfterEnter: (element) => { restore(element); emit('after-enter', element); },
      onAfterLeave: (element) => { restore(element); emit('after-leave', element); },
    },
  };
}
