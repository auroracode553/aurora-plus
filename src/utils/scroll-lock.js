let lockCount = 0;
let previousOverflow = '';
let previousPaddingRight = '';

export function lockBodyScroll() {
  if (typeof document === 'undefined') return;
  lockCount += 1;
  if (lockCount > 1) return;

  const body = document.body;
  previousOverflow = body.style.overflow;
  previousPaddingRight = body.style.paddingRight;
  const scrollbarWidth = Math.max(window.innerWidth - document.documentElement.clientWidth, 0);
  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined' || lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;

  document.body.style.overflow = previousOverflow;
  document.body.style.paddingRight = previousPaddingRight;
}
