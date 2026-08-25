<template>
  <DemoBlock title="1000 条数据" description="DOM 中只渲染当前可视范围与缓冲区">
    <AuVirtualList class="virtual-list-demo" :items="items" :item-height="40" v-slot="{ item, index }">
      <div class="virtual-list-demo__row">
        <span class="virtual-list-demo__index">{{ index + 1 }}</span>
        <span>{{ item.name }}</span>
        <small>{{ item.status }}</small>
      </div>
    </AuVirtualList>
  </DemoBlock>
</template>

<script setup>
import { AuVirtualList } from 'aurora-ui';
import DemoBlock from './DemoBlock.vue';

const items = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `Aurora UI 列表项目 ${String(index + 1).padStart(4, '0')}`,
  status: index % 3 === 0 ? '已同步' : '本地',
}));
</script>

<style scoped>
.virtual-list-demo {
  height: 320px;
  border: 1px solid var(--au-color-border-lighter);
  border-radius: 10px;
  background: var(--au-color-bg);
}

.virtual-list-demo__row {
  display: grid;
  grid-template-columns: 46px 1fr auto;
  align-items: center;
  height: 40px;
  padding: 0 14px;
  border-bottom: 1px solid var(--au-color-border-lighter);
  color: var(--au-color-text-regular);
  font-size: 13px;
}

.virtual-list-demo__index,
.virtual-list-demo__row small {
  color: var(--au-color-text-secondary);
}
</style>
