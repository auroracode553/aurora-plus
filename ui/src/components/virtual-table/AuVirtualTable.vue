<template>
  <div
    ref="rootRef"
    class="au-virtual-table au-component"
    :class="{ 'au-surface-frame': border, 'has-border': border, 'is-striped': stripe, 'is-loading': loading, 'is-auto-height': autoHeight, 'has-horizontal-overflow': hasHorizontalOverflow, 'au-hover-scrollbars': showScroll }"
    :style="rootStyle"
  >
    <div
      ref="headerViewportRef"
      class="au-virtual-table__header-viewport"
      :style="headerViewportStyle"
      @scroll.passive="handleHeaderScroll"
    >
      <div
        class="au-virtual-table__header"
        :style="headerStyle"
      >
        <div
          v-for="(column, columnIndex) in resolvedColumns"
          :key="column.key"
          class="au-virtual-table__header-cell"
          :class="[getColumnClasses(column), { 'au-forced-canvas': column.fixed }]"
          :style="getColumnStyle(column)"
        >
          <AuCheckbox
            v-if="column.type === 'selection'"
            class="au-virtual-table__checkbox"
            :model-value="selectionStates.get(column.key).checked"
            :indeterminate="selectionStates.get(column.key).indeterminate"
            :disabled="selectionStates.get(column.key).disabled"
            @click.stop
            @change="toggleAllSelection(column)"
          />
          <span v-else-if="column.type === 'index'">{{ column.title }}</span>
          <button
            v-else-if="column.sortable"
            class="au-virtual-table__sort-button au-control-reset"
            type="button"
            :style="{ justifyContent: getJustifyContent(column.align) }"
            @click="toggleSort(column)"
          >
            <TableSlot v-if="column.renderHeader" :render="column.renderHeader" :context="{ column }" />
            <span v-else class="au-virtual-table__cell-text au-truncate">{{ column.title }}</span>
            <AuIcon class="au-virtual-table__sort-icon au-meta-muted" :icon="getSortIcon(column)" />
          </button>
          <TableSlot v-else-if="column.renderHeader" :render="column.renderHeader" :context="{ column }" />
          <span v-else class="au-virtual-table__cell-text au-truncate">{{ column.title }}</span>
        </div>
      </div>
    </div>

    <div
      ref="scrollContainerRef"
      class="au-virtual-table__body au-scroll-region au-thin-scrollbar au-table-scrollbar"
      :class="{ 'au-scrollbar-hidden': !showScroll }"
      tabindex="0"
      @scroll.passive="handleScroll"
    >
      <div class="au-virtual-table__canvas" :style="canvasStyle">
        <div v-if="sortedRows.length === 0" class="au-virtual-table__empty au-grid-center" :style="emptyStyle">
          <slot name="empty">{{ emptyText }}</slot>
        </div>

        <template v-else>
          <div
            v-for="entry in visibleRows"
            :key="resolveRowKey(entry)"
            class="au-virtual-table__row"
            :class="[
              resolveRowClass(entry),
              { 'is-striped-row': stripe && entry.visibleIndex % 2 === 1,
                'is-current-row': highlightCurrentRow && isCurrent(entry.row, entry.sourceIndex) },
            ]"
            :style="getRowStyle(entry.visibleIndex)"
            @click="handleRowClick(entry, $event)"
            @dblclick="emit('row-dblclick', entry.row, entry.sourceIndex, $event)"
          >
            <div
              v-for="(column, columnIndex) in resolvedColumns"
              :key="column.key"
              class="au-virtual-table__cell"
              :class="[getColumnClasses(column), { 'au-forced-canvas': column.fixed }]"
              :style="getColumnStyle(column)"
              @click="handleCellClick(entry, column, $event)"
            >
              <AuCheckbox
                v-if="column.type === 'selection'"
                class="au-virtual-table__checkbox"
                :model-value="isSelected(entry.row, entry.sourceIndex)"
                :disabled="!isSelectable(column, entry.row, entry.sourceIndex)"
                @change="toggleRowSelection(entry.row, undefined, column)"
              />
              <span v-else-if="column.type === 'index'">{{ entry.visibleIndex + 1 }}</span>
              <TableSlot v-else-if="column.renderCell" :render="column.renderCell" :context="{ row: entry.row, column, value: getCellValue(entry.row, column), index: entry.sourceIndex }" />
              <span v-else class="au-virtual-table__cell-text au-truncate">{{ formatCell(entry.row, column, entry.sourceIndex) }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div
      v-if="loading"
      class="au-virtual-table__loading au-material-surface au-depth-surface"
      :style="loadingStyle"
    >
      <slot name="loading">
        <AuLoadingSpinner :text="loadingText" />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import { IconArrowDown, IconArrowUp, IconArrowsSort } from '../../icons/internal.js';
import { AuIcon } from '../icon/index.js';
import { AuCheckbox } from '../checkbox/index.js';
import AuLoadingSpinner from '../loading/AuLoadingSpinner.vue';
import { TableSlot } from '../../utils/TableSlot.js';
import { useTableColumns } from '../../utils/tableColumns.js';
import { useTableSelection } from '../../utils/tableSelection.js';
import { formatSize, getValueByPath, normalizeSort, resolveTableColumns, sortTableRows } from '../../utils/tableModel.js';

const props = defineProps({
  data: { type: Array, default: () => [] },
  width: { type: [String, Number], default: '100%' },
  height: { type: [String, Number], default: 400 },
  autoHeight: { type: Boolean, default: false },
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
  showScroll: { type: Boolean, default: false },
  highlightCurrentRow: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: '加载中' },
  emptyText: { type: String, default: '暂无数据' },
});

