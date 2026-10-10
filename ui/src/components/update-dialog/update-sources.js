const sourceStatusLabels = {
  pending: '等待检查',
  checking: '读取中',
  success: '已读取',
  ready: '待确认更新',
  available: '发现更新',
  latest: '已是最新',
  'not-available': '已是最新',
  error: '读取失败',
};

// 只整理展示字段，不携带更新地址、认证信息或更新客户端实例。
export function normalizeUpdateSources(sources) {
  if (!Array.isArray(sources)) return [];
  const identifiers = new Set();
  return sources.reduce((result, source) => {
    if (!source || typeof source.id !== 'string') return result;
    const id = source.id.trim();
    if (!id || identifiers.has(id)) return result;
    identifiers.add(id);
    result.push({
      id,
      name: String(source.name || id),
      status: Object.hasOwn(sourceStatusLabels, source.status) ? source.status : 'pending',
      version: String(source.version || ''),
      message: String(source.message || ''),
      disabled: Boolean(source.disabled),
      active: Boolean(source.active),
    });
    return result;
  }, []);
}

export function getUpdateSourceSummary(source) {
  if (source.disabled) return '已停用';
  // 失败和读取中优先于上次读到的版本，避免把旧结果误当作本次结果。
  if (source.status === 'error' || source.status === 'checking') return sourceStatusLabels[source.status];
  if (source.status === 'pending') return sourceStatusLabels.pending;
  if (source.version) return `${source.version} · ${sourceStatusLabels[source.status]}`;
  return sourceStatusLabels[source.status] || sourceStatusLabels.pending;
}

export function isUpdateSourceLocked(status, errorStage) {
  return ['checking', 'downloading', 'ready', 'installing'].includes(status)
    || (status === 'error' && errorStage === 'install');
}
