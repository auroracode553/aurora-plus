// 每个源独立计时、取消；不依赖 HTTP、IPC 或某个更新平台。
export async function requestUpdateSource(checkSource, configuration, { signal, currentVersion, timeout }) {
  const controller = new AbortController();
  const abort = () => controller.abort(signal.reason);
  let timer;
  let rejectOnAbort;
  signal.addEventListener('abort', abort, { once: true });
  if (signal.aborted) abort();
  try {
    return await new Promise((resolve, reject) => {
      rejectOnAbort = () => reject(controller.signal.reason || new Error('检查已取消'));
      controller.signal.addEventListener('abort', rejectOnAbort, { once: true });
      if (controller.signal.aborted) { rejectOnAbort(); return; }
      timer = setTimeout(() => controller.abort(new Error(`检查超时（${timeout}ms）`)), timeout);
      // 即使调用者忽略 signal，取消与超时也能结束等待，迟到结果不会写入新任务。
      Promise.resolve().then(() => {
        if (controller.signal.aborted) throw controller.signal.reason;
        return checkSource(configuration, { signal: controller.signal, currentVersion });
      }).then(resolve, reject);
    });
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', abort);
    controller.signal.removeEventListener('abort', rejectOnAbort);
  }
}
