<template>
  <section class="au-icon-gallery" aria-labelledby="au-icon-gallery-title">
    <div class="au-icon-gallery__toolbar">
      <label class="au-icon-gallery__search">
        <IconSearch aria-hidden="true" />
        <span class="visually-hidden">搜索图标</span>
        <input
          v-model.trim="query"
          type="search"
          placeholder="搜索组件名，例如 home、arrow、filled"
          autocomplete="off"
        />
      </label>
      <span class="au-icon-gallery__count" aria-live="polite">
        {{ filteredIcons.length }} 个图标
      </span>
    </div>

    <p id="au-icon-gallery-title" class="au-icon-gallery__hint">
      点击图标复制组件名；在代码中直接从 <code>aurora-ui</code> 按需导入。
    </p>

    <div v-if="visibleIcons.length" class="au-icon-gallery__grid">
      <button
        v-for="item in visibleIcons"
        :key="item.name"
        class="au-icon-gallery__item"
        type="button"
        :title="`复制 ${item.name}`"
        :aria-label="`复制图标组件名 ${item.name}`"
        @click="copyIconName(item.name)"
      >
        <component :is="item.component" :size="24" :stroke-width="1.8" aria-hidden="true" />
        <code>{{ item.name }}</code>
      </button>
    </div>

    <p v-else class="au-icon-gallery__empty">没有匹配“{{ query }}”的图标。</p>

    <div v-if="hasMore" class="au-icon-gallery__more">
      <AuButton @click="visibleLimit += PAGE_SIZE">
        显示更多（{{ visibleIcons.length }} / {{ filteredIcons.length }}）
      </AuButton>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { AuButton, AuMessage, IconSearch, icons as tablerIcons } from 'aurora-ui';
import { writeTextToClipboard } from '../utils/clipboard.js';

const PAGE_SIZE = 144;
const query = ref('');
const visibleLimit = ref(PAGE_SIZE);

const allIcons = Object.entries(tablerIcons)
  .filter(([name, component]) => name.startsWith('Icon') && component)
  .map(([name, component]) => ({
    name,
    component,
    searchText: name.slice(4).replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase(),
  }))
  .sort((left, right) => left.name.localeCompare(right.name));

const filteredIcons = computed(() => {
  const keywords = query.value.toLowerCase().split(/\s+/).filter(Boolean);
  if (!keywords.length) return allIcons;
  return allIcons.filter((item) => keywords.every((keyword) => item.searchText.includes(keyword)));
});

const visibleIcons = computed(() => filteredIcons.value.slice(0, visibleLimit.value));
const hasMore = computed(() => visibleIcons.value.length < filteredIcons.value.length);

watch(query, () => {
  visibleLimit.value = PAGE_SIZE;
});

async function copyIconName(name) {
  try {
    await writeTextToClipboard(name);
    AuMessage.success(`已复制 ${name}`);
  } catch {
    AuMessage.error('复制失败，请手动复制');
  }
}
</script>

<style scoped>
.au-icon-gallery {
  margin-top: 18px;
}

.au-icon-gallery__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.au-icon-gallery__search {
  display: flex;
  align-items: center;
  width: min(100%, 460px);
  height: 36px;
  padding: 0 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  background: transparent;
  gap: 8px;
}

.au-icon-gallery__search:focus-within {
  border-color: var(--vp-c-brand-1);
  outline: 2px solid color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
}

.au-icon-gallery__search svg {
  width: 18px;
  height: 18px;
  flex: none;
}

.au-icon-gallery__search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: var(--vp-c-text-1);
  background: transparent;
  font: inherit;
  font-size: 14px;
}

.au-icon-gallery__count,
.au-icon-gallery__hint,
.au-icon-gallery__empty {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.au-icon-gallery__count {
  white-space: nowrap;
}

.au-icon-gallery__hint {
  margin: 12px 0;
}

.au-icon-gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(126px, 1fr));
  border-top: 1px solid var(--vp-c-divider);
  border-left: 1px solid var(--vp-c-divider);
}

.au-icon-gallery__item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 94px;
  padding: 10px 7px;
  border: 0;
  border-right: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  background: transparent;
  cursor: pointer;
  flex-direction: column;
  gap: 10px;
  transition: color 0.18s ease, background 0.18s ease;
}

.au-icon-gallery__item:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}

.au-icon-gallery__item:focus-visible {
  position: relative;
  z-index: 1;
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}

.au-icon-gallery__item code {
  display: block;
  max-width: 100%;
  padding: 0;
  color: inherit;
  background: transparent;
  font-size: 11px;
  line-height: 1.35;
  overflow-wrap: anywhere;
  text-align: center;
}

.au-icon-gallery__empty {
  padding: 28px 0;
  text-align: center;
}

.au-icon-gallery__more {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 640px) {
  .au-icon-gallery__toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .au-icon-gallery__search {
    width: 100%;
  }

  .au-icon-gallery__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .au-icon-gallery__item {
    transition-duration: 0.01ms;
  }
}
</style>
