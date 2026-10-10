<template>
  <div class="update-recovery-demo">
    <AuButton @click="open('downloading')">未知下载进度</AuButton>
    <AuButton @click="open('error')">下载失败与重试</AuButton>
    <AuUpdateDialog
      v-model="visible"
      :status="status"
      app-name="Aurora Editor"
      current-version="1.8.0"
      latest-version="1.9.0"
      download-size="48.6 MB"
      :progress="null"
      progress-text="正在获取更新文件…"
      error-stage="download"
      error-message="下载连接已中断。你可以重新下载，或稍后再试。"
      @retry="retry"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuUpdateDialog } from 'aurora-plus';

const visible = ref(false);
const status = ref('downloading');

function open(nextStatus) {
  status.value = nextStatus;
  visible.value = true;
}

function retry(stage) {
  if (stage === 'download') status.value = 'downloading';
}
</script>

<style scoped>
.update-recovery-demo { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
