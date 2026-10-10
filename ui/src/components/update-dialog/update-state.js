export const UPDATE_STATUSES = [
  'idle', 'checking', 'available', 'latest', 'downloading', 'ready', 'installing', 'error',
];

export const UPDATE_ERROR_STAGES = ['check', 'download', 'install'];

const presentations = {
  idle: { title: '检查应用更新', description: '获取最新版本，让每一次使用都更顺手。', action: '检查更新' },
  checking: { title: '正在检查更新', description: '正在获取最新版本信息，请稍候。' },
  available: { title: '发现新版本', description: '新版本已准备好，看看这次带来了哪些改进。', action: '下载更新' },
  latest: { title: '已是最新版本', description: '当前版本已是最新，继续享受顺畅的使用体验。', action: '再次检查' },
  downloading: { title: '正在下载更新', description: '更新文件下载完成后，即可安装新版本。' },
  ready: { title: '更新已准备就绪', description: '更新文件已下载完成，安装前请保存当前工作。', action: '安装更新' },
  installing: { title: '正在安装更新', description: '正在应用新版本，请稍候。', action: '正在安装' },
};

export function getUpdatePresentation(status, errorStage = 'check') {
  if (status !== 'error') return presentations[status] || presentations.idle;
  const name = { check: '检查', download: '下载', install: '安装' }[errorStage] || '检查';
  return {
    title: `${name}更新失败`,
    description: '暂时未能完成更新，请稍后重试。',
    action: `重新${name}`,
  };
}

// 未知进度与 0% 分开处理；无效值不会进入行内样式。
export function normalizeUpdateProgress(value) {
  if (value == null || !Number.isFinite(value)) return null;
  return Math.round(Math.min(100, Math.max(0, value)));
}
