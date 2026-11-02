import { clamp } from './motion.js';

// 与技能快照 HyperGlassOptics / hyper_glass.frag 的距离场、圆弧和七波段逐式对应。
// Web 无法向 backdrop 注入 RuntimeShader，故生成位移纹理，交给 Chromium SVG 合成器采样。
export function getGlassOptics(role, progress = 0, dark = false) {
  const p = clamp(progress);
  const common = { dispersion: 0, depth: 0, saturation: 1, brightness: 0, highlight: 1, stroke: 0.5 };
  if (role === 'button') return { ...common, blur: 8 - 2 * p, edge: 12 + 2 * p, amount: 16 + 2 * p, highlight: 1 + p };
  if (role === 'dialog') return { ...common, blur: dark ? 8 : 16, edge: 24, amount: 48, depth: 1, saturation: 1.5, brightness: dark ? 0 : 0.2 };
  if (role === 'selection') return { ...common, blur: 0, edge: 10 * p, amount: 14 * p, dispersion: p, highlight: p };
  if (role === 'thumb') return { ...common, blur: 8 * (1 - p), edge: 10 * p, amount: 14 * p, dispersion: p, highlight: p };
  if (role === 'switch') return { ...common, blur: 8 * (1 - p), edge: 5 * p, amount: 10 * p, dispersion: p > 0 ? 1 : 0, highlight: 0, ambient: p };
  return { ...common, blur: 8, edge: 24, amount: 24 };
}

function normal(x, y) {
  const length = Math.max(Math.hypot(x, y), 0.0001);
  return [x / length, y / length];
}

function gradient(x, y, halfWidth, halfHeight, radius) {
  const qx = Math.abs(x) - halfWidth + radius;
  const qy = Math.abs(y) - halfHeight + radius;
  if (qx >= 0 || qy >= 0) {
    const [nx, ny] = normal(Math.max(qx, 0), Math.max(qy, 0));
    return [Math.sign(x) * nx, Math.sign(y) * ny];
  }
  return qx >= qy ? [Math.sign(x), 0] : [0, Math.sign(y)];
}

export function createOpticalMaps(document, width, height, radii, optics, ratio = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil(width * ratio));
  canvas.height = Math.max(1, Math.ceil(height * ratio));
  const context = canvas.getContext('2d');
  if (!context) return null;
  const bands = optics.dispersion > 0 ? [1, 2 / 3, 1 / 3, 0, -1 / 3, -2 / 3, -1] : [0];
  const maps = bands.map(() => context.createImageData(canvas.width, canvas.height));
  const rim = context.createImageData(canvas.width, canvas.height);
  let ambientMask;
  if (optics.ambient) {
    // 先模糊描边遮罩、再按法线着色，避免把方向性的黑白结果一起模糊。
    context.save();
    context.scale(ratio, ratio);
    context.beginPath();
    context.roundRect(0, 0, width, height, radii);
    context.clip();
    context.strokeStyle = '#fff';
    context.lineWidth = Math.ceil(0.5 / 1.5 * ratio) * 2 / ratio;
    context.filter = `blur(${0.25 / 1.5 * ratio}px)`;
    context.stroke();
    context.restore();
    ambientMask = context.getImageData(0, 0, canvas.width, canvas.height).data;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const scale = Math.max(1, optics.amount * 4);
  for (let row = 0; row < canvas.height; row += 1) {
    const y = (row + 0.5) / ratio - halfHeight;
    for (let column = 0; column < canvas.width; column += 1) {
      const x = (column + 0.5) / ratio - halfWidth;
      const radius = x < 0 ? (y < 0 ? radii[0] : radii[3]) : (y < 0 ? radii[1] : radii[2]);
      const qx = Math.abs(x) - halfWidth + radius;
      const qy = Math.abs(y) - halfHeight + radius;
      const distance = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
      const [nx, ny] = gradient(x, y, halfWidth, halfHeight, Math.min(radius * 1.5, halfWidth, halfHeight));
      let shiftX = 0;
      let shiftY = 0;
      if (optics.edge > 0 && optics.amount > 0 && -distance < optics.edge) {
        const fraction = clamp(1 + Math.min(distance, 0) / optics.edge);
        const arc = -(1 - Math.sqrt(Math.max(1 - fraction * fraction, 0))) * optics.amount;
        const [px, py] = normal(x, y);
        const [dx, dy] = normal(nx + optics.depth * px, ny + optics.depth * py);
        shiftX = arc * dx;
        shiftY = arc * dy;
      }
      const spread = optics.dispersion * x * y / Math.max(halfWidth * halfHeight, 1);
      const offset = (row * canvas.width + column) * 4;
      bands.forEach((band, index) => {
        const pixels = maps[index].data;
        pixels[offset] = Math.round(clamp(0.5 + shiftX * (1 + band * spread) / scale) * 255);
        pixels[offset + 1] = Math.round(clamp(0.5 + shiftY * (1 + band * spread) / scale) * 255);
        pixels[offset + 2] = 128;
        pixels[offset + 3] = 255;
      });
      const smooth = clamp((Math.abs(distance + optics.stroke) - optics.stroke * 0.5) / optics.stroke);
      const intensity = (1 - smooth * smooth * (3 - 2 * smooth)) * optics.highlight;
      const light = (nx + ny) * Math.SQRT1_2;
      const ambient = optics.ambient || 0;
      const color = ambient ? (light >= 0 ? 255 : 0) : 255;
      rim.data.set([color, color, color, Math.round(clamp(ambient
        ? 0.38 * ambient * ambientMask[offset + 3] / 255 * Math.abs(light)
        : intensity * Math.abs(light) * 0.5) * 255)], offset);
    }
  }
  function encode(data) { context.putImageData(data, 0, 0); return canvas.toDataURL(); }
  return { bands: maps.map(encode), rim: encode(rim), scale };
}
