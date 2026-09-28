<template>
  <div class="table-scroll-demo">
    <div class="table-scroll-demo__actions">
      <AuButton size="small" :type="showScroll ? 'primary' : 'default'" @click="showScroll = !showScroll">
        {{ showScroll ? '始终隐藏滚动条' : '悬浮显示滚动条' }}
      </AuButton>
      <AuButton size="small" @click="tableRef?.scrollToLeft(520)">查看右侧列</AuButton>
      <AuButton size="small" @click="tableRef?.scrollToLeft(0)">回到左侧</AuButton>
    </div>

    <AuTable ref="tableRef" :data="rows" :height="210" :show-scroll="showScroll" row-key="id">
      <AuTableColumn prop="id" label="编号" :width="90" fixed />
      <AuTableColumn prop="name" label="任务" :width="220" />
      <AuTableColumn prop="owner" label="负责人" :width="160" />
      <AuTableColumn prop="summary" label="说明" :width="500" />
      <AuTableColumn prop="updatedAt" label="更新时间" :width="220" />
    </AuTable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuTable, AuTableColumn } from 'aurora-plus';

const tableRef = ref(null);
const showScroll = ref(false);
const rows = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: `任务 ${index + 1}`,
  owner: ['林晨', '周言', '陈夏'][index % 3],
  summary: '滚动条隐藏时仍可滚动表格，列宽超过容器时也可以查看右侧内容。',
  updatedAt: `2026-09-${String(index + 10).padStart(2, '0')} 10:30`,
}));
</script>

<style scoped>
.table-scroll-demo {
  min-width: 0;
}

.table-scroll-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
</style>
