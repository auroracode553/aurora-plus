import { createVNode, reactive, render } from 'vue';
import MessageHost from './AuMessageHost.vue';

const state = reactive({ items: [] });
let messageSeed = 0;
let hostContainer = null;
let destroyTimer = null;

function normalizeOptions(options) {
  const normalized = typeof options === 'string' || typeof options === 'number' ? { message: String(options) } : { ...(options || {}) };
  const type = ['success', 'warning', 'info', 'error'].includes(normalized.type) ? normalized.type : 'info';
  return {
    message: String(normalized.message ?? ''),
    type,
    duration: normalized.duration == null ? 2000 : Math.max(Number(normalized.duration) || 0, 0),
    showClose: Boolean(normalized.showClose),
    grouping: Boolean(normalized.grouping),
    onClose: typeof normalized.onClose === 'function' ? normalized.onClose : null,
    offset: normalized.offset == null ? 20 : Math.max(Number(normalized.offset) || 0, 0),
  };
}

function ensureHost(offset) {
  if (typeof document === 'undefined') throw new Error('[aurora-ui] AuMessage 只能在浏览器环境中调用。');
  if (destroyTimer) {
    clearTimeout(destroyTimer);
    destroyTimer = null;
  }
  if (hostContainer) return;

  hostContainer = document.createElement('div');
  hostContainer.className = 'au-message-service';
  document.body.appendChild(hostContainer);
  render(
    createVNode(MessageHost, {
      items: state.items,
      offset,
      onClose: closeMessage,
      onPause: pauseMessage,
      onResume: resumeMessage,
    }),
    hostContainer
  );
}

function scheduleTimer(entry) {
  clearTimeout(entry.timer);
  if (entry.remaining <= 0) return;
  entry.startedAt = Date.now();
  entry.timer = globalThis.setTimeout(() => closeMessage(entry.id), entry.remaining);
}

function pauseMessage(id) {
  const entry = state.items.find((item) => item.id === id);
  if (!entry || !entry.timer) return;
  clearTimeout(entry.timer);
  entry.timer = null;
  entry.remaining = Math.max(entry.remaining - (Date.now() - entry.startedAt), 0);
}

function resumeMessage(id) {
  const entry = state.items.find((item) => item.id === id);
  if (!entry || entry.timer || entry.duration === 0) return;
  scheduleTimer(entry);
}

function closeMessage(id) {
  const index = state.items.findIndex((item) => item.id === id);
  if (index < 0) return;
  const [entry] = state.items.splice(index, 1);
  clearTimeout(entry.timer);
  try {
    if (entry.onClose) entry.onClose();
  } finally {
    scheduleHostDestroy();
  }
}

function scheduleHostDestroy() {
  if (state.items.length > 0 || !hostContainer) return;
  destroyTimer = globalThis.setTimeout(() => {
    if (state.items.length > 0 || !hostContainer) return;
    render(null, hostContainer);
    hostContainer.remove();
    hostContainer = null;
    destroyTimer = null;
  }, 260);
}

function openMessage(options) {
  const normalized = normalizeOptions(options);
  ensureHost(normalized.offset);

  if (normalized.grouping) {
    const existing = state.items.find((item) => item.message === normalized.message && item.type === normalized.type);
    if (existing) {
      clearTimeout(existing.timer);
      existing.timer = null;
      existing.repeat += 1;
      existing.duration = normalized.duration;
      existing.remaining = normalized.duration;
      if (existing.duration > 0) scheduleTimer(existing);
      return { close: () => closeMessage(existing.id) };
    }
  }

  const entry = reactive({
    id: `au-message-${++messageSeed}`,
    ...normalized,
    repeat: 1,
    remaining: normalized.duration,
    startedAt: 0,
    timer: null,
  });
  state.items.push(entry);
  if (entry.duration > 0) scheduleTimer(entry);
  return { close: () => closeMessage(entry.id) };
}

export const AuMessage = Object.assign(openMessage, {
  success: (options) => openMessage(withType(options, 'success')),
  warning: (options) => openMessage(withType(options, 'warning')),
  info: (options) => openMessage(withType(options, 'info')),
  error: (options) => openMessage(withType(options, 'error')),
  closeAll() {
    [...state.items].forEach((item) => closeMessage(item.id));
  },
});

function withType(options, type) {
  if (typeof options === 'string' || typeof options === 'number') return { message: String(options), type };
  return { ...(options || {}), type };
}