const emit = defineEmits([
  'update:sortBy',
  'sort-change',
  'scroll',
  'rows-rendered',
  'row-click',
  'row-dblclick',
  'cell-click',
  'select', 'select-all', 'selection-change', 'current-change',
]);

const headerViewportRef = ref(null);
const scrollContainerRef = ref(null);
const rootRef = ref(null);
const scrollTop = ref(0);
const scrollLeft = ref(0);
const viewportWidth = ref(0);
const viewportHeight = ref(0);
const horizontalScrollbarHeight = ref(0);
const frameBorderHeight = ref(0);
const innerSort = ref(normalizeSort(props.sortBy || props.defaultSort));
const declaredColumns = useTableColumns(useSlots());
const {
  selection, currentRow, isSelected, isSelectable, selectionStatus, isCurrent,
  toggleRowSelection, toggleAllSelection: toggleAllRows, clearSelection, setCurrentRow,
} = useTableSelection(props, emit);
let resizeObserver = null;
let listeningWindowResize = false;

const resolvedColumns = computed(() => resolveTableColumns(declaredColumns.value, viewportWidth.value));
const selectionStates = computed(() => new Map(resolvedColumns.value
  .filter((column) => column.type === 'selection')
  .map((column) => [column.key, selectionStatus(column)])));
const tableWidth = computed(() => resolvedColumns.value.reduce(
  (sum, column) => sum + column.resolvedWidth,
  0,
));
// 仅在列宽确实超出视口时启用横向滚动，避免亚像素宽度误差。
const hasHorizontalOverflow = computed(() => viewportWidth.value > 0 && tableWidth.value > viewportWidth.value);
const canvasWidth = computed(() => Math.max(tableWidth.value, viewportWidth.value));
const gridTemplateColumns = computed(() => resolvedColumns.value
  .map((column) => `${column.resolvedWidth}px`)
  .join(' '));
const sortedRows = computed(() => {
  if (props.remoteSort) return props.data.map((row, index) => ({ row, sourceIndex: index }));
  return sortTableRows(props.data, resolvedColumns.value, innerSort.value);
});
const visibleRange = computed(() => {
  // Scroll offsets and viewport measurements now belong to the body only.
  const bodyScrollTop = Math.max(scrollTop.value, 0);
  const visibleHeight = Math.max(viewportHeight.value, props.rowHeight);
  const start = Math.max(Math.floor(bodyScrollTop / props.rowHeight) - props.overscan, 0);
  const end = Math.ceil((bodyScrollTop + visibleHeight) / props.rowHeight) + props.overscan;
  return { start, end: Math.min(end, props.data.length) };
});
const visibleRows = computed(() => sortedRows.value
  .slice(visibleRange.value.start, visibleRange.value.end)
  .map((entry, localIndex) => ({
    ...entry,
    visibleIndex: visibleRange.value.start + localIndex,
  })));
