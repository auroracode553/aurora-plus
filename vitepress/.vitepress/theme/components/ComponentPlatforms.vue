<template>
  <div v-if="isComponentPage" class="au-doc-platforms" aria-label="适用平台">
    <span class="au-doc-platforms__label">适用平台</span>
    <span v-for="platform in platforms" :key="platform" class="au-doc-platforms__badge">
      {{ platformLabels[platform] }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useData } from 'vitepress';
import { getComponentPlatforms, platformLabels } from '../utils/componentPlatforms.js';

const { page, frontmatter } = useData();
const isComponentPage = computed(() => page.value.relativePath.startsWith('components/'));
const platforms = computed(() => getComponentPlatforms(frontmatter.value));
</script>

<style scoped>
.au-doc-platforms {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 12px;
  line-height: 24px;
}
.au-doc-platforms__label { color: var(--vp-c-text-2); }
.au-doc-platforms__badge {
  padding: 0 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}
</style>
