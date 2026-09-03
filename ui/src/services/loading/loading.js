import { createVNode, render } from 'vue';
import LoadingOverlay from '../../components/loading/AuLoadingOverlay.vue';

const controllers = new Set();
const positionedTargets = new WeakMap();
const busyTargets = new WeakMap();
let fullscreenController = null;

function resolveTarget(target) {
  if (typeof document === 'undefined') {
    throw new Error('[aurora-plus] Loading 只能在浏览器环境中调用。');
  }
  if (!target) return document.body;
  if (typeof target === 'string') {
    const element = document.querySelector(target);
    if (!element) throw new Error(`[aurora-plus] Loading target 不存在: ${target}`);
    return element;
  }
  if (typeof HTMLElement !== 'undefined' && target instanceof HTMLElement) return target;
  throw new TypeError('[aurora-plus] Loading target 必须是 HTMLElement 或选择器。');
}

function normalizeText(text) {
  if (text == null) return '';
  if (typeof text === 'string' || Array.isArray(text) || typeof text === 'object') return text;
  return String(text);
}

function normalizeOptions(options = {}) {
  const source = typeof options === 'boolean' ? { loading: options } : { ...(options || {}) };
  const target = resolveTarget(source.target);
  const fullscreen = source.fullscreen == null ? target === document.body : Boolean(source.fullscreen);
  const customSvg = source.svg ?? (typeof source.spinner === 'string' ? source.spinner : '');

  return {
    loading: source.loading !== false,
    target,
    body: Boolean(source.body),
    fullscreen,
    lock: Boolean(source.lock),
    text: normalizeText(source.text),
    size: ['small', 'default', 'large'].includes(source.size) ? source.size : 'default',
    spinner: typeof source.spinner === 'string' ? null : (source.spinner || null),
    svg: customSvg == null ? '' : String(customSvg),
    svgViewBox: source.svgViewBox == null ? '0 0 24 24' : String(source.svgViewBox),
    color: source.color == null ? '' : String(source.color),
    background: source.background == null ? '' : String(source.background),
    customClass: source.customClass || '',
    zIndex: Number.isFinite(Number(source.zIndex)) ? Number(source.zIndex) : 1000,
    ariaLabel: source.ariaLabel == null ? '加载中' : String(source.ariaLabel),
    delay: Math.max(Number(source.delay) || 0, 0),
    beforeClose: typeof source.beforeClose === 'function' ? source.beforeClose : null,
    closed: typeof source.closed === 'function' ? source.closed : null,
  };
}

function acquireTargetPosition(target) {
  if (target === document.body || target === document.documentElement) return () => {};

  let state = positionedTargets.get(target);
  if (!state) {
    const shouldPosition = window.getComputedStyle(target).position === 'static';
    state = {
      count: 0,
      changed: shouldPosition,
      previousPosition: target.style.position,
    };
    if (shouldPosition) target.style.position = 'relative';
    positionedTargets.set(target, state);
  }
  state.count += 1;

  return () => {
    state.count -= 1;
    if (state.count > 0) return;
    if (state.changed) target.style.position = state.previousPosition;
    positionedTargets.delete(target);
  };
}

function acquireTargetBusy(target) {
  let state = busyTargets.get(target);
  if (!state) {
    state = {
      count: 0,
      hadAttribute: target.hasAttribute('aria-busy'),
      previousValue: target.getAttribute('aria-busy'),
    };
    target.setAttribute('aria-busy', 'true');
    busyTargets.set(target, state);
  }
  state.count += 1;

  return () => {
    state.count -= 1;
    if (state.count > 0) return;
    if (state.hadAttribute) target.setAttribute('aria-busy', state.previousValue ?? '');
    else target.removeAttribute('aria-busy');
    busyTargets.delete(target);
  };
}

function observeBodyTarget(target, host) {
  if (target === document.body || target === document.documentElement) {
    host.style.inset = '0';
    return () => {};
  }

  function updateRect() {
    const rect = target.getBoundingClientRect();
    host.style.top = `${rect.top}px`;
    host.style.left = `${rect.left}px`;
    host.style.width = `${rect.width}px`;
    host.style.height = `${rect.height}px`;
  }

  updateRect();
  window.addEventListener('resize', updateRect);
  window.addEventListener('scroll', updateRect, true);
  const resizeObserver = typeof ResizeObserver === 'undefined'
    ? null
    : new ResizeObserver(updateRect);
  resizeObserver?.observe(target);

  return () => {
    window.removeEventListener('resize', updateRect);
    window.removeEventListener('scroll', updateRect, true);
    resizeObserver?.disconnect();
  };
}

function createHost(options) {
  const host = document.createElement('div');
  host.className = 'au-loading-service-host';
  host.style.pointerEvents = 'none';
  host.style.zIndex = String(options.zIndex);

  let cleanupLayout = () => {};
  if (options.fullscreen) {
    host.style.position = 'fixed';
    host.style.inset = '0';
    document.body.appendChild(host);
  } else if (options.body) {
    host.style.position = 'fixed';
    document.body.appendChild(host);
    cleanupLayout = observeBodyTarget(options.target, host);
  } else {
    cleanupLayout = acquireTargetPosition(options.target);
    host.style.position = 'absolute';
    host.style.inset = '0';
    options.target.appendChild(host);
  }

  return { host, cleanupLayout };
}

