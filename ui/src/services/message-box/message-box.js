import { createVNode, render } from 'vue';
import MessageBoxHost from './AuMessageBoxHost.vue';

const queue = [];
let activeRequest = null;

function normalizeOptions(options) {
  const normalized = typeof options === 'string' || typeof options === 'number' ? { message: String(options) } : { ...(options || {}) };
  return {
    title: String(normalized.title || ''),
    message: String(normalized.message ?? ''),
    width: normalized.width || 'min(420px, calc(100vw - 32px))',
    confirmButtonText: normalized.confirmButtonText || normalized.confirmText || '确定',
    cancelButtonText: normalized.cancelButtonText || normalized.cancelText || '取消',
    confirmButtonType: normalized.confirmButtonType || 'primary',
    showCancelButton: normalized.showCancelButton !== false,
    showClose: normalized.showClose !== false,
    closeLabel: normalized.closeLabel || '关闭',
    closeOnClickModal: Boolean(normalized.closeOnClickModal),
    closeOnPressEscape: normalized.closeOnPressEscape !== false,
    beforeClose: typeof normalized.beforeClose === 'function' ? normalized.beforeClose : null,
  };
}

function openMessageBox(options) {
  return new Promise((resolve, reject) => {
    queue.push({ options: normalizeOptions(options), resolve, reject });
    processQueue();
  });
}

function processQueue() {
  if (activeRequest || queue.length === 0) return;
  if (typeof document === 'undefined') {
    const request = queue.shift();
    request.reject(new Error('[aurora-plus] AuMessageBox 只能在浏览器环境中调用。'));
    processQueue();
    return;
  }

  const request = queue.shift();
  const container = document.createElement('div');
  container.className = 'au-message-box-service';
  document.body.appendChild(container);
  activeRequest = { ...request, container };

  render(
    createVNode(MessageBoxHost, {
      options: request.options,
      onResolve: finishActiveRequest,
      onReject: failActiveRequest,
    }),
    container
  );
}

function cleanupActiveRequest() {
  if (!activeRequest) return;
  render(null, activeRequest.container);
  activeRequest.container.remove();
  activeRequest = null;
  processQueue();
}

function finishActiveRequest(value) {
  if (!activeRequest) return;
  const resolve = activeRequest.resolve;
  cleanupActiveRequest();
  resolve(value);
}

function failActiveRequest(error) {
  if (!activeRequest) return;
  const reject = activeRequest.reject;
  cleanupActiveRequest();
  reject(error);
}

export const AuMessageBox = Object.assign(openMessageBox, {
  confirm: openMessageBox,
  close() {
    finishActiveRequest(false);
  },
});
