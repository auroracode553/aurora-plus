<template>
  <div
    ref="scrollContainerRef"
    class="au-virtual-table au-component au-surface-frame au-surface-frame--rounded au-scroll-region au-thin-scrollbar au-focus-ring au-focus-ring--tight"
    :class="{ 'has-border': border, 'is-striped': stripe, 'is-loading': loading }"
    :style="rootStyle"
    role="grid"
    :aria-label="ariaLabel"
    :aria-rowcount="sortedRows.length + 1"
    :aria-colcount="resolvedColumns.length"
    :aria-busy="loading ? 'true' : undefined"
    tabindex="0"
    @scroll.passive="handleScroll"
  >
    <div class="au-virtual-table__canvas" :style="canvasStyle">
      <div
        class="au-virtual-table__header au-forced-canvas"
        :style="headerStyle"
        role="row"
        aria-rowindex="1"
      >
        <div
          v-for="(column, columnIndex) in resolvedColumns"
          :key="column.key"
          class="au-virtual-table__header-cell"
          :class="[getColumnClasses(column), { 'au-forced-canvas': column.fixed }]"
          :style="getColumnStyle(column)"
          role="columnheader"
          :aria-colindex="columnIndex + 1"
          :aria-sort="getAriaSort(column)"
        >
          <button
            v-if="column.sortable"
            class="au-virtual-table__sort-button au-control-reset au-focus-ring"
            type="button"
            :style="{ justifyContent: getJustifyContent(column.align) }"
            @click="toggleSort(column)"
          >
            <slot :name="`header-${column.key}`" :column="column">
              <span class="au-virtual-table__cell-text au-truncate">{{ column.title ?? column.label ?? '' }}</span>
            </slot>
            <AuIcon class="au-virtual-table__sort-icon au-meta-muted" :icon="getSortIcon(column)" />
          </button>
          <slot v-else :name="`header-${column.key}`" :column="column">
            <span class="au-virtual-table__cell-text au-truncate">{{ column.title ?? column.label ?? '' }}</span>
          </slot>
        </div>
      </div>

      <div v-if="sortedRows.length === 0" class="au-virtual-table__empty au-grid-center" :style="emptyStyle">
        <slot name="empty">{{ emptyText }}</slot>
      </div>

      <template v-else>
        <div
          v-for="entry in visibleRows"
          :key="resolveRowKey(entry)"
          class="au-virtual-table__row au-motion-reduce"
          :class="[
            resolveRowClass(entry),
            { 'is-striped-row': stripe && entry.visibleIndex % 2 === 1 },
          ]"
          :style="getRowStyle(entry.visibleIndex)"
          role="row"
          :aria-rowindex="entry.visibleIndex + 2"
          @click="emit('row-click', entry.row, entry.sourceIndex, $event)"
          @dblclick="emit('row-dblclick', entry.row, entry.sourceIndex, $event)"
        >
          <div
            v-for="(column, columnIndex) in resolvedColumns"
            :key="column.key"
            class="au-virtual-table__cell"
            :class="[getColumnClasses(column), { 'au-forced-canvas': column.fixed }]"
            :style="getColumnStyle(column)"
            role="gridcell"
            :aria-colindex="columnIndex + 1"
            @click="emit('cell-click', entry.row, column, entry.sourceIndex, $event)"
          >
            <slot
              :name="`cell-${column.key}`"
              :row="entry.row"
              :column="column"
              :value="getCellValue(entry.row, column)"
              :index="entry.sourceIndex"
            >
              <span class="au-virtual-table__cell-text au-truncate">
                {{ formatCell(entry.row, column, entry.sourceIndex) }}
              </span>
            </slot>
          </div>
        </div>
      </template>
    </div>

    <div
      v-if="loading"
      class="au-virtual-table__loading au-material-surface au-depth-surface au-forced-canvas"
      aria-live="polite"
    >
      <slot name="loading">
        <AuIcon class="au-spin" :icon="IconLoader2" />
        <span>{{ loadingText }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { IconArrowDown, IconArrowUp, IconArrowsSort, IconLoader2 } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';
import {
  getValueByPath,
  resolveTableColumns,
  sortTableRows,
} from './virtual-table-utils.js';

const props = defineProps({
  columns: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] },
  width: { type: [String, Number], default: '100%' },
  height: { type: [String, Number], default: 400 },
  rowHeight: { type: Number, default: 40, validator: (value) => value > 0 },
  headerHeight: { type: Number, default: 36, validator: (value) => value > 0 },
  overscan: { type: Number, default: 6, validator: (value) => value >= 0 },
  rowKey: { type: [String, Function], default: 'id' },
  rowClass: { type: [String, Function], default: '' },
  sortBy: { type: Object, default: null },
  defaultSort: { type: Object, default: () => ({ key: '', order: '' }) },
  remoteSort: { type: Boolean, default: false },
  stripe: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: '加载中' },
  emptyText: { type: String, default: '暂无数据' },
  ariaLabel: { type: String, default: '虚拟表格' },
});

