import { computed, getCurrentScope, onScopeDispose, readonly, ref, shallowRef, toValue, watch } from 'vue';
import { requestUpdateSource } from './update-check-request.js';
import { normalizeUpdateSources } from './update-sources.js';
import { compareUpdateVersions } from './update-version.js';

/** 可选的多源检查协调器；地址、认证、联网及下载始终由调用者提供。 */
export function useUpdateCheck(options) {
  if (typeof options?.checkSource !== 'function') throw new TypeError('checkSource 必须是函数');
  const compareVersions = options.compareVersions || compareUpdateVersions;
  const timeout = options.timeout ?? 15000;
  if (typeof compareVersions !== 'function') throw new TypeError('compareVersions 必须是函数');
  if (!Number.isFinite(timeout) || timeout <= 0) throw new TypeError('timeout 必须是大于 0 的毫秒数');

  const source = ref('');
  const status = ref('idle');
  const activeSource = ref('');
  const errorMessage = ref('');
  const updateInfo = shallowRef(null);
  const snapshots = shallowRef(null);
  const sources = computed(() => readonly(snapshots.value || normalizeUpdateSources(toValue(options.sources))));
  const currentVersion = computed(() => String(toValue(options.currentVersion) || ''));
  const dialogProps = computed(() => ({
    status: status.value,
    source: source.value,
    sources: sources.value,
    activeSource: activeSource.value,
    currentVersion: currentVersion.value,
    latestVersion: updateInfo.value?.version || '',
    releaseNotes: updateInfo.value?.releaseNotes || [],
    releaseDate: updateInfo.value?.releaseDate || '',
    releaseUrl: updateInfo.value?.releaseUrl || '',
    channel: updateInfo.value?.channel || '',
    downloadSize: updateInfo.value?.downloadSize || '',
    errorStage: 'check',
    errorMessage: errorMessage.value,
  }));
  let runningCheck = null;

  function reset() {
    const previous = runningCheck;
    runningCheck = null;
    previous?.controller.abort(new Error('检查已取消'));
    status.value = 'idle';
    activeSource.value = '';
    errorMessage.value = '';
    updateInfo.value = null;
    snapshots.value = null;
  }

  function cancel() {
    if (runningCheck) reset();
  }

  function updateSnapshot(run, id, patch) {
    if (runningCheck !== run) return;
    snapshots.value = snapshots.value.map((item) => item.id === id ? { ...item, ...patch } : item);
  }

  function isAvailable(info, version) {
    if (typeof info.available === 'boolean') return info.available;
    const result = compareVersions(info.version, version);
    if (!Number.isFinite(result)) throw new TypeError('compareVersions 必须返回有效数值');
    return result > 0;
  }

  async function inspectSource(run, configuration) {
    updateSnapshot(run, configuration.id, { status: 'checking' });
    try {
      const info = await requestUpdateSource(options.checkSource, configuration, {
        signal: run.controller.signal, currentVersion: run.currentVersion, timeout,
      });
      if (runningCheck !== run) return null;
      if (!info || typeof info.version !== 'string' || !info.version.trim()) throw new TypeError('更新源未返回有效的 version');
      const available = isAvailable(info, run.currentVersion);
      updateSnapshot(run, configuration.id, {
        status: available ? 'available' : 'latest', version: info.version, message: String(info.message || ''),
      });
      return { id: configuration.id, info, available };
    } catch (error) {
      updateSnapshot(run, configuration.id, { status: 'error', version: '', message: String(error?.message || '更新源检查失败') });
      return null;
    }
  }

  async function execute(run, configurations) {
    // 所有源并行读取；选择遵循配置优先级，不受响应先后或最高版本影响。
    const results = await Promise.all(configurations.map((item) => inspectSource(run, item)));
    if (runningCheck !== run) return { status: 'cancelled', activeSource: '', info: null };
    const selected = results.find((item) => item?.available) || results.find(Boolean);
    if (selected) {
      activeSource.value = selected.id;
      status.value = selected.available ? 'available' : 'latest';
      updateInfo.value = selected.available ? selected.info : null;
      snapshots.value = snapshots.value.map((item) => ({ ...item, active: item.id === selected.id }));
    } else {
      status.value = 'error';
      errorMessage.value = '本次检查的更新源均不可用，请稍后重试。';
    }
    runningCheck = null;
    return { status: status.value, activeSource: activeSource.value, info: updateInfo.value };
  }

  function check(context = {}) {
    const requestedSource = context.source ?? source.value;
    // 同一轮重复请求共用任务；显式切换目标时取消旧任务。
    if (runningCheck?.source === requestedSource) return runningCheck.promise;
    reset();
    if (source.value !== requestedSource) source.value = requestedSource;
    const configurations = toValue(options.sources);
    const normalized = normalizeUpdateSources(configurations).map((item) => ({
      ...item, status: 'pending', version: '', message: '', active: false,
    }));
    const enabled = normalized.filter((item) => !item.disabled && (!requestedSource || item.id === requestedSource));
    snapshots.value = normalized;
    if (!enabled.length) {
      status.value = 'error';
      errorMessage.value = requestedSource ? '所选更新源不可用，请重新选择。' : '没有可用的更新源，请检查应用配置。';
      return Promise.resolve({ status: 'error', activeSource: '', info: null });
    }
    const selectedConfigurations = enabled.map((item) => ({
      ...configurations.find((configuration) => typeof configuration?.id === 'string' && configuration.id.trim() === item.id), id: item.id,
    }));
    const run = { controller: new AbortController(), source: requestedSource, currentVersion: currentVersion.value, promise: null };
    runningCheck = run;
    status.value = 'checking';
    run.promise = execute(run, selectedConfigurations);
    return run.promise;
  }

  // 配置、当前版本或选择变化时清空旧结果，避免混用不同源的更新信息。
  watch(source, reset, { flush: 'sync' });
  watch([() => toValue(options.sources), currentVersion], reset, { deep: true, flush: 'sync' });
  if (getCurrentScope()) onScopeDispose(reset);

  return {
    source, status: readonly(status), sources, activeSource: readonly(activeSource),
    errorMessage: readonly(errorMessage), updateInfo: readonly(updateInfo), dialogProps,
    check, cancel, reset,
  };
}
