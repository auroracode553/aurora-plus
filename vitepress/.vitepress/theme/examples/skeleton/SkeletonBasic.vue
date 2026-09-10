<template>
  <div class="skeleton-basic-demo">
    <div class="au-doc-row">
      <AuButton :selected="animated" @click="animated = !animated">{{ animated ? '关闭动画' : '开启动画' }}</AuButton>
    </div>
    <AuSkeleton :rows="3" :animated="animated" />
    <div class="skeleton-basic-demo__variants">
      <div v-for="variant in variants" :key="variant" class="skeleton-basic-demo__variant">
        <span>{{ variant }}</span>
        <AuSkeletonItem :variant="variant" :animated="animated" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuSkeleton, AuSkeletonItem } from 'aurora-plus';

const animated = ref(false);
const variants = ['text', 'p', 'h1', 'h2', 'h3', 'caption', 'button', 'circle', 'rect', 'image'];
</script>

<style scoped>
.skeleton-basic-demo { display: grid; gap: 20px; width: 100%; }
.skeleton-basic-demo__variants { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 16px; }
.skeleton-basic-demo__variant { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; min-width: 0; font-size: 12px; color: var(--au-color-text-secondary); }
</style>
