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

    <div class="au-icon-gallery__filters" aria-label="图标筛选">
      <label class="au-icon-gallery__filter">
        <span>分类</span>
        <select v-model="selectedCategory">
          <option value="">全部分类（{{ allIcons.length }}）</option>
          <option
            v-for="category in categoryOptions"
            :key="category.value"
            :value="category.value"
          >
            {{ category.label }}（{{ category.count }}）
          </option>
        </select>
      </label>

      <label class="au-icon-gallery__filter">
        <span>样式</span>
        <select v-model="selectedStyle">
          <option value="">全部样式</option>
          <option value="outline">描边</option>
          <option value="filled">填充</option>
        </select>
      </label>
    </div>

    <p id="au-icon-gallery-title" class="au-icon-gallery__hint">
      点击图标复制组件名；在代码中直接从 <code>aurora-plus</code> 按需导入。
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

    <p v-else class="au-icon-gallery__empty">当前筛选条件下没有匹配的图标。</p>

    <div v-if="hasMore" class="au-icon-gallery__more">
      <AuButton @click="visibleLimit += PAGE_SIZE">
        显示更多（{{ visibleIcons.length }} / {{ filteredIcons.length }}）
      </AuButton>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { AuButton, AuMessage } from 'aurora-plus';
import { IconSearch, icons as tablerIcons } from 'aurora-plus/icons';
import iconMetadata from 'virtual:aurora-plus-icon-metadata';
import { writeTextToClipboard } from '../utils/clipboard.js';

const PAGE_SIZE = 1000;
const CATEGORY_LABELS = {
  Animals: '动物',
  Arrows: '箭头',
  Badges: '徽章',
  Brand: '品牌',
  Buildings: '建筑',
  Charts: '图表',
  Communication: '通讯',
  Computers: '计算机',
  Currencies: '货币',
  Database: '数据库',
  Design: '设计',
  Development: '开发',
  Devices: '设备',
  Document: '文档',
  'E-commerce': '电商',
  Electrical: '电气',
  Extensions: '扩展',
  Food: '食物',
  Games: '游戏',
  Gender: '性别',
  Gestures: '手势',
  Health: '医疗健康',
  Laundry: '洗护',
  Letters: '字母',
  Logic: '逻辑',
  Map: '地图',
  Math: '数学',
  Media: '媒体',
  Mood: '表情',
  Nature: '自然',
  Numbers: '数字',
  Photography: '摄影',
  Shapes: '形状',
  Sport: '运动',
  Symbols: '符号',
  System: '系统',
  Text: '文本',
  Vehicles: '交通工具',
  'Version control': '版本控制',
  Weather: '天气',
  Zodiac: '星座',
};
const query = ref('');
const selectedCategory = ref('');
const selectedStyle = ref('');
const visibleLimit = ref(PAGE_SIZE);

const allIcons = Object.entries(tablerIcons)
  .filter(([name, component]) => name.startsWith('Icon') && component)
  .map(([name, component]) => {
    const [category = 'Other', style = name.endsWith('Filled') ? 'filled' : 'outline'] =
      iconMetadata[name] || [];
    const categoryLabel = CATEGORY_LABELS[category] || category;

    return {
      name,
      component,
      category,
      style,
      searchText: [
        name.slice(4).replace(/([a-z0-9])([A-Z])/g, '$1 $2'),
        category,
        categoryLabel,
      ].join(' ').toLowerCase(),
    };
  })
  .sort((left, right) => left.name.localeCompare(right.name));

const categoryOptions = Object.entries(
  allIcons.reduce((counts, icon) => {
    counts[icon.category] = (counts[icon.category] || 0) + 1;
    return counts;
  }, {}),
)
  .map(([value, count]) => ({
    value,
    count,
    label: CATEGORY_LABELS[value] || value,
  }))
  .sort((left, right) => left.label.localeCompare(right.label, 'zh-CN'));

const filteredIcons = computed(() => {
  const keywords = query.value.toLowerCase().split(/\s+/).filter(Boolean);

  return allIcons.filter((item) => {
    if (selectedCategory.value && item.category !== selectedCategory.value) return false;
    if (selectedStyle.value && item.style !== selectedStyle.value) return false;
    return keywords.every((keyword) => item.searchText.includes(keyword));
  });
});

const visibleIcons = computed(() => filteredIcons.value.slice(0, visibleLimit.value));
const hasMore = computed(() => visibleIcons.value.length < filteredIcons.value.length);

watch([query, selectedCategory, selectedStyle], () => {
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

.au-icon-gallery__filters {
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 14px;
}

.au-icon-gallery__filter {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-2);
  font-size: 13px;
  gap: 7px;
}

.au-icon-gallery__filter select {
  height: 32px;
  padding: 0 28px 0 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  color: var(--vp-c-text-1);
  background-color: transparent;
  font: inherit;
  cursor: pointer;
}

.au-icon-gallery__filter select:focus-visible {
  border-color: var(--vp-c-brand-1);
  outline: 2px solid color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
}

.au-icon-gallery__filter option {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
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

  .au-icon-gallery__filters {
    align-items: stretch;
    flex-direction: column;
    gap: 8px;
  }

  .au-icon-gallery__filter {
    justify-content: space-between;
  }

  .au-icon-gallery__filter select {
    width: min(78%, 260px);
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
