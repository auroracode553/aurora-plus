<template>
  <div class="pagination-demo">
    <AuPagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="237"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, ->, prev, pager, next, jumper"
    />
    <p>当前显示第 {{ startItem }}–{{ endItem }} 条</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { AuPagination } from 'aurora-plus';

const currentPage = ref(3);
const pageSize = ref(20);
const startItem = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const endItem = computed(() => Math.min(currentPage.value * pageSize.value, 237));
</script>

<style scoped>
.pagination-demo {
  display: grid;
  gap: 12px;
}

.pagination-demo p {
  margin: 0;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}
</style>