const contentHeight = computed(() => (
  sortedRows.value.length * props.rowHeight
));
const rootStyle = computed(() => ({
  width: formatSize(props.width),
  height: formatSize(props.autoHeight
    ? props.headerHeight + contentHeight.value + horizontalScrollbarHeight.value + frameBorderHeight.value
    : props.height),
}));
const canvasStyle = computed(() => ({
  width: `${canvasWidth.value}px`,
  // CSS fills short tables without feeding rounded viewport heights back into layout.
  height: `${contentHeight.value}px`,
}));
const headerViewportStyle = computed(() => ({
  height: `${props.headerHeight}px`,
  // Match the body's usable width, excluding its native vertical scrollbar.
  width: viewportWidth.value > 0 ? `${viewportWidth.value}px` : '100%',
}));
const headerStyle = computed(() => ({
  height: `${props.headerHeight}px`,
  width: `${canvasWidth.value}px`,
  gridTemplateColumns: gridTemplateColumns.value,
}));
const emptyStyle = computed(() => ({
  top: 0,
  left: `${scrollLeft.value}px`,
  width: `${viewportWidth.value}px`,
  height: '100%',
}));
const loadingStyle = computed(() => ({
  left: `${viewportWidth.value / 2}px`,
  bottom: `${horizontalScrollbarHeight.value + 8}px`,
}));

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
    transform: `translateY(${index * props.rowHeight}px)`,
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
    { 'is-fixed': Boolean(column.fixedSide), 'is-utility': column.type === 'selection' || column.type === 'index' },
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

function handleRowClick(entry, event) {
  if (props.highlightCurrentRow) setCurrentRow(entry.row);
  emit('row-click', entry.row, entry.sourceIndex, event);
}

function handleCellClick(entry, column, event) {
  if (column.type === 'selection') event.stopPropagation();
  emit('cell-click', entry.row, column, entry.sourceIndex, event);
}

function toggleAllSelection(column = resolvedColumns.value.find((item) => item.type === 'selection')) {
  if (column) toggleAllRows(column);
}

function handleScroll(event) {
  scrollTop.value = event.currentTarget.scrollTop;
  scrollLeft.value = event.currentTarget.scrollLeft;
  syncHeaderScroll();
  emit('scroll', {
    scrollTop: scrollTop.value,
    scrollLeft: scrollLeft.value,
    event,
  });
}

function syncHeaderScroll() {
  const header = headerViewportRef.value;
  if (header && header.scrollLeft !== scrollLeft.value) {
    header.scrollLeft = scrollLeft.value;
  }
}

function handleHeaderScroll(event) {
  const body = scrollContainerRef.value;
  const headerScrollLeft = event.currentTarget.scrollLeft;
  // Keyboard focus on an offscreen header must also reveal its body column.
  // Ignore mirrored scroll events so they cannot interrupt smooth body scrolling.
  if (body && headerScrollLeft !== scrollLeft.value) {
    body.scrollLeft = headerScrollLeft;
  }
}

function updateViewport() {
  const element = scrollContainerRef.value;
  if (!element) return;
  const rootElement = rootRef.value;
  frameBorderHeight.value = rootElement ? rootElement.offsetHeight - rootElement.clientHeight : 0;
  viewportWidth.value = element.clientWidth;
  viewportHeight.value = element.clientHeight;
  horizontalScrollbarHeight.value = element.offsetHeight - element.clientHeight;
  syncScrollBounds();
  scrollTop.value = element.scrollTop;
  scrollLeft.value = element.scrollLeft;
}

function syncScrollBounds() {
  const element = scrollContainerRef.value;
  if (!element) return;
  const maxTop = Math.max(contentHeight.value - viewportHeight.value, 0);
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
  const rowTop = safeIndex * props.rowHeight;
  const rowBottom = rowTop + props.rowHeight;
  const viewportTop = scrollTop.value;
  const viewportBottom = scrollTop.value + viewportHeight.value;
  let target = rowTop;
  if (align === 'center') {
    const bodyHeight = Math.max(viewportHeight.value, props.rowHeight);
    target = rowTop - (bodyHeight - props.rowHeight) / 2;
  } else if (align === 'end') target = rowBottom - viewportHeight.value;
  else if (align === 'auto') {
    if (rowTop >= viewportTop && rowBottom <= viewportBottom) return;
    target = rowTop < viewportTop ? rowTop : rowBottom - viewportHeight.value;
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
  () => [props.data.length, props.rowHeight, props.headerHeight, props.width, props.height, props.autoHeight],
  updateViewport,
  { flush: 'post' },
);

watch([viewportWidth, scrollLeft], syncHeaderScroll, { flush: 'post' });

watch(
  visibleRange,
  (range) => emit('rows-rendered', { ...range }),
  { flush: 'post' },
);

onMounted(() => {
  bindResizeObserver();
  emit('rows-rendered', { ...visibleRange.value });
  watch(tableWidth, updateViewport, { flush: 'post' });
});
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
  selection, currentRow, toggleRowSelection, toggleAllSelection, clearSelection, setCurrentRow,
});
</script>

<style scoped lang="scss" src="./AuVirtualTable.scss"></style>
