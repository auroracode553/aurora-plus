<template>
  <div class="tree-select-demo">
    <label>
      <span>知识库位置</span>
      <AuTreeSelect
        v-model="selectedKey"
        :data="treeData"
        filterable
        default-expand-all
      />
    </label>
    <label>
      <span>仅选择叶节点</span>
      <AuTreeSelect v-model="leafKey" :data="treeData" leaf-only :default-expanded-keys="['guides']" />
    </label>
    <p>当前节点：{{ selectedKey || '未选择' }}；叶节点：{{ leafKey || '未选择' }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuTreeSelect } from 'aurora-plus';

const selectedKey = ref('date-picker');
const leafKey = ref(null);
const treeData = [
  {
    id: 'guides',
    label: '使用指南',
    children: [
      { id: 'start', label: '快速开始' },
      { id: 'theme', label: '主题配置' },
    ],
  },
  {
    id: 'components',
    label: '表单组件',
    children: [
      { id: 'date-picker', label: '日期选择器' },
      { id: 'tree-select', label: '树形选择' },
      { id: 'archived', label: '已归档组件', disabled: true },
    ],
  },
];
</script>

<style scoped>
.tree-select-demo {
  display: grid;
  width: min(100%, 520px);
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 12px;
}

.tree-select-demo label {
  display: grid;
  gap: 6px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.tree-select-demo p {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}
</style>
