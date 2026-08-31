<template>
  <div class="image-preview-demo">
    <button
      v-for="(image, index) in images"
      :key="image.title"
      class="image-preview-demo__thumbnail au-focus-ring"
      type="button"
      @click="showPreview(index)"
    >
      <img :src="image.src" :alt="image.alt" />
      <span>{{ image.title }}</span>
    </button>
  </div>
  <AuImagePreview
    v-if="visible"
    v-model="visible"
    :images="images"
    :initial-index="initialIndex"
  />
</template>

<script setup>
import { ref } from 'vue';
import { AuImagePreview } from 'aurora-ui';

const visible = ref(false);
const initialIndex = ref(0);
const images = [
  createDemoImage('湖蓝', '#3478f6', '#dbe8ff'),
  createDemoImage('松绿', '#2f9e72', '#d9f2e8'),
  createDemoImage('暖橙', '#d98a24', '#f9ead3'),
];

function createDemoImage(title, color, background) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600"><rect width="960" height="600" rx="32" fill="${background}"/><circle cx="480" cy="270" r="150" fill="${color}"/><text x="480" y="500" text-anchor="middle" font-family="system-ui" font-size="48" fill="${color}">${title}</text></svg>`;
  return {
    src: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    alt: `${title}示例图`,
    title,
  };
}

function showPreview(index) {
  initialIndex.value = index;
  visible.value = true;
}
</script>

<style scoped>
.image-preview-demo {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.image-preview-demo__thumbnail {
  display: grid;
  gap: 6px;
  padding: 0;
  border: 0;
  color: var(--au-color-text-secondary);
  background: transparent;
  font: inherit;
  font-size: var(--au-font-size-small);
  cursor: zoom-in;
}

.image-preview-demo__thumbnail img {
  display: block;
  width: 100%;
  aspect-ratio: 8 / 5;
  border: 1px solid var(--au-material-border);
  border-radius: var(--au-radius-control);
  object-fit: cover;
}
</style>