const emit = defineEmits([
  'update:sortBy',
  'sort-change',
  'scroll',
  'rows-rendered',
  'row-click',
  'row-dblclick',
  'cell-click',
]);

const scrollContainerRef = ref(null);
const scrollTop = ref(0);
const scrollLeft = ref(0);
const viewportWidth = ref(0);
const viewportHeight = ref(0);
const innerSort = ref(normalizeSort(props.sortBy || props.defaultSort));
let resizeObserver = null;
let listeningWindowResize = false;

const resolvedColumns = computed(() => resolveTableColumns(props.columns, viewportWidth.value));
const tableWidth = computed(() => resolvedColumns.value.reduce(
  (sum, column) => sum + column.resolvedWidth,
  0,
));
const gridTemplateColumns = computed(() => resolvedColumns.value
  .map((column) => `${column.resolvedWidth}px`)
  .join(' '));
const sortedRows = computed(() => {
  if (props.remoteSort) return props.data.map((row, index) => ({ row, sourceIndex: index }));
  return sortTableRows(props.data, resolvedColumns.value, innerSort.value);
});
const visibleRange = computed(() => {
  const bodyScrollTop = Math.max(scrollTop.value - props.headerHeight, 0);
  const visibleHeight = Math.max(viewportHeight.value - props.headerHeight, props.rowHeight);
  const start = Math.max(Math.floor(bodyScrollTop / props.rowHeight) - props.overscan, 0);
  const count = Math.ceil(visibleHeight / props.rowHeight) + props.overscan * 2;
  return { start, end: Math.min(start + count, sortedRows.value.length) };
});
const visibleRows = computed(() => sortedRows.value
  .slice(visibleRange.value.start, visibleRange.value.end)
  .map((entry, localIndex) => ({
    ...entry,
    visibleIndex: visibleRange.value.start + localIndex,
  })));
const rootStyle = computed(() => ({
  width: formatSize(props.width),
  height: formatSize(props.height),
}));
const canvasStyle = computed(() => ({
  width: `${Math.max(tableWidth.value, viewportWidth.value)}px`,
  height: `${props.headerHeight + sortedRows.value.length * props.rowHeight}px`,
}));
const headerStyle = computed(() => ({
  height: `${props.headerHeight}px`,
  gridTemplateColumns: gridTemplateColumns.value,
}));
const emptyStyle = computed(() => ({ top: `${props.headerHeight}px` }));

function formatSize(value) {
  return typeof value === 'number' ? `${value}px` : value;
}

function normalizeSort(value) {
  const key = value?.key ?? value?.columnKey ?? '';
  const order = ['ascending', 'descending'].includes(value?.order) ? value.order : '';
  return { key, order };
}

function getCellValue(row, column) {
  return getValueByPath(row, column.dataKey);
}

function formatCell(row, column, index) {
  const value = getCellValue(row, column);
  if (typeof column.formatter === 'function') return column.formatter(row, column, value, index);
  return value == null ? '' : String(value);
}

function getRowStyle(index) {
  return {
    height: `${props.rowHeight}px`,
    gridTemplateColumns: gridTemplateColumns.value,
    transform: `translateY(${props.headerHeight + index * props.rowHeight}px)`,
  };
}

