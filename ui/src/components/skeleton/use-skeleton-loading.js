import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

function normalizeDelay(value) {
  return Number.isFinite(value) ? Math.min(2147483647, Math.max(0, value)) : 0;
}

/** 延迟显隐只影响占位模板；请求尚未完成时不提前挂载业务内容。 */
export function useSkeletonLoading(props) {
  const delays = computed(() => {
    const value = props.throttle;
    return typeof value === 'number'
      ? { leading: normalizeDelay(value), trailing: 0 }
      : {
          leading: normalizeDelay(value?.leading),
          trailing: normalizeDelay(value?.trailing),
        };
  });
  // 服务端与客户端首次渲染保持一致，计时器仅在挂载后启动。
  const visible = ref(props.loading && delays.value.leading === 0);
  let timer;
  let stopWatching;

  function clearTimer() {
    clearTimeout(timer);
    timer = undefined;
  }

  onMounted(() => {
    stopWatching = watch(
      () => [props.loading, delays.value.leading, delays.value.trailing],
      () => {
        clearTimer();
        const target = props.loading;
        if (target === visible.value) return;
        const delay = target ? delays.value.leading : delays.value.trailing;
        if (delay === 0) visible.value = target;
        else timer = setTimeout(() => { visible.value = target; }, delay);
      },
      { immediate: true, flush: 'sync' },
    );
  });

  onBeforeUnmount(() => {
    stopWatching?.();
    clearTimer();
  });

  return { visible };
}
