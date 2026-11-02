import { createGlassFilter } from './filter.js';
import { createOpticalMaps, getGlassOptics } from './optics.js';
import { clamp, createPressMotion, prefersReducedMotion } from './motion.js';

// 公开的 DOM 适配器；Vue 控件和宿主注入的 SDK 浮层共用同一光学实现。
export function createAuroraGlassSurface(element, initialOptions = {}) {
  const document = element.ownerDocument;
  const view = document.defaultView;
  let options = { role: 'navigation', progress: 0, enabled: true, ...initialOptions };
  let geometry;
  let filter;
  let disposed = false;
  let key = '';
  let pointer = null;
  let frame = 0;
  let visible = false;
  const original = new Map();
  const written = new Map();
  const chromium = /Chrom(?:e|ium)\//.test(view.navigator.userAgent);
  const supported = chromium && view.CSS.supports('backdrop-filter', 'url("#glass")');
  const outline = document.createElement('span');
  outline.setAttribute('contenteditable', 'false');
  outline.style.cssText = 'position:absolute;inset:0;pointer-events:none;border-radius:inherit;padding:0.5px;z-index:2;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude';
  element.appendChild(outline);

  function write(property, value) {
    if (!original.has(property)) original.set(property, element.style[property]);
    element.style[property] = value;
    written.set(property, element.style[property]);
  }

  function measure() {
    const style = view.getComputedStyle(element);
    if (style.position === 'static') write('position', 'relative');
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const radius = (value) => value.includes('%') ? Math.min(width, height) * parseFloat(value) / 100 : parseFloat(value) || 0;
    geometry = {
      width, height,
      radii: [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius]
        .map((value) => Math.min(radius(value), width / 2, height / 2)),
      dark: style.colorScheme === 'dark',
    };
    key = '';
    render();
  }

  function render() {
    if (disposed || !geometry) return;
    const { width, height, radii, dark } = geometry;
    const p = clamp(options.progress);
    const enabled = options.enabled !== false;
    const role = options.role;
    const explicitBorder = ['border', 'borderColor', 'borderWidth', 'borderStyle'].some((property) => element.style[property]);
    outline.hidden = !enabled || !['button', 'navigation', 'dialog'].includes(role) || options.outline === false || explicitBorder;
    const intensity = role === 'button' ? 0.5 + 0.5 * p : 0.5;
    outline.style.background = `linear-gradient(135deg,rgba(255,255,255,${0.6 * intensity}),rgba(255,255,255,${0.04 * intensity}) 50%,rgba(255,255,255,${0.5 * intensity}))`;
    if (role === 'button') {
      write('boxShadow', enabled && options.shadow !== false ? `0 0 ${6 - 1.5 * p}px rgba(0,0,0,${dark ? 0.18 : 0.08})` : 'none');
      if (options.interactive) {
        write('scale', String(prefersReducedMotion() || !enabled ? 1 : 1 - 0.025 * p));
        write('opacity', enabled ? String(1 - 0.08 * p) : original.get('opacity') || '');
      }
    }
    if (role === 'selection') {
      write('backgroundColor', `rgba(${dark ? '255,255,255' : '0,0,0'},${0.1 * (1 - p)})`);
      write('backgroundImage', `linear-gradient(rgba(0,0,0,${0.03 * p}),rgba(0,0,0,${0.03 * p}))`);
      write('boxShadow', `0 0 8px rgba(0,0,0,${(dark ? 0.18 : 0.08) * p}),inset 0 0 ${8 * p}px rgba(0,0,0,${0.12 * p})`);
    }
    if (role === 'switch' || role === 'thumb') {
      write('backgroundColor', `rgba(255,255,255,${enabled ? 1 - p : 1})`);
      write('boxShadow', role === 'switch'
        ? `0 ${4 / 6}px 4px rgba(0,0,0,.05),inset 0 ${4 * p}px ${4 * p}px rgba(0,0,0,${0.15 * p})`
        : `0 0 4px rgba(0,0,0,${dark ? 0.18 : 0.08}),inset 0 0 ${4 * p}px rgba(0,0,0,${0.12 * p})`);
    }
    if (!enabled || options.sample === false || !width || !height) {
      write('backdropFilter', 'none');
      return;
    }
    const optics = getGlassOptics(role, p, dark);
    const fallback = `blur(${optics.blur}px) saturate(${optics.saturation})`;
    if (!supported || !visible) { write('backdropFilter', fallback); return; }
    const nextKey = JSON.stringify([width, height, radii, optics]);
    if (nextKey === key && filter) { write('backdropFilter', `url("#${filter.id}")`); return; }
    const ratio = Math.min(2, Math.max(1, view.devicePixelRatio || 1), Math.sqrt(1048576 / (width * height)));
    const maps = createOpticalMaps(document, width, height, radii, optics, ratio);
    if (!maps) { write('backdropFilter', fallback); return; }
    if (!filter) filter = createGlassFilter(document);
    filter.update(width, height, optics, maps, role === 'switch');
    write('backdropFilter', `url("#${filter.id}")`);
    key = nextKey;
  }

  const press = createPressMotion((progress) => {
    options.progress = progress;
    render();
  }, view);
  function available() { return options.interactive && options.enabled !== false && !element.disabled; }
  function down(event) {
    if (!available() || pointer !== null || !event.isPrimary || event.button > 0) return;
    pointer = event.pointerId;
    press.set(true);
  }
  function release(event) {
    if (event.pointerId !== pointer) return;
    pointer = null;
    press.set(false);
  }
  function leave(event) { if (event.pointerId === pointer) { pointer = null; press.set(false); } }
  function keydown(event) { if (available() && !event.repeat && [' ', 'Enter'].includes(event.key)) press.set(true); }
  function keyup(event) { if ([' ', 'Enter'].includes(event.key)) press.set(false); }
  function blur() { pointer = null; press.set(false); }
  element.addEventListener('pointerdown', down);
  element.addEventListener('pointerleave', leave);
  element.addEventListener('keydown', keydown);
  element.addEventListener('keyup', keyup);
  element.addEventListener('blur', blur);
  view.addEventListener('pointerup', release);
  view.addEventListener('pointercancel', release);
  view.addEventListener('blur', blur);
  function scheduleMeasure() {
    view.cancelAnimationFrame(frame);
    frame = view.requestAnimationFrame(measure);
  }
  const resize = new view.ResizeObserver(scheduleMeasure);
  resize.observe(element);
  const intersection = new view.IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    render();
  }, { rootMargin: '128px' });
  intersection.observe(element);
  // 只监听主题所有者，不观察正文变更或每帧写回的控件 style。
  const theme = new view.MutationObserver(scheduleMeasure);
  const owner = options.themeElement || element.closest('[data-au-theme]') || document.documentElement;
  theme.observe(owner, { attributes: true, attributeFilter: ['style', 'data-au-theme'] });
  if (owner !== document.documentElement) theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-au-theme'] });
  measure();
  return {
    update(nextOptions = {}) {
      options = { ...options, ...nextOptions };
      if (!available()) blur();
      render();
    },
    destroy() {
      disposed = true;
      press.destroy();
      view.cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      theme.disconnect();
      if (filter) filter.destroy();
      outline.remove();
      element.removeEventListener('pointerdown', down);
      element.removeEventListener('pointerleave', leave);
      element.removeEventListener('keydown', keydown);
      element.removeEventListener('keyup', keyup);
      element.removeEventListener('blur', blur);
      view.removeEventListener('pointerup', release);
      view.removeEventListener('pointercancel', release);
      view.removeEventListener('blur', blur);
      written.forEach((value, property) => {
        if (element.style[property] === value) element.style[property] = original.get(property);
      });
    },
  };
}
