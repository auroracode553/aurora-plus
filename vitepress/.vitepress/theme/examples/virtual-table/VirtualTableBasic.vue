<template>
  <div class="virtual-table-demo">
    <div class="virtual-table-demo__actions">
      <AuButton size="small" @click="tableRef?.scrollToRow(5000, 'center')">定位第 5,001 行</AuButton>
      <AuButton size="small" :type="loading ? 'primary' : 'default'" @click="loading = !loading">
        {{ loading ? '结束刷新' : '模拟刷新' }}
      </AuButton>
      <AuButton size="small" :type="showScroll ? 'primary' : 'default'" @click="showScroll = !showScroll">
        {{ showScroll ? '始终隐藏滚动条' : '悬浮显示滚动条' }}
      </AuButton>
      <span>当前渲染 {{ rendered.start + 1 }}–{{ rendered.end }} 行</span>
      <span>已选 {{ selectedRows.length }} 行</span>
    </div>
    <AuVirtualTable
      ref="tableRef"
      :data="rows"
      :height="360"
      :loading="loading"
      :show-scroll="showScroll"
      loading-text="正在刷新任务"
      stripe
      highlight-current-row
      @rows-rendered="rendered = $event"
      @selection-change="selectedRows = $event"
    >
      <AuTableColumn type="selection" :width="48" fixed />
      <AuTableColumn prop="id" label="编号" :width="90" fixed sortable />
      <AuTableColumn prop="name" label="名称" :width="180" :flex-grow="1" />
      <AuTableColumn prop="owner" label="负责人" :width="130" sortable />
      <AuTableColumn prop="status" label="状态" :width="110" align="center">
        <template #default="{ value }"><span class="virtual-table-demo__status" :class="{ 'is-active': value === '进行中' }">{{ value }}</span></template>
      </AuTableColumn>
      <AuTableColumn prop="updatedAt" label="更新时间" :width="160" />
    </AuVirtualTable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuTableColumn, AuVirtualTable } from 'aurora-plus';

const tableRef = ref(null);
const loading = ref(true);
const showScroll = ref(false);
const rendered = ref({ start: 0, end: 0 });
const selectedRows = ref([]);
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
