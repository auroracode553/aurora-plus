import { onBeforeUnmount, onMounted, ref } from 'vue';

/** 渲染进程只读取原生覆盖区能力，不依赖 Node、IPC 或预加载脚本。 */
export function useNativeWindowControls() {
  const isElectron = typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron/');
  const overlay = isElectron
    ? navigator.windowControlsOverlay
    : null;
  const available = ref(Boolean(overlay && overlay.visible));
  const update = () => { available.value = Boolean(overlay && overlay.visible); };

  onMounted(() => {
    update();
    if (overlay) overlay.addEventListener('geometrychange', update);
  });
  onBeforeUnmount(() => {
    if (overlay) overlay.removeEventListener('geometrychange', update);
  });
  return { available };
}
