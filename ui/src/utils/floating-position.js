const BASE_PLACEMENTS = ['top', 'right', 'bottom', 'left'];
const ALIGNMENTS = ['start', 'center', 'end'];

/**
 * 将浮层方位标准化为主轴与对齐方式，非法值回退到底部居中。
 */
export function normalizeFloatingPlacement(value, fallback = 'bottom') {
  const [requestedBase, requestedAlign = 'center'] = String(value || fallback).split('-');
  const base = BASE_PLACEMENTS.includes(requestedBase) ? requestedBase : fallback;
  const align = ALIGNMENTS.includes(requestedAlign) ? requestedAlign : 'center';
  return { base, align };
}

/**
 * 计算相对触发元素的浮层位置；主轴空间不足时翻转，并始终限制在视口内。
 */
export function resolveFloatingPosition({
  placement = 'bottom',
  triggerRect,
  floatingRect,
  offset = 8,
  viewportWidth,
  viewportHeight,
  viewportGap = 8,
}) {
  const preferred = normalizeFloatingPlacement(placement);
  const base = chooseBase({
    preferredBase: preferred.base,
    triggerRect,
    floatingRect,
    offset,
    viewportWidth,
    viewportHeight,
    viewportGap,
  });
  const position = calculatePosition({
    base,
    align: preferred.align,
    triggerRect,
    floatingRect,
    offset,
  });

  return {
    placement: preferred.align === 'center' ? base : `${base}-${preferred.align}`,
    x: clamp(position.x, viewportGap, viewportWidth - floatingRect.width - viewportGap),
    y: clamp(position.y, viewportGap, viewportHeight - floatingRect.height - viewportGap),
  };
}

function chooseBase({
  preferredBase,
  triggerRect,
  floatingRect,
  offset,
  viewportWidth,
  viewportHeight,
  viewportGap,
}) {
  const oppositeBase = getOppositeBase(preferredBase);
  const preferredSpace = getAvailableSpace(
    preferredBase,
    triggerRect,
    viewportWidth,
    viewportHeight,
    viewportGap,
  );
  const oppositeSpace = getAvailableSpace(
    oppositeBase,
    triggerRect,
    viewportWidth,
    viewportHeight,
    viewportGap,
  );
  const floatingSize = ['top', 'bottom'].includes(preferredBase)
    ? floatingRect.height
    : floatingRect.width;

  if (preferredSpace >= floatingSize + offset || preferredSpace >= oppositeSpace) {
    return preferredBase;
  }
  return oppositeBase;
}

function getAvailableSpace(base, triggerRect, viewportWidth, viewportHeight, viewportGap) {
  if (base === 'top') return triggerRect.top - viewportGap;
  if (base === 'bottom') return viewportHeight - triggerRect.bottom - viewportGap;
  if (base === 'left') return triggerRect.left - viewportGap;
  return viewportWidth - triggerRect.right - viewportGap;
}

function getOppositeBase(base) {
  if (base === 'top') return 'bottom';
  if (base === 'bottom') return 'top';
  if (base === 'left') return 'right';
  return 'left';
}

function calculatePosition({ base, align, triggerRect, floatingRect, offset }) {
  if (base === 'top' || base === 'bottom') {
    return {
      x: alignCrossAxis(align, triggerRect.left, triggerRect.width, floatingRect.width),
      y: base === 'top'
        ? triggerRect.top - floatingRect.height - offset
        : triggerRect.bottom + offset,
    };
  }

  return {
    x: base === 'left'
      ? triggerRect.left - floatingRect.width - offset
      : triggerRect.right + offset,
    y: alignCrossAxis(align, triggerRect.top, triggerRect.height, floatingRect.height),
  };
}

function alignCrossAxis(align, start, triggerSize, floatingSize) {
  if (align === 'start') return start;
  if (align === 'end') return start + triggerSize - floatingSize;
  return start + (triggerSize - floatingSize) / 2;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}
