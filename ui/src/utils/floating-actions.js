// 浮层退出期间保留 DOM；键盘导航只访问仍在使用的操作项。
export function getFloatingActions(root, selector = 'button:not(:disabled)') {
  if (!root) return [];
  return [...root.querySelectorAll(selector)].filter((element) => !element.closest('.au-float-leave-active'));
}
