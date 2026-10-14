<template>
  <AuButton type="primary" @click="visible = true">查看更新日志</AuButton>
  <AuUpdateDialog
    v-model="visible"
    status="available"
    app-name="示例应用"
    current-version="1.8.0"
    latest-version="1.9.0"
    :release-notes="releaseNotes"
    @download="visible = false"
  />
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuUpdateDialog } from 'aurora-plus';

const visible = ref(false);
const releaseNotes = [
  '## 新增功能',
  '',
  '- 支持 **专注模式**。',
  '- 支持常用文档快捷入口。',
  '  - 可将文档固定到收藏列表。',
  '',
  '### 体验优化',
  '',
  '1. 提升大型文档的打开速度。',
  '2. 修复切换工作区时丢失滚动位置的问题。',
  '',
  '> 安装更新前，请保存当前工作。',
  '',
  '可在 `设置` 中调整偏好，详见 [使用指南](https://auroracode553.github.io/aurora-plus/guide/getting-started)。',
].join('\n');
</script>
