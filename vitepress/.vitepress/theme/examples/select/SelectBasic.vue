<template>
  <div class="select-demo">
    <label class="select-demo__field">
      <span>文档格式</span>
      <AuSelect v-model="format">
        <option value="markdown">Markdown</option>
        <option value="html">HTML</option>
        <option value="text">纯文本</option>
      </AuSelect>
    </label>

    <label class="select-demo__field">
      <span>编辑器字号</span>
      <AuSelect v-model="fontSize" size="small">
        <option value="13">13 px</option>
        <option value="14">14 px</option>
        <option value="16">16 px</option>
      </AuSelect>
    </label>

    <label class="select-demo__field">
      <span>不可用选项</span>
      <AuSelect model-value="system" disabled>
        <option value="system">跟随系统</option>
      </AuSelect>
    </label>

    <p class="select-demo__result">当前选择：{{ formatLabel }}，{{ fontSize }} px</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { AuSelect } from 'aurora-plus';

const format = ref('markdown');
const fontSize = ref('14');
const formatLabels = {
  markdown: 'Markdown',
  html: 'HTML',
  text: '纯文本',
};
const formatLabel = computed(() => formatLabels[format.value]);
</script>

<style scoped>
.select-demo {
  display: grid;
  width: min(100%, 420px);
  gap: 14px;
}

.select-demo__field {
  display: grid;
  gap: 6px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.select-demo__result {
  margin: 0;
  color: var(--au-color-text-regular);
  font-size: var(--au-font-size-small);
}
</style>
