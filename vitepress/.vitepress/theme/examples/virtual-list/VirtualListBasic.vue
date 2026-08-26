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
      :item-height="36"
      :overscan="6"
      @range-change="renderedRange = $event"
    >
      <template #default="{ item, index }">
        <div
          class="virtual-list-demo__row"
          :class="{ 'is-last': index === filteredItems.length - 1 }"
        >
          <span class="virtual-list-demo__index">{{ index + 1 }}</span>
          <span class="virtual-list-demo__identity">
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
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 8px;
}

.virtual-list-demo__controls input {
  min-width: 210px;
  height: 28px;
  padding: 0 9px;
  border: 1px solid var(--au-color-border);
  border-radius: var(--au-border-radius-base);
  color: var(--au-color-text-primary);
  background: transparent;
  font: inherit;
  font-size: 13px;
  outline: none;
}

.virtual-list-demo__controls input:focus-visible {
  border-color: color-mix(in srgb, var(--au-color-primary) 58%, var(--au-color-border));
  outline: 2px solid color-mix(in srgb, var(--au-color-primary) 22%, transparent);
  outline-offset: 1px;
}

.virtual-list-demo__controls span {
  margin-left: auto;
  color: var(--au-color-text-secondary);
  font-size: 12px;
}

.virtual-list-demo {
  height: 330px;
  --au-virtual-list-padding-block: 6px;
  --au-virtual-list-padding-inline: 8px;
  border: 1px solid var(--au-color-border-lighter);
  border-radius: 8px;
  background: transparent;
}

.virtual-list-demo__row {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) auto;
  align-items: center;
  height: 36px;
  padding: 0 10px;
  border-bottom: 1px solid var(--au-color-border-lighter);
  color: var(--au-color-text-regular);
  font-size: 13px;
}

.virtual-list-demo__row.is-last {
  border-bottom-color: transparent;
}

.virtual-list-demo__identity {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.virtual-list-demo__row strong {
  min-width: 0;
  overflow: hidden;
  color: var(--au-color-text-primary);
  font-weight: var(--au-font-weight-medium);
  line-height: 18px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.virtual-list-demo__index {
  color: var(--au-color-text-secondary);
}

.virtual-list-demo__identity small {
  position: relative;
  flex: 0 1 7em;
  min-width: 0;
  padding-left: 10px;
  overflow: hidden;
  color: var(--au-color-text-secondary);
  font-size: 12px;
  line-height: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.virtual-list-demo__identity small::before {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  width: 1px;
  background: var(--au-color-border-light);
  content: '';
}

.virtual-list-demo__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 46px;
  height: 20px;
  padding: 0 7px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: var(--au-font-weight-medium);
  line-height: 1;
}

.virtual-list-demo__status.is-success {
  color: var(--au-color-success);
  background: color-mix(in srgb, var(--au-color-success) 11%, transparent);
}

.virtual-list-demo__status.is-warning {
  color: var(--au-color-warning);
  background: color-mix(in srgb, var(--au-color-warning) 12%, transparent);
}

.virtual-list-demo__status.is-info {
  color: var(--au-color-info);
  background: color-mix(in srgb, var(--au-color-info) 11%, transparent);
}

.virtual-list-demo__empty {
  display: grid;
  height: 100%;
  min-height: 180px;
  color: var(--au-color-text-secondary);
  place-items: center;
}

@media (prefers-contrast: more) {
  .virtual-list-demo__status {
    outline: 1px solid currentColor;
    outline-offset: -1px;
  }
}
</style>
