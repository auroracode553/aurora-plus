/** 画板与固定色板共用的颜色解析、归一及 HSV 转换。 */
export function parseColor(color) {
  const value = String(color || '').trim();
  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (hex) {
    const digits = hex[1].length === 3 ? [...hex[1]].map((digit) => digit + digit).join('') : hex[1];
    return [0, 2, 4].map((offset) => Number.parseInt(digits.slice(offset, offset + 2), 16));
  }
  const rgb = value.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (!rgb) return null;
  const channels = rgb.slice(1).map(Number);
  return channels.every((channel) => channel <= 255) ? channels : null;
}

export function normalizeColor(color, fallback = '#ffffff') {
  const channels = parseColor(color) || parseColor(fallback) || [255, 255, 255];
  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

export function colorToHsv(color) {
  const [red, green, blue] = parseColor(normalizeColor(color)).map((channel) => channel / 255);
  const max = Math.max(red, green, blue);
  const delta = max - Math.min(red, green, blue);
  let hue = 0;
  if (delta) {
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
  }
  return { hue: (hue * 60 + 360) % 360, saturation: max ? delta / max : 0, brightness: max };
}

export function hsvToColor({ hue, saturation, brightness }) {
  const sector = ((hue % 360) + 360) % 360 / 60;
  const chroma = brightness * saturation;
  const intermediate = chroma * (1 - Math.abs(sector % 2 - 1));
  const channels = [
    [chroma, intermediate, 0], [intermediate, chroma, 0], [0, chroma, intermediate],
    [0, intermediate, chroma], [intermediate, 0, chroma], [chroma, 0, intermediate],
  ][Math.floor(sector)];
  return `#${channels.map((channel) => Math.round((channel + brightness - chroma) * 255).toString(16).padStart(2, '0')).join('')}`;
}

export const DEFAULT_COLOR_PRESETS = Object.freeze([
  { name: '纯白', color: '#ffffff' }, { name: '雾蓝', color: '#edf1f8' },
  { name: '银灰', color: '#a8b0bd' }, { name: '墨色', color: '#172033' },
  { name: '蓝色', color: '#3478f6' }, { name: '天蓝', color: '#67c6ff' },
  { name: '绿色', color: '#2f9e72' }, { name: '青色', color: '#19c2c2' },
  { name: '金色', color: '#f0b90b' }, { name: '橙色', color: '#f58c24' },
  { name: '玫红', color: '#df4c62' }, { name: '紫色', color: '#8b5cf6' },
].map(Object.freeze));
