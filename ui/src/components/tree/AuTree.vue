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
  >
    <template #empty>
      <div class="au-tree__empty">
        <AuIcon class="au-tree__empty-icon" :icon="IconFileText" />
        <span>{{ emptyText }}</span>
      </div>
    </template>

    <template #default="{ item, index }">
      <div
        class="au-tree__item au-hover-control au-disabled-text"
        :class="{ 'is-selected': isSelected(item), 'is-disabled': isDisabled(item) }"
        :style="{ paddingLeft: `${baseIndent + resolveDepth(item) * indent}px` }"
      >
        <button
          v-if="collapsible && item.hasChildren"
          class="au-tree__toggle au-control-reset au-grid-center au-hover-control"
          :class="{ 'is-expanded': !item.isCollapsed }"
          type="button"
          @click.stop="emit('toggle', item)"
        >
          <AuIcon class="au-tree__toggle-icon" :icon="IconChevronRight" />
        </button>
        <span v-else-if="collapsible" class="au-tree__toggle-placeholder"></span>

        <button
          class="au-tree__label au-control-reset"
          type="button"
          :disabled="isDisabled(item)"
          :tabindex="!isDisabled(item) && (isSelected(item) || isInitialFocusable(item, index)) ? 0 : -1"
          :data-tree-index="index"
          :title="resolveLabel(item)"
          @click="selectItem(item)"
          @keydown="handleItemKeydown($event, item, index)"
        >
          <span class="au-truncate">{{ resolveLabel(item) }}</span>
        </button>
      </div>
    </template>
  </AuVirtualList>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import { IconChevronRight, IconFileText } from '../../icons/internal.js';
import { AuIcon } from '../icon/index.js';
import { AuVirtualList } from '../virtual-list/index.js';

const props = defineProps({
  items: { type: Array, default: () => [] },
  selectedKey: { type: [String, Number], default: null },
  itemKey: { type: String, default: 'id' },
  labelKey: { type: String, default: 'label' },
  disabledKey: { type: String, default: 'disabled' },
  itemHeight: { type: Number, default: 28, validator: (value) => value > 0 },
  overscan: { type: Number, default: 8, validator: (value) => value >= 0 },
  baseIndent: { type: Number, default: 10, validator: (value) => value >= 0 },
  indent: { type: Number, default: 16, validator: (value) => value >= 0 },
  collapsible: { type: Boolean, default: false },
  emptyText: { type: String, default: '暂无数据' },
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

function isDisabled(item) {
  return Boolean(item?.[props.disabledKey]);
}

function isInitialFocusable(item, index) {
  if (isDisabled(item)) return false;
  const selectedIndex = props.items.findIndex((entry) => isSelected(entry) && !isDisabled(entry));
  if (selectedIndex >= 0) return false;
  return props.items.findIndex((entry) => !isDisabled(entry)) === index;
}

function selectItem(item) {
  if (isDisabled(item)) return;
  emit('select', item);
}

async function focusItem(index, direction = 1) {
  const clampedIndex = Math.max(0, Math.min(index, props.items.length - 1));
  let nextIndex = clampedIndex;
  while (props.items[nextIndex] && isDisabled(props.items[nextIndex])) {
    nextIndex += direction;
  }
  if (!props.items[nextIndex]) return;
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
    focusItem(index + 1, 1);
    return;
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    focusItem(index - 1, -1);
    return;
  }
  if (event.key === 'Home') {
    event.preventDefault();
    focusItem(0, 1);
    return;
  }
  if (event.key === 'End') {
    event.preventDefault();
    focusItem(props.items.length - 1, -1);
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

<style scoped lang="scss" src="./AuTree.scss"></style>
