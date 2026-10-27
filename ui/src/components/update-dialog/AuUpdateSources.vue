<template>
  <section class="au-update-sources">
    <div class="au-update-sources__heading">
      <h4>更新源</h4>
      <span class="au-update-sources__policy">{{ source ? '仅检查所选源' : '按配置顺序优先选择' }}</span>
    </div>
    <div v-if="sources.length" class="au-update-sources__list au-scroll-region au-thin-scrollbar">
      <button
        v-if="selectable"
        type="button"
        class="au-update-sources__item au-control-reset"
        :class="{ 'is-selected': !source, 'is-disabled': disabled || !hasEnabledSource }"
        :disabled="disabled || !hasEnabledSource"
        @click="emit('select', '')"
      >
        <span class="au-update-sources__marker"><AuIcon v-if="!source" :icon="IconCheck" :size="12" /></span>
        <span class="au-update-sources__name">自动选择</span>
        <span class="au-update-sources__summary">检查全部可用源</span>
      </button>
      <button
        v-for="item in sources"
        :key="item.id"
        type="button"
        class="au-update-sources__item au-control-reset"
        :class="{ 'is-selected': item.id === source, 'is-error': item.status === 'error', 'is-disabled': disabled || item.disabled || !selectable, 'is-unavailable': item.disabled }"
        :disabled="disabled || item.disabled || !selectable"
        :title="item.message || undefined"
        @click="emit('select', item.id)"
      >
        <span class="au-update-sources__marker">
          <AuIcon v-if="item.id === source" :icon="IconCheck" :size="12" />
        </span>
        <span class="au-update-sources__name au-truncate">{{ item.name }}</span>
        <span v-if="item.id === activeSource" class="au-update-sources__active">当前使用</span>
        <AuLoadingSpinner v-if="item.status === 'checking'" size="small" compact />
        <span class="au-update-sources__summary">{{ getUpdateSourceSummary(item) }}</span>
      </button>
    </div>
    <p v-if="activeName" class="au-update-sources__hint">当前使用：<strong>{{ activeName }}</strong></p>
    <p v-if="selectedMessage" class="au-update-sources__hint" :class="{ 'is-error': selectedSource.status === 'error' }">{{ selectedMessage }}</p>
    <p v-if="disabled" class="au-update-sources__hint">{{ lockedText }}</p>
    <p v-else-if="selectable && selectedSource?.disabled" class="au-update-sources__hint">所选更新源不可用，请选择其他源。</p>
    <p v-else-if="!hasEnabledSource" class="au-update-sources__hint">没有可用的更新源，请联系应用维护者。</p>
    <p v-else-if="selectable && source && !selectedSource" class="au-update-sources__hint">所选更新源已不可用，请重新选择。</p>
    <p v-else-if="!source && !activeName" class="au-update-sources__hint">自动检查所有可用源，优先源失败时使用备用源。</p>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { IconCheck } from '../../icons/internal.js';
import { AuIcon } from '../icon/index.js';
import { AuLoadingSpinner } from '../loading/index.js';
import { getUpdateSourceSummary } from './update-sources.js';

// 内部展示组件只接收已整理的源列表，选择与任务规则由 AuUpdateDialog 处理。
const props = defineProps({
  sources: { type: Array, default: () => [] },
  source: { type: String, default: '' },
  activeSource: { type: String, default: '' },
  selectable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  lockedText: { type: String, default: '当前任务期间不能切换更新源。' },
});

const emit = defineEmits(['select']);
const hasEnabledSource = computed(() => props.sources.some((item) => !item.disabled));
const selectedSource = computed(() => props.sources.find((item) => item.id === props.source));
const selectedMessage = computed(() => selectedSource.value?.message || '');
const activeName = computed(() => props.sources.find((item) => item.id === props.activeSource)?.name || props.activeSource);
</script>

<style scoped lang="scss" src="./AuUpdateSources.scss"></style>
