export function clampPreviewValue(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(Math.max(number, min), max);
}

export function clampPreviewIndex(value, length) {
  if (length <= 0) return 0;
  return Math.min(Math.max(Math.trunc(Number(value)) || 0, 0), length - 1);
}

export function normalizePreviewImages(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map((item, index) => {
      if (typeof item === 'string') {
        return { src: item, alt: `图片 ${index + 1}`, title: '', raw: item };
      }
      const source = item?.src || item?.url || '';
      return {
        ...item,
        src: source,
        alt: item?.alt || item?.title || `图片 ${index + 1}`,
        title: item?.title || '',
        raw: item,
      };
    })
    .filter((item) => item.src);
}

export function normalizeRotation(value) {
  const rotation = Number(value) || 0;
  return ((rotation % 360) + 360) % 360;
}
