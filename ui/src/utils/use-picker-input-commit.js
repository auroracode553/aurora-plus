import { onBeforeUnmount } from 'vue';

// 浮层关闭后紧接着触发的 blur 不重复提交；标记只保留到当前事件轮结束。
export function usePickerInputCommit() {
  let committed = false;
  let resetTimer = null;

  function clear() {
    if (resetTimer !== null) globalThis.clearTimeout(resetTimer);
    resetTimer = null;
    committed = false;
  }

  function mark() {
    clear();
    committed = true;
    resetTimer = globalThis.setTimeout(clear, 0);
  }

  function consume() {
    const wasCommitted = committed;
    clear();
    return wasCommitted;
  }

  onBeforeUnmount(clear);
  return { mark, consume };
}
