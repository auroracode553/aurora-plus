<template>
  <div class="loading-service-demo">
    <div class="au-doc-row">
      <AuButton @click="openRegionLoading">区域服务</AuButton>
      <AuButton type="primary" @click="openFullscreenLoading">全屏服务</AuButton>
      <AuButton @click="AuLoadingService.closeAll()">关闭全部</AuButton>
    </div>

    <section ref="regionRef" class="loading-service-demo__region">
      服务模式可覆盖一个 DOM 节点，也可以直接创建全屏加载层。
    </section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import { AuButton, AuLoadingService } from 'aurora-plus';

const regionRef = ref(null);
const timers = new Set();
const instances = new Set();

function scheduleClose(instance, duration) {
  instances.add(instance);
  const timer = globalThis.setTimeout(() => {
    timers.delete(timer);
    instance.close();
    instances.delete(instance);
  }, duration);
  timers.add(timer);
}

function openRegionLoading() {
  if (!regionRef.value) return;
  const instance = AuLoadingService({
    target: regionRef.value,
    fullscreen: false,
    text: '正在读取区域数据…',
    delay: 100,
  });
  scheduleClose(instance, 1600);
}

function openFullscreenLoading() {
  const instance = AuLoadingService({
    lock: true,
    text: '正在同步工作区…',
    background: 'color-mix(in srgb, var(--au-material-background) 82%, transparent)',
  });
  const textTimer = globalThis.setTimeout(() => {
    timers.delete(textTimer);
    instance.setText('即将完成…');
  }, 700);
  timers.add(textTimer);
  scheduleClose(instance, 1700);
}

onBeforeUnmount(() => {
  timers.forEach((timer) => globalThis.clearTimeout(timer));
  instances.forEach((instance) => instance.close());
  timers.clear();
  instances.clear();
});
</script>

<style scoped>
.loading-service-demo {
  display: grid;
  gap: 14px;
}

.loading-service-demo__region {
  min-height: 112px;
  padding: 18px;
  border: 1px solid var(--au-color-border-subtle);
  border-radius: var(--au-radius-surface);
  color: var(--au-color-text-default);
  line-height: 1.6;
}
</style>
