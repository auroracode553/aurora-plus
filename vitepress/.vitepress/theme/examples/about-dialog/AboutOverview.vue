<template>
  <AuButton type="primary" @click="visible = true">关于示例应用</AuButton>
  <AuAboutDialog
    v-model="visible"
    v-model:details-visible="detailsVisible"
    app-name="示例应用"
    version="1.9.0"
    platform="Windows · x64"
    description="帮助你专注于创作。"
    author="示例团队"
    author-url="https://example.com"
    copyright="© 2026 示例团队"
    :release-notes="releaseNotes"
    :info-groups="infoGroups"
    show-details-button
  >
    <template #icon><span class="about-overview-icon">A</span></template>
  </AuAboutDialog>
</template>

<script setup>
import { ref } from 'vue';
import { AuAboutDialog, AuButton } from 'aurora-plus';

const visible = ref(false);
const detailsVisible = ref(false);
const releaseNotes = '### 新增功能\n\n- 支持 **专注模式**。\n- 提升大型文档的打开速度。';
const infoGroups = [
  { title: '版本信息', items: [{ label: '版本渠道', value: '稳定版' }, { label: '发行日期', value: '2026-10-09' }] },
  { title: '运行信息', items: [{ label: '平台', value: 'Windows x64' }, { label: '扩展数量', value: 0 }] },
];
</script>

<style scoped>
.about-overview-icon { font-size: 36px; font-weight: 600; color: var(--au-color-primary); }
</style>
