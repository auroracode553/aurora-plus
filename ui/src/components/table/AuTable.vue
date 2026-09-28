<template>
  <div
    ref="rootRef"
    class="au-table au-component"
    :class="{ 'au-surface-frame': border, 'has-border': border, 'is-striped': stripe, 'is-loading': loading, 'is-auto-height': autoHeight, 'has-horizontal-overflow': hasHorizontalOverflow }"
    :style="{ width: formatSize(width), height: autoHeight ? 'auto' : formatSize(height) }"
  >
    <div ref="scrollContainerRef" class="au-table__scroll au-scroll-region au-thin-scrollbar" @scroll.passive="handleScroll">
      <div class="au-table__content" :style="{ width: `${contentWidth}px` }">
        <div class="au-table__header" :style="{ height: `${headerHeight}px`, gridTemplateColumns }">
          <div
            v-for="column in resolvedColumns"
            :key="column.key"
            class="au-table__header-cell"
            :class="getColumnClasses(column)"
            :style="getColumnStyle(column)"
          >
            <AuCheckbox
              v-if="column.type === 'selection'"
              class="au-table__checkbox"
              :model-value="selectionStates.get(column.key).checked"
              :indeterminate="selectionStates.get(column.key).indeterminate"
              :disabled="selectionStates.get(column.key).disabled"
              @click.stop
              @change="toggleAllSelection(column)"
            />
            <span v-else-if="column.type === 'index'">{{ column.title }}</span>
            <button
              v-else-if="column.sortable"
              type="button"
              class="au-table__sort-button au-control-reset"
              :style="{ justifyContent: getJustifyContent(column.align) }"
              @click="toggleSort(column)"
            >
              <TableSlot v-if="column.renderHeader" :render="column.renderHeader" :context="{ column }" />
              <span v-else>{{ column.title }}</span>
              <AuIcon class="au-table__sort-icon au-meta-muted" :icon="getSortIcon(column)" />
            </button>
            <TableSlot v-else-if="column.renderHeader" :render="column.renderHeader" :context="{ column }" />
            <span v-else>{{ column.title }}</span>
          </div>
        </div>

        <div v-if="sortedRows.length === 0" class="au-table__empty"><slot name="empty">{{ emptyText }}</slot></div>
        <div
          v-for="(entry, index) in sortedRows"
          :key="resolveRowKey(entry)"
          class="au-table__row"
          :class="[resolveRowClass(entry), { 'is-striped-row': stripe && index % 2 === 1, 'is-current-row': highlightCurrentRow && isCurrent(entry.row, entry.sourceIndex) }]"
          :style="{ gridTemplateColumns }"
          :data-table-row-index="index"
          @click="handleRowClick(entry, $event)"
          @dblclick="emit('row-dblclick', entry.row, entry.sourceIndex, $event)"
        >
          <div
            v-for="column in resolvedColumns"
            :key="column.key"
            class="au-table__cell"
            :class="getColumnClasses(column)"
            :style="getColumnStyle(column)"
            @click="handleCellClick(entry, column, $event)"
          >
            <AuCheckbox
              v-if="column.type === 'selection'"
              class="au-table__checkbox"
              :model-value="isSelected(entry.row, entry.sourceIndex)"
              :disabled="!isSelectable(column, entry.row, entry.sourceIndex)"
              @change="toggleRowSelection(entry.row, undefined, column)"
            />
            <span v-else-if="column.type === 'index'">{{ index + 1 }}</span>
            <TableSlot v-else-if="column.renderCell" :render="column.renderCell" :context="{ row: entry.row, column, value: getValueByPath(entry.row, column.dataKey), index: entry.sourceIndex }" />
            <span v-else class="au-table__cell-text">{{ formatCell(entry.row, column, entry.sourceIndex) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="au-table__loading au-material-surface au-depth-surface">
      <slot name="loading"><AuLoadingSpinner :text="loadingText" /></slot>
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
  headerHeight: { type: Number, default: 36, validator: (value) => value > 0 },
  rowKey: { type: [String, Function], default: 'id' },
  rowClass: { type: [String, Function], default: '' },
  sortBy: { type: Object, default: null },
  defaultSort: { type: Object, default: () => ({ key: '', order: '' }) },
  remoteSort: { type: Boolean, default: false },
  stripe: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  highlightCurrentRow: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: '加载中' },
  emptyText: { type: String, default: '暂无数据' },
});
const emit = defineEmits([
  'update:sortBy', 'sort-change', 'scroll', 'rows-rendered',
  'row-click', 'row-dblclick', 'cell-click',
  'select', 'select-all', 'selection-change', 'current-change',
]);