function toOverlayProps(options, onClosed) {
  return {
    loading: options.loading,
    text: options.text,
    size: options.size,
    spinner: options.spinner,
    svg: options.svg,
    svgViewBox: options.svgViewBox,
    color: options.color,
    fullscreen: options.fullscreen,
    lock: options.lock,
    background: options.background,
    customClass: options.customClass,
    zIndex: options.zIndex,
    ariaLabel: options.ariaLabel,
    delay: options.delay,
    onClosed,
  };
}

function createLoadingController(options = {}, appContext = null) {
  const normalized = normalizeOptions(options);
  if (normalized.fullscreen && fullscreenController && !fullscreenController.closed) {
    return fullscreenController;
  }

  const { host, cleanupLayout } = createHost(normalized);
  const cleanupBusy = acquireTargetBusy(normalized.target);
  let current = normalized;
  let closing = false;
  let closed = false;

  function renderLoading() {
    if (closed) return;
    const vnode = createVNode(LoadingOverlay, toOverlayProps(current, finalize));
    if (appContext) vnode.appContext = appContext;
    render(vnode, host);
  }

  function finalize() {
    if (closed) return;
    closed = true;
    render(null, host);
    cleanupLayout();
    cleanupBusy();
    host.remove();
    controllers.delete(controller);
    if (fullscreenController === controller) fullscreenController = null;
    current.closed?.();
  }

  function requestClose() {
    if (closed || closing) return;
    closing = true;
    current = { ...current, loading: false };
    renderLoading();
  }

  function close() {
    if (closed || closing) return;
    if (current.beforeClose && current.beforeClose() === false) return;
    requestClose();
  }

  function update(nextOptions = {}) {
    if (closed || closing) return;
    const next = normalizeOptions({ ...current, ...(nextOptions || {}) });
    current = {
      ...next,
      target: current.target,
      body: current.body,
      fullscreen: current.fullscreen,
    };
    host.style.zIndex = String(current.zIndex);
    if (!current.loading) close();
    else renderLoading();
  }

  function setText(text) {
    update({ text });
  }

  function destroy() {
    finalize();
  }

  const controller = {
    close,
    update,
    setText,
    get closed() {
      return closed;
    },
    /** 指令卸载时跳过过渡并立即释放 DOM 与滚动锁。 */
    _destroy: destroy,
  };

  controllers.add(controller);
  if (normalized.fullscreen) fullscreenController = controller;
  renderLoading();
  if (!normalized.loading) finalize();
  return controller;
}

function readAttribute(element, names) {
  for (const name of names) {
    if (element.hasAttribute(name)) return element.getAttribute(name) ?? '';
  }
  return undefined;
}

function readDirectiveAttributes(element) {
  const options = {};
  const mappings = {
    text: ['au-loading-text', 'element-loading-text'],
    svg: ['au-loading-svg', 'au-loading-spinner', 'element-loading-svg', 'element-loading-spinner'],
    svgViewBox: ['au-loading-svg-view-box', 'element-loading-svg-view-box'],
    background: ['au-loading-background', 'element-loading-background'],
    customClass: ['au-loading-custom-class', 'element-loading-custom-class'],
    color: ['au-loading-color'],
    ariaLabel: ['au-loading-aria-label'],
  };

  Object.entries(mappings).forEach(([key, names]) => {
    const value = readAttribute(element, names);
    if (value !== undefined) options[key] = value;
  });
  return options;
}

function normalizeDirectiveOptions(element, value, modifiers = {}) {
  const bindingOptions = value && typeof value === 'object'
    ? { ...value }
    : { loading: Boolean(value) };
  if (value && typeof value === 'object' && !('loading' in bindingOptions)) {
    bindingOptions.loading = true;
  }

  const source = { ...readDirectiveAttributes(element), ...bindingOptions };
  if (modifiers.body) source.body = true;
  if (modifiers.fullscreen) source.fullscreen = true;
  if (modifiers.lock) source.lock = true;
  return { ...source, target: element };
}

function getDirectivePlacement(options) {
  return `${Boolean(options.fullscreen)}:${Boolean(options.body)}`;
}

function updateDirective(element, value, modifiers, state) {
  const options = normalizeDirectiveOptions(element, value, modifiers);
  if (state.controller?.closed) state.controller = null;
  if (options.loading === false) {
    state.controller?._destroy();
    state.controller = null;
    state.placement = '';
    return;
  }

  const placement = getDirectivePlacement(options);
  if (state.controller && state.placement !== placement) {
    state.controller._destroy();
    state.controller = null;
  }

  if (!state.controller) state.controller = createLoadingController(options);
  else state.controller.update(options);
  state.placement = placement;
}

const directiveStates = new WeakMap();

export const AuLoadingDirective = {
  mounted(element, binding) {
    const state = { controller: null, placement: '' };
    directiveStates.set(element, state);
    updateDirective(element, binding.value, binding.modifiers, state);
  },
  updated(element, binding) {
    const state = directiveStates.get(element) || { controller: null, placement: '' };
    directiveStates.set(element, state);
    updateDirective(element, binding.value, binding.modifiers, state);
  },
  unmounted(element) {
    const state = directiveStates.get(element);
    state?.controller?._destroy();
    directiveStates.delete(element);
  },
};

const loadingService = Object.assign(createLoadingController, {
  closeAll() {
    [...controllers].forEach((controller) => controller.close());
  },
});

export default loadingService;
