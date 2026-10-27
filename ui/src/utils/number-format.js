export function normalizePrecision(value) {
  return Math.min(20, Math.max(0, Math.trunc(Number(value) || 0)));
}

export function formatNumberParts(value, { precision = 0, grouping = true, locale = 'en-US' } = {}) {
  if (value == null || !Number.isFinite(value)) return [{ type: 'literal', value: '—' }];
  const options = {
    minimumFractionDigits: normalizePrecision(precision),
    maximumFractionDigits: normalizePrecision(precision),
    useGrouping: grouping, numberingSystem: 'latn',
  };
  try {
    return new Intl.NumberFormat(locale, options).formatToParts(value);
  } catch {
    return new Intl.NumberFormat('en-US', options).formatToParts(value);
  }
}

// 位次作为稳定键；跨越千位、改变小数精度时不让整数与小数串位。
export function numberCells(parts) {
  let integerPosition = parts.filter((part) => part.type === 'integer').reduce((count, part) => count + part.value.length, 0);
  let fractionPosition = 0;
  let separatorPosition = 0;
  return parts.flatMap((part) => [...part.value].map((character) => {
    const digit = /^\d$/.test(character) ? Number(character) : null;
    const key = part.type === 'integer' ? `integer-${--integerPosition}`
      : part.type === 'fraction' ? `fraction-${fractionPosition++}`
        : `${part.type}-${separatorPosition++}`;
    return { key, character, digit, fraction: part.type === 'fraction' };
  }));
}
