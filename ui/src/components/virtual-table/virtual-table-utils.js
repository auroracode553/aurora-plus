function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toPositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

export function getColumnKey(column, index) {
  return column.key ?? column.dataKey ?? `column-${index}`;
}

export function resolveTableColumns(columns, viewportWidth = 0) {
  const normalized = columns.map((column, index) => {
    const minWidth = toPositiveNumber(column.minWidth, 60);
    const maxWidth = toPositiveNumber(column.maxWidth, Number.POSITIVE_INFINITY);
    const baseWidth = clamp(toPositiveNumber(column.width, 120), minWidth, maxWidth);
    return {
      ...column,
      key: getColumnKey(column, index),
      dataKey: column.dataKey ?? column.key ?? '',
      width: baseWidth,
      minWidth,
      maxWidth,
      flexGrow: Math.max(Number(column.flexGrow) || 0, 0),
      align: ['left', 'center', 'right'].includes(column.align) ? column.align : 'left',
    };
  });

  const baseWidth = normalized.reduce((sum, column) => sum + column.width, 0);
  const totalFlex = normalized.reduce((sum, column) => sum + column.flexGrow, 0);
  const extraWidth = Math.max(viewportWidth - baseWidth, 0);
  const withWidths = normalized.map((column) => ({
    ...column,
    resolvedWidth: clamp(
      column.width + (totalFlex > 0 ? extraWidth * column.flexGrow / totalFlex : 0),
      column.minWidth,
      column.maxWidth,
    ),
  }));

  let leftOffset = 0;
  withWidths.forEach((column) => {
    if (column.fixed === true || column.fixed === 'left') {
      column.fixedSide = 'left';
      column.fixedOffset = leftOffset;
      leftOffset += column.resolvedWidth;
    }
  });

  let rightOffset = 0;
  [...withWidths].reverse().forEach((column) => {
    if (column.fixed === 'right') {
      column.fixedSide = 'right';
      column.fixedOffset = rightOffset;
      rightOffset += column.resolvedWidth;
    }
  });

  return withWidths;
}

export function getValueByPath(target, path) {
  if (!path) return undefined;
  const segments = Array.isArray(path)
    ? path
    : String(path).replace(/\[([^\]]+)\]/g, '.$1').split('.').filter(Boolean);
  return segments.reduce((value, segment) => value?.[segment], target);
}

export function sortTableRows(data, columns, sortBy) {
  if (!sortBy?.key || !sortBy.order) return data.map((row, index) => ({ row, sourceIndex: index }));
  const column = columns.find((item) => item.key === sortBy.key);
  if (!column) return data.map((row, index) => ({ row, sourceIndex: index }));

  const direction = sortBy.order === 'descending' ? -1 : 1;
  return data
    .map((row, index) => ({ row, sourceIndex: index }))
    .sort((left, right) => {
      const comparison = typeof column.sortMethod === 'function'
        ? column.sortMethod(left.row, right.row, column)
        : compareValues(
            getValueByPath(left.row, column.dataKey),
            getValueByPath(right.row, column.dataKey),
          );
      return comparison === 0 ? left.sourceIndex - right.sourceIndex : comparison * direction;
    });
}

function compareValues(left, right) {
  if (Object.is(left, right)) return 0;
  if (left == null) return -1;
  if (right == null) return 1;
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  if (left instanceof Date && right instanceof Date) return left.getTime() - right.getTime();
  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
}
