<template>
  <div>
    <div class="virtual-list-demo__controls">
      <input v-model.trim="keyword" type="search" placeholder="按名称或状态筛选" />
      <AuButton size="small" @click="listRef?.scrollToTop()">回到顶部</AuButton>
      <AuButton size="small" @click="scrollToMiddle">定位到中间</AuButton>
      <span>共 {{ filteredItems.length }} 条，当前渲染 {{ renderedRangeText }}</span>
    </div>

    <AuVirtualList
      ref="listRef"
      class="virtual-list-demo"
      :items="filteredItems"
      :item-height="44"
      :overscan="6"
      @range-change="renderedRange = $event"
    >
      <template #default="{ item, index }">
        <div class="virtual-list-demo__row">
          <span class="virtual-list-demo__index">{{ index + 1 }}</span>
          <span>
            <strong>{{ item.name }}</strong>
            <small>{{ item.owner }}</small>
          </span>
          <span class="virtual-list-demo__status" :class="`is-${item.statusType}`">
            {{ item.status }}
          </span>
        </div>
      </template>
      <template #empty>
        <div class="virtual-list-demo__empty">没有匹配的数据</div>
      </template>
    </AuVirtualList>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { AuButton, AuVirtualList } from 'aurora-ui';

const owners = ['设计团队', '前端团队', '编辑器团队', '质量团队'];
const statuses = [
  { label: '已同步', type: 'success' },
  { label: '待处理', type: 'warning' },
  { label: '仅本地', type: 'info' },
];

const items = Array.from({ length: 1000 }, (_, index) => {
  const status = statuses[index % statuses.length];
  return {
    id: index + 1,
    name: `Aurora 项目 ${String(index + 1).padStart(4, '0')}`,
    owner: owners[index % owners.length],
    status: status.label,
    statusType: status.type,
  };
});

const keyword = ref('');
const listRef = ref(null);
const renderedRange = ref({ start: 0, end: 0 });

const filteredItems = computed(() => {
  const query = keyword.value.toLowerCase();
  if (!query) return items;
  return items.filter((item) =>
    [item.name, item.owner, item.status].some((value) => value.toLowerCase().includes(query))
  );
});

const renderedRangeText = computed(() => {
  if (filteredItems.value.length === 0) return '0';
  return `${renderedRange.value.start + 1}–${renderedRange.value.end}`;
});

function scrollToMiddle() {
  const middleIndex = Math.floor(filteredItems.value.length / 2);
  listRef.value?.scrollToIndex(middleIndex, 'center');
}
</script>

<style scoped>
.virtual-list-demo__controls {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
}

.virtual-list-demo__controls input {
  min-width: 210px;
  padding: 7px 10px;
  border: 1px solid var(--au-color-border);
  border-radius: var(--au-border-radius-base);
  color: var(--au-color-text-primary);
  background: transparent;
  outline: none;
}

.virtual-list-demo__controls span {
  margin-left: auto;
  color: var(--au-color-text-secondary);
  font-size: 12px;
}

.virtual-list-demo {
  height: 330px;
  border: 1px solid var(--au-color-border-lighter);
  border-radius: 8px;
  background: transparent;
}

.virtual-list-demo__row {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  align-items: center;
  height: 44px;
  padding: 0 14px;
  border-bottom: 1px solid var(--au-color-border-lighter);
  color: var(--au-color-text-regular);
  font-size: 13px;
}

.virtual-list-demo__row > span:nth-child(2) {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.virtual-list-demo__row strong {
  color: var(--au-color-text-primary);
  font-weight: 500;
}

.virtual-list-demo__row small,
.virtual-list-demo__index {
  color: var(--au-color-text-secondary);
}

.virtual-list-demo__status {
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--au-color-bg-soft);
  font-size: 11px;
}

.virtual-list-demo__status.is-success {
  color: var(--au-color-success);
}

.virtual-list-demo__status.is-warning {
  color: var(--au-color-warning);
}

.virtual-list-demo__empty {
  display: grid;
  height: 100%;
  min-height: 180px;
  color: var(--au-color-text-secondary);
  place-items: center;
}
</style>
