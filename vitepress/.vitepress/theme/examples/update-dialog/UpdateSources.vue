<template>
  <div class="update-sources-demo">
    <AuButton type="primary" @click="open('available')">自动检查多个源</AuButton>
    <AuButton @click="open('fallback')">优先源失败</AuButton>
    <AuButton @click="open('timeout')">优先源超时</AuButton>
    <AuButton @click="open('latest')">均无新版本</AuButton>
    <AuButton @click="open('error')">全部失败</AuButton>
    <AuUpdateDialog
      v-model="visible"
      v-bind="dialogProps"
      v-model:source="source"
      app-name="Aurora Editor"
      @check="check"
      @retry="retry"
      @download="requestDownload"
      @cancel="cancel"
      @close="cancel"
    >
      <p class="update-sources-demo__hint">源列表和优先级由应用配置；此示例模拟各源响应。下载使用检查结果对应的实际源。</p>
    </AuUpdateDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuMessage, AuUpdateDialog, useUpdateCheck } from 'aurora-plus';

const visible = ref(false);
const scenario = ref('available');
// 数组顺序决定优先级。地址和认证配置仅传给调用者的 checkSource。
const configurations = [
  { id: 'github', name: 'GitHub', url: 'https://updates.example.com/github/' },
  { id: 'gitee', name: 'Gitee', url: 'https://updates.example.com/gitee/' },
];
const { source, dialogProps, check, cancel } = useUpdateCheck({
  sources: configurations,
  currentVersion: '1.8.0',
  timeout: 5000,
  async checkSource(configuration, { signal }) {
    const currentScenario = scenario.value;
    const delay = currentScenario === 'timeout' && configuration.id === 'github' ? 6000 : configuration.id === 'github' ? 1000 : 650;
    await waitForResponse(delay, signal);
    if (currentScenario === 'error' || (currentScenario === 'fallback' && configuration.id === 'github')) {
      throw new Error('暂时无法连接此更新源，请稍后重试。');
    }
    const version = currentScenario === 'latest' ? '1.8.0' : configuration.id === 'github' ? '1.9.0' : '1.10.0';
    return {
      version,
      channel: '稳定版',
      releaseNotes: [{ title: '体验优化', items: [`${version} 提升文档打开速度，优化编辑体验。`] }],
    };
  },
});

function waitForResponse(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(signal.reason || new Error('检查已取消'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', abort);
      resolve();
    }, milliseconds);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
  });
}

function open(value) {
  cancel();
  scenario.value = value;
  source.value = '';
  visible.value = true;
  check();
}

function retry(stage, context) {
  if (stage === 'check') check(context);
}

function requestDownload(version, { activeSource }) {
  const configuration = configurations.find((item) => item.id === activeSource);
  if (configuration) AuMessage.info(`应用收到下载请求：${configuration.name} · ${version}`);
}
</script>

<style scoped>
.update-sources-demo { display: flex; flex-wrap: wrap; gap: 8px; }
.update-sources-demo__hint { margin: 0; font-size: 12px; color: var(--au-color-text-secondary); }
</style>
