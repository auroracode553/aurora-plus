<template>
  <div class="table-demo">
    <div class="table-demo__toolbar">
      <AuButton size="small" :type="border ? 'primary' : 'default'" @click="border = !border">
        {{ border ? '关闭边框' : '显示边框' }}
      </AuButton>
      <AuButton size="small" :type="stripe ? 'primary' : 'default'" @click="stripe = !stripe">
        {{ stripe ? '关闭斑马纹' : '显示斑马纹' }}
      </AuButton>
      <AuButton size="small" @click="tableRef?.clearSelection()">清空选择</AuButton>
      <span class="table-demo__summary">已选 {{ selectedRows.length }} 行 · 当前行 {{ currentRow?.name || '无' }}</span>
    </div>

    <AuTable
      ref="tableRef"
      :data="rows"
      row-key="id"
      auto-height
      :border="border"
      :stripe="stripe"
      highlight-current-row
      @selection-change="selectedRows = $event"
      @current-change="currentRow = $event"
    >
      <AuTableColumn type="selection" :selectable="canSelectRow" />
      <AuTableColumn type="index" label="#" />
      <AuTableColumn prop="name" label="名称" :width="140" sortable />
      <AuTableColumn prop="status" label="状态" :width="100">
        <template #default="{ value }">
          <span :class="{ 'table-demo__status--active': value === '进行中' }">{{ value }}</span>
        </template>
      </AuTableColumn>
      <AuTableColumn prop="summary" label="摘要" :width="250" :flex-grow="1" />
    </AuTable>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuTable, AuTableColumn } from 'aurora-plus';

const tableRef = ref(null);
const border = ref(false);
const stripe = ref(false);
const selectedRows = ref([]);
const currentRow = ref(null);
const rows = [
  { id: 1, name: '设计规范', status: '已完成', summary: '整理组件尺寸与主题规则。' },
  { id: 2, name: '接口联调', status: '进行中', summary: '核对表格选择与排序事件，并处理较长的说明文字在窄列中自然换行的情况。' },
  { id: 3, name: '视觉检查', status: '进行中', summary: '确认默认无外框，横线与悬停状态保持轻量。' },
  { id: 4, name: '归档记录', status: '已锁定', summary: '这一行不可勾选，仍可点击查看当前行高亮。', locked: true },
];

function canSelectRow(row) {
  return !row.locked;
}
</script>

<style scoped>
.table-demo {
  min-width: 0;
}

.table-demo__toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.table-demo__summary {
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.table-demo__status--active {
  color: var(--au-color-primary);
}
</style>
