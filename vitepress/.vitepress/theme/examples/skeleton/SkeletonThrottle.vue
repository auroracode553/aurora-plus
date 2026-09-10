<template>
  <div class="skeleton-throttle-demo">
    <div class="au-doc-row">
      <AuButton @click="reload(100)">模拟快速请求（100ms）</AuButton>
      <AuButton @click="reload(1200)">模拟普通请求（1200ms）</AuButton>
    </div>
    <div class="skeleton-throttle-demo__content">
      <AuSkeleton :loading="loading" :throttle="{ leading: 300, trailing: 200 }" :rows="2" animated>
        <template #default>
          <div class="skeleton-throttle-demo__result">内容已就绪。短于 300ms 的请求不会显示占位块。</div>
        </template>
      </AuSkeleton>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import { AuButton, AuSkeleton } from 'aurora-plus';

const loading = ref(false);
let timer;

function reload(duration) {
  clearTimeout(timer);
  loading.value = true;
  timer = setTimeout(() => { loading.value = false; }, duration);
}

onBeforeUnmount(() => clearTimeout(timer));
</script>

<style scoped>
.skeleton-throttle-demo { display: grid; gap: 16px; width: 100%; }
.skeleton-throttle-demo__content { min-height: 72px; }
.skeleton-throttle-demo__result { display: flex; align-items: center; min-height: 72px; font-size: 14px; color: var(--au-color-text-default); }
</style>
