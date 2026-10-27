import { onBeforeUnmount, onMounted, ref } from 'vue';

// 等初始状态完成绘制后进入终态；后台页用短定时器兜底，卸载时释放资源。
export function useMotionReady(enabled = () => true) {
  const ready = ref(false);
  let frame;
  let timer;
  function settle() {
    ready.value = true;
    cancelAnimationFrame(frame);
    clearTimeout(timer);
  }
  onMounted(() => {
    if (document.hidden || !enabled()) return settle();
    frame = requestAnimationFrame(() => { frame = requestAnimationFrame(settle); });
    timer = setTimeout(settle, 100);
  });
  onBeforeUnmount(() => { cancelAnimationFrame(frame); clearTimeout(timer); });
  return ready;
}
