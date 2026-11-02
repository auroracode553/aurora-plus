const namespace = 'http://www.w3.org/2000/svg';

export function createGlassFilter(document) {
  const id = `au-glass-${globalThis.crypto.randomUUID()}`;
  function node(tag, attributes, parent) {
    const element = document.createElementNS(namespace, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
    parent.appendChild(element);
    return element;
  }
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:absolute;pointer-events:none;overflow:hidden';
  const filter = node('filter', { id, filterUnits: 'userSpaceOnUse', 'color-interpolation-filters': 'sRGB' }, svg);
  document.body.appendChild(svg);
  let bandCount = 0;
  let controls;

  function build(count) {
    filter.replaceChildren();
    const blur = node('feGaussianBlur', { in: 'SourceGraphic', result: 'blurred', edgeMode: 'duplicate' }, filter);
    const saturation = node('feColorMatrix', { in: 'blurred', type: 'saturate', result: 'saturated' }, filter);
    const transfer = node('feComponentTransfer', { in: 'saturated', result: 'content' }, filter);
    const brightness = ['R', 'G', 'B'].map((channel) => node(`feFunc${channel}`, { type: 'linear', slope: 1 }, transfer));
    const images = [];
    const displacements = [];
    // 保留七波段 RGB/alpha 权重；各波段预乘后相加，不用简单 RGB 三层代替。
    const weights = [[2 / 7, 0, 0], [2 / 7, 1 / 7, 0], [2 / 7, 2 / 7, 0], [0, 2 / 7, 0], [0, 2 / 7, 1 / 3], [0, 0, 1 / 3], [1 / 7, 0, 1 / 3]];
    for (let index = 0; index < count; index += 1) {
      images.push(node('feImage', { result: `map${index}`, preserveAspectRatio: 'none', x: 0, y: 0 }, filter));
      displacements.push(node('feDisplacementMap', { in: 'content', in2: `map${index}`, xChannelSelector: 'R', yChannelSelector: 'G', result: `sample${index}` }, filter));
      if (count === 1) continue;
      const [r, g, b] = weights[index];
      node('feColorMatrix', { in: `sample${index}`, result: `band${index}`, type: 'matrix', values: `${r} 0 0 0 0 0 ${g} 0 0 0 0 0 ${b} 0 0 0 0 0 0 1` }, filter);
      if (index > 0) node('feComposite', { in: index === 1 ? 'band0' : `sum${index - 1}`, in2: `band${index}`, operator: 'arithmetic', k2: 1, k3: 1, result: `sum${index}` }, filter);
    }
    const rim = node('feImage', { result: 'rim', preserveAspectRatio: 'none', x: 0, y: 0 }, filter);
    const highlight = node('feComposite', { in: count === 1 ? 'sample0' : `sum${count - 1}`, in2: 'rim', operator: 'arithmetic', k2: 1, k3: 1 }, filter);
    controls = { blur, saturation, brightness, images, displacements, rim, highlight };
    bandCount = count;
  }

  return {
    id,
    update(width, height, optics, maps, switchThumb) {
      if (bandCount !== maps.bands.length) build(maps.bands.length);
      const padding = switchThumb ? 0 : Math.ceil(optics.blur * 3 + optics.edge);
      Object.entries({ x: -padding, y: -padding, width: width + padding * 2, height: height + padding * 2 }).forEach(([key, value]) => filter.setAttribute(key, String(value)));
      controls.blur.setAttribute('stdDeviation', String(optics.blur));
      controls.saturation.setAttribute('values', String(optics.saturation));
      controls.brightness.forEach((element) => element.setAttribute('intercept', String(optics.brightness)));
      controls.images.forEach((element, index) => {
        element.setAttribute('href', maps.bands[index]);
        element.setAttribute('width', String(width));
        element.setAttribute('height', String(height));
        controls.displacements[index].setAttribute('scale', String(maps.scale));
      });
      controls.rim.setAttribute('href', maps.rim);
      controls.rim.setAttribute('width', String(width));
      controls.rim.setAttribute('height', String(height));
      controls.highlight.setAttribute('operator', switchThumb ? 'over' : 'arithmetic');
      // Ambient 必须盖在背景之上，保留有方向的黑白轮廓。
      controls.highlight.setAttribute('in', switchThumb ? 'rim' : (bandCount === 1 ? 'sample0' : `sum${bandCount - 1}`));
      controls.highlight.setAttribute('in2', switchThumb ? (bandCount === 1 ? 'sample0' : `sum${bandCount - 1}`) : 'rim');
    },
    destroy() { svg.remove(); },
  };
}
