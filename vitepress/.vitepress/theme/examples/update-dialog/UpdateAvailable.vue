<template>
  <div class="update-available-demo">
    <AuButton type="primary" @click="open('available')">发现新版本</AuButton>
    <AuButton @click="open('ready')">下载完成</AuButton>
    <AuUpdateDialog
      v-model="visible"
      :status="status"
      app-name="示例应用"
      :current-version="currentVersion"
      latest-version="1.9.0"
      channel="稳定版"
      :release-notes="releaseNotes"
      download-size="48.6 MB"
      :downloaded-size="`${(48.6 * progress / 100).toFixed(1)} MB`"
      :download-speed="status === 'downloading' ? '6.2 MB/s' : ''"
      :progress="progress"
      show-skip
      @download="download"
      @install="install"
      @close="clearTasks"
    />
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import { AuButton, AuUpdateDialog } from 'aurora-plus';

const visible = ref(false);
const status = ref('available');
const currentVersion = ref('1.8.0');
const progress = ref(0);
const releaseNotes = [
  { title: '新增功能', items: ['全新的专注模式，让写作更沉浸。', '支持为常用文档设置快捷入口。'] },
  { title: '体验优化', items: ['提升大型文档的打开速度。', '优化深色主题下的文字与控件对比度。'] },
  { title: '问题修复', items: ['修复切换工作区时偶尔丢失滚动位置的问题。'] },
];
let downloadTimer;
let installTimer;

function clearTasks() {
  clearInterval(downloadTimer);
  clearTimeout(installTimer);
}

function open(nextStatus) {
  clearTasks();
  currentVersion.value = '1.8.0';
  progress.value = nextStatus === 'ready' ? 100 : 0;
  status.value = nextStatus;
  visible.value = true;
}

function download() {
  clearTasks();
  progress.value = 0;
  status.value = 'downloading';
  // 仅模拟进度；实际应用传入下载任务报告的百分比。
  downloadTimer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 8);
    if (progress.value === 100) {
      clearInterval(downloadTimer);
      status.value = 'ready';
    }
  }, 300);
}

function install() {
  clearTasks();
  status.value = 'installing';
  installTimer = setTimeout(() => {
    currentVersion.value = '1.9.0';
    status.value = 'latest';
  }, 1600);
}

onBeforeUnmount(clearTasks);
</script>

<style scoped>
.update-available-demo { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
