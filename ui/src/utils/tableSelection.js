import { computed, ref, watch } from 'vue';
import { getValueByPath } from './tableModel.js';

// 两种表格共用按 rowKey 追踪的选择状态，数据替换后只保留仍存在的行。
export function useTableSelection(props, emit) {
  const selectedKeys = ref(new Set());
  const currentKey = ref(null);
  const rowKey = (row, index) => typeof props.rowKey === 'function'
    ? props.rowKey(row, index)
    : getValueByPath(row, props.rowKey) ?? index;
  const keyedRows = computed(() => props.data.map((row, index) => ({ row, key: rowKey(row, index) })));
  const selection = computed(() => keyedRows.value
    .filter(({ key }) => selectedKeys.value.has(key))
    .map(({ row }) => row));
  const currentRow = computed(() => keyedRows.value.find(({ key }) => Object.is(key, currentKey.value))?.row ?? null);

  function isSelected(row, index) { return selectedKeys.value.has(rowKey(row, index)); }
  function isSelectable(column, row, index) {
    return typeof column.selectable !== 'function' || column.selectable(row, index) !== false;
  }
  function setSelection(nextKeys, row, action) {
    selectedKeys.value = nextKeys;
    if (row) emit('select', selection.value, row);
    if (action === 'all') emit('select-all', selection.value);
    emit('selection-change', selection.value);
  }
  function toggleRowSelection(row, selected, column) {
    const index = props.data.indexOf(row);
    if (index < 0 || (column && !isSelectable(column, row, index))) return;
    const key = rowKey(row, index);
    const next = new Set(selectedKeys.value);
    const shouldSelect = selected ?? !next.has(key);
    if (shouldSelect) next.add(key);
    else next.delete(key);
    if (shouldSelect !== selectedKeys.value.has(key)) setSelection(next, row);
  }
  function clearSelection() {
    if (selectedKeys.value.size) setSelection(new Set());
  }
  function selectionStatus(column) {
    const selectableRows = keyedRows.value.filter(({ row }, index) => isSelectable(column, row, index));
    const selectedCount = selectableRows.filter(({ key }) => selectedKeys.value.has(key)).length;
    return {
      checked: selectableRows.length > 0 && selectedCount === selectableRows.length,
      indeterminate: selectedCount > 0 && selectedCount < selectableRows.length,
      disabled: selectableRows.length === 0,
    };
  }
  function toggleAllSelection(column) {
    const next = new Set(selectedKeys.value);
    const selectAll = !selectionStatus(column).checked;
    keyedRows.value.forEach(({ row, key }, index) => {
      if (!isSelectable(column, row, index)) return;
      if (selectAll) next.add(key);
      else next.delete(key);
    });
    if (next.size !== selectedKeys.value.size) setSelection(next, null, 'all');
  }
  function setCurrentRow(row) {
    const index = props.data.indexOf(row);
    const nextKey = index < 0 ? null : rowKey(row, index);
    if (Object.is(currentKey.value, nextKey)) return;
    const previous = currentRow.value;
    currentKey.value = nextKey;
    emit('current-change', currentRow.value, previous);
  }
  function isCurrent(row, index) { return Object.is(currentKey.value, rowKey(row, index)); }

  watch(keyedRows, (rows, previousRows) => {
    const validKeys = new Set(rows.map(({ key }) => key));
    const next = new Set([...selectedKeys.value].filter((key) => validKeys.has(key)));
    if (next.size !== selectedKeys.value.size) setSelection(next);
    if (currentKey.value !== null && !validKeys.has(currentKey.value)) {
      const previous = previousRows?.find(({ key }) => Object.is(key, currentKey.value))?.row ?? null;
      currentKey.value = null;
      emit('current-change', null, previous);
    }
  });

  return {
    selection, currentRow, isSelected, isSelectable, selectionStatus, isCurrent,
    toggleRowSelection, toggleAllSelection, clearSelection, setCurrentRow,
  };
}
