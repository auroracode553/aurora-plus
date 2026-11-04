<template>
  <div class="button-icons-demo">
    <div v-for="size in sizes" :key="size.value" class="button-icons-demo__sizes">
      <span>{{ size.label }}</span>
      <AuButton :icon="IconX" :size="size.value" :aria-label="`${size.label}图标按钮`" />
      <AuButton :icon="IconX" :size="size.value" circle :aria-label="`${size.label}圆形按钮`" />
      <AuButton :icon="IconX" :size="size.value" type="menu" :aria-label="`${size.label}菜单按钮`" />
    </div>

    <div v-for="(row, index) in searchRows" :key="row.label" class="button-icons-demo__example">
      <span>{{ row.label }}</span>
      <div class="button-icons-demo__search" :style="{ maxWidth: `${row.width}px` }">
        <AuInput v-model="queries[index]" type="search" placeholder="搜索内容" />
        <AuTooltip v-if="row.tooltip" content="清空">
          <AuButton :icon="IconX" size="small" circle aria-label="清空搜索" @click="queries[index] = ''" />
        </AuTooltip>
        <AuButton v-else :icon="IconX" size="small" circle aria-label="清空搜索" @click="queries[index] = ''" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuInput, AuTooltip } from 'aurora-plus';
import { IconX } from 'aurora-plus/icons';

const sizes = [
  { value: 'small', label: '小型' },
  { value: 'default', label: '默认' },
  { value: 'large', label: '大型' },
];
const searchRows = [
  { label: '210px 容器', width: 210, tooltip: false },
  { label: '210px 容器，带提示', width: 210, tooltip: true },
  { label: '242px 容器，带提示', width: 242, tooltip: true },
];
const queries = ref(searchRows.map(() => ''));
</script>

<style scoped>
.button-icons-demo {
  display: grid;
  gap: 16px;
}

.button-icons-demo__sizes {
  display: flex;
  align-items: center;
  gap: 12px;
}

.button-icons-demo__sizes > span,
.button-icons-demo__example > span {
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.button-icons-demo__example {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.button-icons-demo__search {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}
</style>
