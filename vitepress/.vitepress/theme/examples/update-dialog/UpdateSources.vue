<template>
  <div class="update-sources-demo">
    <AuButton @click="open('checking')">多源检查中</AuButton>
    <AuButton type="primary" @click="open('available')">多源检查结果</AuButton>
    <AuButton @click="open('fallback')">备用源结果</AuButton>
    <AuButton @click="open('latest')">均无新版本</AuButton>
    <AuButton @click="open('error')">全部失败</AuButton>
    <AuUpdateDialog v-model="visible" v-bind="dialogProps" app-name="示例应用"
      :source-selectable="false" @check="open('checking')" @retry="requestCheck" @download="requestDownload">
    </AuUpdateDialog>
  </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue';
import { AuButton, AuMessage, AuUpdateDialog } from 'aurora-plus';

const visible = ref(false);
const dialogProps = shallowRef({ status: 'idle', currentVersion: '1.8.0', sources: [] });

function open(scenario) {
  const fallback = scenario === 'fallback';
  const available = scenario === 'available' || fallback;
  const status = available ? 'available' : scenario;
  // 只演示更新服务的公开快照，不执行来源选择或版本比较。
  dialogProps.value = {
    status, currentVersion: '1.8.0', latestVersion: available ? '1.9.0' : '',
    activeSource: available ? (fallback ? 'gitee' : 'github') : '',
    sources: [
      { id: 'github', name: 'GitHub', status: fallback || scenario === 'error' ? 'error' : status,
        version: available && !fallback ? '1.9.0' : scenario === 'latest' ? '1.8.0' : '',
        message: fallback ? '暂时无法连接此更新源。' : '' },
      { id: 'gitee', name: 'Gitee', status, version: available ? '1.9.0' : scenario === 'latest' ? '1.8.0' : '' },
    ],
    releaseNotes: available ? [{ title: '体验优化', items: ['提升文档打开速度，优化编辑体验。'] }] : [],
    errorStage: 'check', errorMessage: scenario === 'error' ? '本次检查的更新源均不可用，请稍后重试。' : '',
  };
  visible.value = true;
}
function requestCheck() { AuMessage.info('应用收到重新检查请求。'); }
function requestDownload(version, { activeSource }) { AuMessage.info(`应用收到下载请求：${activeSource} · ${version}`); }
</script>

<style scoped>
.update-sources-demo { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
