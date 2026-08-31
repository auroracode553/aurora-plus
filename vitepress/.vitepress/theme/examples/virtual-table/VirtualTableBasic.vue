<template>
  <div class="virtual-table-demo">
    <div class="virtual-table-demo__actions">
      <AuButton size="small" @click="tableRef?.scrollToRow(5000, 'center')">定位第 5,001 行</AuButton>
      <span>当前渲染 {{ rendered.start + 1 }}–{{ rendered.end }} 行</span>
    </div>
    <AuVirtualTable
      ref="tableRef"
      :columns="columns"
      :data="rows"
      :height="360"
      stripe
      border
      @rows-rendered="rendered = $event"
    >
      <template #cell-status="{ value }">
        <span class="virtual-table-demo__status" :class="{ 'is-active': value === '进行中' }">
          {{ value }}
        </span>
      </template>
    </AuVirtualTable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuVirtualTable } from 'aurora-ui';

const tableRef = ref(null);
const rendered = ref({ start: 0, end: 0 });
const columns = [
  { key: 'id', title: '编号', dataKey: 'id', width: 90, fixed: 'left', sortable: true },
  { key: 'name', title: '名称', dataKey: 'name', width: 180, flexGrow: 1 },
  { key: 'owner', title: '负责人', dataKey: 'owner', width: 130, sortable: true },
  { key: 'status', title: '状态', dataKey: 'status', width: 110, align: 'center' },
  { key: 'updatedAt', title: '更新时间', dataKey: 'updatedAt', width: 160 },
];
const rows = Array.from({ length: 10000 }, (_, index) => ({
  id: index + 1,
  name: `Aurora 任务 ${index + 1}`,
  owner: ['林晨', '周言', '陈夏'][index % 3],
  status: index % 4 === 0 ? '已完成' : '进行中',
  updatedAt: `2026-08-${String(index % 28 + 1).padStart(2, '0')} 10:30`,
}));
</script>

<style scoped>
.virtual-table-demo {
  display: grid;
  gap: 10px;
}

.virtual-table-demo__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.virtual-table-demo__status {
  color: var(--au-color-success);
}

.virtual-table-demo__status.is-active {
  color: var(--au-color-primary);
}
</style>
