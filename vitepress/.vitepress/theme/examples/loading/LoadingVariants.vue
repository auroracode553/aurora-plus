<script setup>
import { AuLoadingSpinner } from 'aurora-plus';

const variants = [
  { value: 'ring', label: '环形' },
  { value: 'dots', label: '三点' },
  { value: 'bars', label: '律动条' },
  { value: 'orbit', label: '轨道' },
];
</script>

<template>
  <div class="loading-variants-demo">
    <div v-for="variant in variants" :key="variant.value" class="loading-variants-demo__item">
      <AuLoadingSpinner :variant="variant.value" size="large" :text="variant.label" />
      <AuLoadingSpinner :variant="variant.value" compact size="small" text="正在处理" />
    </div>
  </div>
  <div v-loading="{ loading: true, variant: 'dots', text: '正在读取内容' }" class="loading-variants-demo__area"></div>
</template>

<style scoped>
.loading-variants-demo { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 20px; }
.loading-variants-demo__item { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
.loading-variants-demo__area { position: relative; min-height: 100px; margin-top: 20px; }
</style>
