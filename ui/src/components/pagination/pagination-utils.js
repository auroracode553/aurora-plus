export function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(Math.max(Math.trunc(number), min), max);
}

export function getPageCount({ pageCount, total, pageSize }) {
  if (pageCount != null && Number.isFinite(Number(pageCount))) {
    return Math.max(Math.trunc(Number(pageCount)), 0);
  }
  const size = Math.max(Math.trunc(Number(pageSize)) || 1, 1);
  return Math.max(Math.ceil(Math.max(Number(total) || 0, 0) / size), 0);
}

export function buildPagerItems(currentPage, pageCount, pagerCount = 7) {
  if (pageCount <= 0) return [];
  const visibleCount = normalizePagerCount(pagerCount);
  if (pageCount <= visibleCount) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const edgePageCount = visibleCount - 2;
  if (currentPage <= visibleCount - 3) {
    return [
      ...Array.from({ length: edgePageCount }, (_, index) => index + 1),
      'next-more',
      pageCount,
    ];
  }
  if (currentPage >= pageCount - visibleCount + 4) {
    return [
      1,
      'prev-more',
      ...Array.from(
        { length: edgePageCount },
        (_, index) => pageCount - edgePageCount + index + 1,
      ),
    ];
  }

  const middleCount = visibleCount - 4;
  const start = currentPage - Math.floor(middleCount / 2);
  return [
    1,
    'prev-more',
    ...Array.from({ length: middleCount }, (_, index) => start + index),
    'next-more',
    pageCount,
  ];
}

export function parsePaginationLayout(layout) {
  const allowed = new Set(['total', 'sizes', 'prev', 'pager', 'next', 'jumper', 'slot', '->']);
  return String(layout || '')
    .split(',')
    .map((item) => item.trim())
    .filter((item) => allowed.has(item));
}

function normalizePagerCount(value) {
  const count = clampNumber(value, 5, 21);
  return count % 2 === 0 ? count - 1 : count;
}