const rootRef = ref(null);
const scrollContainerRef = ref(null);
const viewportWidth = ref(0);
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
const tableWidth = computed(() => resolvedColumns.value.reduce((sum, column) => sum + column.resolvedWidth, 0));
// 列宽未超出视口时，不让取整造成的亚像素误差触发横向滚动条。
const hasHorizontalOverflow = computed(() => viewportWidth.value > 0 && tableWidth.value > viewportWidth.value);
const contentWidth = computed(() => Math.max(tableWidth.value, viewportWidth.value));
const gridTemplateColumns = computed(() => resolvedColumns.value.map((column) => `${column.resolvedWidth}px`).join(' '));
const sortedRows = computed(() => props.remoteSort
  ? props.data.map((row, index) => ({ row, sourceIndex: index }))
  : sortTableRows(props.data, resolvedColumns.value, innerSort.value));

function formatCell(row, column, index) {
  const value = getValueByPath(row, column.dataKey);
  if (typeof column.formatter === 'function') return column.formatter(row, column, value, index);
  return value == null ? '' : String(value);
}

function getColumnClasses(column) {
  return [`is-align-${column.align}`, column.class, { 'is-fixed': Boolean(column.fixedSide), 'is-utility': column.type === 'selection' || column.type === 'index' }];
}

function getColumnStyle(column) {
  const style = { textAlign: column.align };
  if (column.fixedSide) {
    style[column.fixedSide] = `${column.fixedOffset}px`;
    style.zIndex = 2;
  }
  return style;
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
  if (typeof props.rowClass === 'function') return props.rowClass({ row: entry.row, rowIndex: entry.sourceIndex });
  return props.rowClass;
}

function getSortIcon(column) {
  if (innerSort.value.key !== column.key || !innerSort.value.order) return IconArrowsSort;
  return innerSort.value.order === 'ascending' ? IconArrowUp : IconArrowDown;
}

function toggleSort(column) {
  const currentOrder = innerSort.value.key === column.key ? innerSort.value.order : '';
  const nextOrder = currentOrder === '' ? 'ascending' : currentOrder === 'ascending' ? 'descending' : '';
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
  emit('scroll', {
    scrollTop: event.currentTarget.scrollTop,
    scrollLeft: event.currentTarget.scrollLeft,
    event,
  });
}

function updateViewport() {
  viewportWidth.value = scrollContainerRef.value?.clientWidth || 0;
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

function scrollToTop(value = 0) { scrollTo({ scrollTop: Math.max(Number(value) || 0, 0) }); }
function scrollToLeft(value = 0) { scrollTo({ scrollLeft: Math.max(Number(value) || 0, 0) }); }

function scrollToRow(index, align = 'auto') {
  const safeIndex = Math.max(0, Math.min(Math.trunc(index), sortedRows.value.length - 1));
  const rowElement = scrollContainerRef.value?.querySelector(`[data-table-row-index="${safeIndex}"]`);
  if (!rowElement) return;
  const container = scrollContainerRef.value;
  const rowTop = rowElement.offsetTop;
  const rowBottom = rowTop + rowElement.offsetHeight;
  let target = rowTop;
  if (align === 'center') target = rowTop - (container.clientHeight - rowElement.offsetHeight) / 2;
  else if (align === 'end') target = rowBottom - container.clientHeight;
  else if (align === 'auto') {
    if (rowTop >= container.scrollTop && rowBottom <= container.scrollTop + container.clientHeight) return;
    target = rowTop < container.scrollTop ? rowTop : rowBottom - container.clientHeight;
  }
  scrollToTop(target);
}

function getRowFromEvent(event) {
  const rowElement = event?.target instanceof Element ? event.target.closest('[data-table-row-index]') : null;
  if (!rowElement || !rootRef.value?.contains(rowElement)) return null;
  return sortedRows.value[Number(rowElement.dataset.tableRowIndex)]?.row ?? null;
}

watch(() => props.sortBy, (value) => { if (value) innerSort.value = normalizeSort(value); }, { deep: true });
watch([() => props.data, () => props.data.length, innerSort], () => {
  emit('rows-rendered', { start: 0, end: props.data.length });
});
onMounted(() => {
  emit('rows-rendered', { start: 0, end: props.data.length });
  updateViewport();
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateViewport);
    resizeObserver.observe(scrollContainerRef.value);
  } else if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateViewport);
    listeningWindowResize = true;
  }
});
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  if (listeningWindowResize) window.removeEventListener('resize', updateViewport);
});

defineExpose({
  scrollContainerRef, scrollTo, scrollToTop, scrollToLeft, scrollToRow, getRowFromEvent,
  selection, currentRow, toggleRowSelection, toggleAllSelection, clearSelection, setCurrentRow,
});
</script>

<style scoped lang="scss" src="./AuTable.scss"></style>
