<script setup>
import { ref } from 'vue';
import { AuSegmented } from 'aurora-plus';
import { IconLayoutGrid, IconList } from 'aurora-plus/icons';

const view = ref('list');
const period = ref('本周');
const items = [
  { label: '列表', value: 'list', icon: IconList },
  { label: '网格', value: 'grid', icon: IconLayoutGrid },
  { label: '预览', value: 'preview', disabled: true },
];
</script>

<template>
  <div class="segmented-example">
    <AuSegmented v-model="view" :items="items" />
    <AuSegmented v-model="period" :items="['今日', '本周', '本月']" fill />
    <AuSegmented model-value="只读" :items="['只读', '编辑']" size="small" disabled />
    <p>当前视图：{{ view }}；时间范围：{{ period }}</p>
  </div>
</template>

<style scoped>
.segmented-example { display: grid; justify-items: start; width: min(400px, 100%); gap: 12px; }
.segmented-example p { margin: 0; color: var(--au-color-text-secondary); font-size: 12px; }
</style>
