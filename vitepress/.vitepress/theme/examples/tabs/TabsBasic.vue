<template>
  <div class="tabs-demo">
    <AuTabs v-model="activeTab" :items="tabs" fill aria-label="项目内容" />
    <div class="tabs-demo__panel" role="tabpanel">
      <strong>{{ activeContent.title }}</strong>
      <span>{{ activeContent.description }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { AuTabs } from 'aurora-ui';

const activeTab = ref('files');
const tabs = [
  { value: 'files', label: '文件', title: '当前项目文件' },
  { value: 'recent', label: '最近', title: '最近打开的内容' },
  { value: 'outline', label: '大纲', title: '当前文档结构' },
  { value: 'locked', label: '已锁定', disabled: true },
];
const content = {
  files: { title: '文件', description: '浏览当前项目中的 Markdown 文件。' },
  recent: { title: '最近', description: '快速回到最近打开的文档。' },
  outline: { title: '大纲', description: '按标题层级浏览当前文档。' },
};
const activeContent = computed(() => content[activeTab.value]);
</script>

<style scoped>
.tabs-demo {
  width: min(100%, 560px);
}

.tabs-demo__panel {
  display: grid;
  min-height: 92px;
  padding: 18px 12px;
  gap: 5px;
  color: var(--au-color-text-primary);
}

.tabs-demo__panel span {
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}
</style>
