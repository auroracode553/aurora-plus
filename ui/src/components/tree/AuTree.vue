<template>
  <AuVirtualList
    ref="virtualListRef"
    class="au-tree"
    :items="items"
    :item-height="itemHeight"
    :overscan="overscan"
    :key-field="itemKey"
    plain
    fill
    role="tree"
    :aria-label="ariaLabel"
  >
    <template #empty>
      <div class="au-tree__empty" role="status">
        <AuIcon :icon="IconFileText" />
        <span>{{ emptyText }}</span>
      </div>
    </template>

    <template #default="{ item, index }">
      <div
        class="au-tree__item"
        :class="{ 'is-selected': isSelected(item) }"
        role="treeitem"
        :aria-level="resolveDepth(item) + 1"
        :aria-selected="isSelected(item)"
        :aria-expanded="collapsible && item.hasChildren ? !item.isCollapsed : undefined"
        :style="{ paddingLeft: `${baseIndent + resolveDepth(item) * indent}px` }"
      >
        <button
          v-if="collapsible && item.hasChildren"
          class="au-tree__toggle au-focus-ring"
          :class="{ 'is-expanded': !item.isCollapsed }"
          type="button"
          :aria-label="item.isCollapsed ? `展开 ${resolveLabel(item)}` : `折叠 ${resolveLabel(item)}`"
          :aria-expanded="!item.isCollapsed"
          @click.stop="emit('toggle', item)"
        >
          <AuIcon :icon="IconChevronRight" />
        </button>
        <span v-else-if="collapsible" class="au-tree__toggle-placeholder" aria-hidden="true"></span>

        <button
          class="au-tree__label au-focus-ring"
          type="button"
          :tabindex="isSelected(item) || (selectedKey == null && index === 0) ? 0 : -1"
          :data-tree-index="index"
          :title="resolveLabel(item)"
          @click="selectItem(item)"
          @keydown="handleItemKeydown($event, item, index)"
        >
          <span>{{ resolveLabel(item) }}</span>
        </button>
      </div>
    </template>
  </AuVirtualList>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import { IconChevronRight, IconFileText } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';
import { AuVirtualList } from '../virtual-list/index.js';

const props = defineProps({
  items: { type: Array, default: () => [] },
  selectedKey: { type: [String, Number], default: null },
  itemKey: { type: String, default: 'id' },
  labelKey: { type: String, default: 'label' },
  itemHeight: { type: Number, default: 28, validator: (value) => value > 0 },
  overscan: { type: Number, default: 8, validator: (value) => value >= 0 },
  baseIndent: { type: Number, default: 10, validator: (value) => value >= 0 },
  indent: { type: Number, default: 16, validator: (value) => value >= 0 },
  collapsible: { type: Boolean, default: false },
  emptyText: { type: String, default: '暂无数据' },
  ariaLabel: { type: String, default: '树形导航' },
});

const emit = defineEmits(['select', 'toggle']);
const virtualListRef = ref(null);

function resolveKey(item) {
  return item?.[props.itemKey];
}

function resolveLabel(item) {
  return String(item?.[props.labelKey] ?? '');
}

function resolveDepth(item) {
  const rawDepth = item?.displayDepth ?? item?.depth ?? 0;
  const depth = Number.parseInt(rawDepth, 10);
  return Number.isFinite(depth) ? Math.max(depth, 0) : 0;
}

function isSelected(item) {
  return Object.is(resolveKey(item), props.selectedKey);
}

function selectItem(item) {
  emit('select', item);
}

async function focusItem(index) {
  const nextIndex = Math.max(0, Math.min(index, props.items.length - 1));
  virtualListRef.value.scrollToIndex(nextIndex, 'auto');
  await nextTick();
  const exposedContainer = virtualListRef.value.scrollContainerRef;
  const scrollContainer = exposedContainer?.value ?? exposedContainer;
  const target = scrollContainer?.querySelector(`[data-tree-index="${nextIndex}"]`);
  if (target) target.focus();
}

function handleItemKeydown(event, item, index) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    focusItem(index + 1);
    return;
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    focusItem(index - 1);
    return;
  }
  if (event.key === 'Home') {
    event.preventDefault();
    focusItem(0);
    return;
  }
  if (event.key === 'End') {
    event.preventDefault();
    focusItem(props.items.length - 1);
    return;
  }
  if (!props.collapsible || !item.hasChildren) return;
  if (event.key === 'ArrowRight' && item.isCollapsed) {
    event.preventDefault();
    emit('toggle', item);
  } else if (event.key === 'ArrowLeft' && !item.isCollapsed) {
    event.preventDefault();
    emit('toggle', item);
  }
}

function scrollToTop() {
  virtualListRef.value.scrollToTop();
}

function scrollToIndex(index, align = 'auto') {
  virtualListRef.value.scrollToIndex(index, align);
}

defineExpose({ scrollToIndex, scrollToTop, virtualListRef });
</script>

<style scoped>
.au-tree {
  color: var(--au-color-text-regular);
  font-size: 13px;
}

.au-tree__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 160px;
  flex-direction: column;
  gap: 8px;
  color: var(--au-color-text-secondary);
  text-align: center;
}

.au-tree__empty :deep(svg) {
  width: 26px;
  height: 26px;
  opacity: 0.52;
}

.au-tree__item {
  display: flex;
  align-items: center;
  width: calc(100% - 12px);
  height: 28px;
  min-height: 28px;
  margin: 0 6px;
  padding-right: 8px;
  gap: 3px;
  overflow: hidden;
  border-radius: var(--au-border-radius-base);
  color: var(--au-color-text-regular);
  background: transparent;
  user-select: none;
  transition:
    color var(--au-transition-duration) var(--au-transition-ease),
    background var(--au-transition-duration) var(--au-transition-ease);
}

.au-tree__item:hover {
  color: var(--au-color-text-primary);
  background: var(--au-color-bg-hover);
}

.au-tree__item.is-selected {
  color: var(--au-color-primary);
  background: color-mix(in srgb, var(--au-color-primary) 12%, transparent);
  font-weight: var(--au-font-weight-semibold);
}

.au-tree__toggle,
.au-tree__toggle-placeholder {
  width: 18px;
  height: 22px;
  flex: 0 0 18px;
}

.au-tree__toggle {
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: var(--au-border-radius-small);
  color: var(--au-color-text-secondary);
  background: transparent;
  cursor: pointer;
  appearance: none;
  transition:
    color var(--au-transition-duration) var(--au-transition-ease),
    background var(--au-transition-duration) var(--au-transition-ease),
    transform var(--au-transition-duration) var(--au-transition-ease);
}

.au-tree__toggle:hover,
.au-tree__toggle:focus-visible {
  color: var(--au-color-text-primary);
  background: var(--au-color-bg-hover);
}

.au-tree__toggle.is-expanded {
  transform: rotate(90deg);
}

.au-tree__toggle :deep(svg) {
  width: 13px;
  height: 13px;
}

.au-tree__label {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 100%;
  flex: 1;
  padding: 0;
  overflow: hidden;
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
  appearance: none;
}

.au-tree__label span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.au-tree__label:focus-visible {
  outline-offset: -2px;
}

@media (prefers-reduced-motion: reduce) {
  .au-tree__item,
  .au-tree__toggle {
    transition: none;
  }
}

@media (prefers-contrast: more) {
  .au-tree__item.is-selected {
    outline: 1px solid currentColor;
    outline-offset: -1px;
  }
}
</style>