function getColumnStyle(column) {
  const style = { textAlign: column.align };
  if (column.fixedSide) {
    style[column.fixedSide] = `${column.fixedOffset}px`;
    style.zIndex = 2;
  }
  return style;
}

function getColumnClasses(column) {
  return [
    `is-align-${column.align}`,
    column.class,
    { 'is-fixed': Boolean(column.fixedSide) },
  ];
}

function getJustifyContent(align) {
  if (align === 'center') return 'center';
  if (align === 'right') return 'flex-end';
  return 'flex-start';
}

function resolveRowKey(entry) {
  if (typeof props.rowKey === 'function') return props.rowKey(entry.row, entry.sourceIndex);
  return getValueByPath(entry.row, props.rowKey) ?? entry.sourceIndex;
}

function resolveRowClass(entry) {
  if (typeof props.rowClass === 'function') return props.rowClass({
    row: entry.row,
    rowIndex: entry.sourceIndex,
  });
  return props.rowClass;
}

function getAriaSort(column) {
  if (!column.sortable || innerSort.value.key !== column.key) return undefined;
  return innerSort.value.order || 'none';
}

function getSortIcon(column) {
  if (innerSort.value.key !== column.key || !innerSort.value.order) return IconArrowsSort;
  return innerSort.value.order === 'ascending' ? IconArrowUp : IconArrowDown;
}

function toggleSort(column) {
  const currentOrder = innerSort.value.key === column.key ? innerSort.value.order : '';
  const nextOrder = currentOrder === ''
    ? 'ascending'
    : (currentOrder === 'ascending' ? 'descending' : '');
  const nextSort = { key: nextOrder ? column.key : '', order: nextOrder };
  innerSort.value = nextSort;
  emit('update:sortBy', nextSort);
  emit('sort-change', { ...nextSort, column });
  scrollToTop();
}

function handleScroll(event) {
  scrollTop.value = event.currentTarget.scrollTop;
  scrollLeft.value = event.currentTarget.scrollLeft;
  emit('scroll', {
    scrollTop: scrollTop.value,
    scrollLeft: scrollLeft.value,
    event,
  });
}

function updateViewport() {
  const element = scrollContainerRef.value;
  if (!element) return;
  viewportWidth.value = element.clientWidth;
  viewportHeight.value = element.clientHeight;
  syncScrollBounds();
}

function syncScrollBounds() {
  const element = scrollContainerRef.value;
  if (!element) return;
  const maxTop = Math.max(props.headerHeight + sortedRows.value.length * props.rowHeight - viewportHeight.value, 0);
  if (element.scrollTop > maxTop) scrollTo({ scrollTop: maxTop });
}

function bindResizeObserver() {
  updateViewport();
  if (typeof ResizeObserver !== 'undefined' && scrollContainerRef.value) {
    resizeObserver = new ResizeObserver(updateViewport);
    resizeObserver.observe(scrollContainerRef.value);
  } else if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateViewport);
    listeningWindowResize = true;
  }
}

function scrollTo(options = {}) {
  const element = scrollContainerRef.value;
  if (!element) return;
  element.scrollTo({
    top: options.scrollTop ?? element.scrollTop,
    left: options.scrollLeft ?? element.scrollLeft,
    behavior: options.behavior || 'auto',
  });
}

function scrollToTop(scrollTopValue = 0) {
  scrollTo({ scrollTop: Math.max(Number(scrollTopValue) || 0, 0) });
}

function scrollToLeft(scrollLeftValue = 0) {
  scrollTo({ scrollLeft: Math.max(Number(scrollLeftValue) || 0, 0) });
}

function scrollToRow(index, align = 'auto') {
  const safeIndex = Math.max(0, Math.min(Math.trunc(index), Math.max(sortedRows.value.length - 1, 0)));
  const rowTop = props.headerHeight + safeIndex * props.rowHeight;
  const rowBottom = rowTop + props.rowHeight;
  const viewportTop = scrollTop.value + props.headerHeight;
  const viewportBottom = scrollTop.value + viewportHeight.value;
  let target = rowTop - props.headerHeight;
  if (align === 'center') {
    const bodyHeight = Math.max(viewportHeight.value - props.headerHeight, props.rowHeight);
    target = rowTop - props.headerHeight - (bodyHeight - props.rowHeight) / 2;
  } else if (align === 'end') target = rowBottom - viewportHeight.value;
  else if (align === 'auto') {
    if (rowTop >= viewportTop && rowBottom <= viewportBottom) return;
    target = rowTop < viewportTop ? rowTop - props.headerHeight : rowBottom - viewportHeight.value;
  }
  scrollToTop(target);
}

watch(
  () => props.sortBy,
  (value) => {
    if (value) innerSort.value = normalizeSort(value);
  },
  { deep: true },
);

watch(
  () => [props.data.length, props.rowHeight, props.headerHeight],
  syncScrollBounds,
);

watch(
  visibleRange,
  (range) => emit('rows-rendered', { ...range }),
  { immediate: true },
);

onMounted(bindResizeObserver);
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (listeningWindowResize && typeof window !== 'undefined') {
    window.removeEventListener('resize', updateViewport);
  }
});

defineExpose({
  scrollContainerRef,
  scrollTo,
  scrollToLeft,
  scrollToRow,
  scrollToTop,
});
</script>

<style scoped>
.au-virtual-table {
  position: relative;
  min-width: 0;
  max-width: 100%;
  color: var(--au-color-text-default);
  background: transparent;
  font-size: 13px;
  contain: strict;
}

.au-virtual-table__canvas {
  position: relative;
  min-width: 100%;
}

.au-virtual-table__header,
.au-virtual-table__row {
  display: grid;
  width: 100%;
}

.au-virtual-table__header {
  position: sticky;
  top: 0;
  z-index: 4;
  color: var(--au-color-text-primary);
  background: var(--au-material-background-elevated);
  font-weight: var(--au-font-weight-semibold);
}

.au-virtual-table__row {
  position: absolute;
  top: 0;
  left: 0;
  transition: background var(--au-transition-duration) var(--au-transition-timing);
}

.au-virtual-table__row:hover {
  background: var(--au-color-background-hover);
}

.au-virtual-table__row.is-striped-row {
  background: color-mix(in srgb, var(--au-color-text-primary) 2.5%, transparent);
}

.au-virtual-table__header-cell,
.au-virtual-table__cell {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 100%;
  padding: 0 10px;
  overflow: hidden;
  border-bottom: 1px solid var(--au-material-border);
}

.au-virtual-table.has-border .au-virtual-table__header-cell,
.au-virtual-table.has-border .au-virtual-table__cell {
  border-right: 1px solid var(--au-material-border);
}

.au-virtual-table__header-cell.is-fixed,
.au-virtual-table__cell.is-fixed {
  position: sticky;
  background: var(--au-material-background-elevated);
}

.au-virtual-table__row:hover .au-virtual-table__cell.is-fixed {
  background: color-mix(in srgb, var(--au-color-text-primary) 7%, var(--au-material-background-elevated));
}

.au-virtual-table__sort-button {
  display: flex;
  align-items: center;
  width: calc(100% + 12px);
  height: calc(100% - 4px);
  gap: 5px;
  margin: 0 -6px;
  padding: 0 6px;
  border-radius: var(--au-radius-compact);
  cursor: pointer;
}

.au-virtual-table__sort-button:hover {
  color: var(--au-color-primary);
  background: var(--au-color-background-hover);
}

.au-virtual-table__empty {
  position: sticky;
  left: 0;
  width: 100%;
  min-height: 96px;
  color: var(--au-color-text-secondary);
}

.au-virtual-table__loading {
  position: sticky;
  left: 0;
  bottom: 8px;
  z-index: 5;
  display: flex;
  align-items: center;
  width: max-content;
  gap: 6px;
  margin: -38px auto 8px;
  padding: 6px 10px;
  border: 1px solid var(--au-material-border);
  border-radius: var(--au-radius-pill);
  color: var(--au-color-text-primary);
}

@media (prefers-contrast: more) {
  .au-virtual-table__header-cell,
  .au-virtual-table__cell {
    border-color: var(--au-material-border-emphasis);
  }
}

</style>
