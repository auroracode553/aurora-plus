<template>
  <AuDialog
    ref="dialogRef"
    v-bind="$attrs"
    :model-value="modelValue"
    :title="title"
    :width="width"
    @update:model-value="emit('update:modelValue', $event)"
    @open="emit('open')"
    @opened="emit('opened')"
    @close="emit('close', $event)"
    @closed="emit('closed')"
  >
    <div class="au-about-dialog">
      <div class="au-about-dialog__intro">
        <div v-if="iconSrc || $slots.icon" class="au-about-dialog__icon">
          <slot name="icon"><img :src="iconSrc" :alt="appName" /></slot>
        </div>
        <div class="au-about-dialog__heading">
          <slot name="heading" :app-name="appName" :version="version" :platform="platform">
            <h3 v-if="appName" class="au-about-dialog__name">{{ appName }}</h3>
            <p v-if="platform" class="au-about-dialog__platform">{{ platform }}</p>
            <p v-if="version" class="au-about-dialog__version">版本 {{ version }}</p>
          </slot>
          <p v-if="description" class="au-about-dialog__description">{{ description }}</p>
          <div v-if="author || $slots.credit" class="au-about-dialog__credit">
            <slot name="credit" :author="author" :author-url="authorUrl">
              <span>作者：</span>
              <AuLink v-if="authorUrl" :href="authorUrl" target="_blank" rel="noopener noreferrer" type="primary" @click="emit('author-click', $event)">{{ author }}</AuLink>
              <span v-else>{{ author }}</span>
            </slot>
          </div>
        </div>
      </div>

      <section v-if="showReleaseNotes || normalizedReleaseNotes.length || $slots['release-notes']" class="au-about-dialog__release">
        <div class="au-about-dialog__section-heading">
          <h4>{{ releaseNotesTitle }}</h4>
          <span v-if="version">{{ version }}</span>
        </div>
        <div v-if="normalizedReleaseNotes.length || $slots['release-notes']" class="au-about-dialog__notes-scroll au-scroll-region au-thin-scrollbar">
          <slot name="release-notes" :version="version" :notes="releaseNotes">
            <AuReleaseNotes :groups="normalizedReleaseNotes" />
          </slot>
        </div>
        <p v-else class="au-about-dialog__empty">{{ emptyNotesText }}</p>
      </section>

      <div v-if="detailsVisible" class="au-about-dialog__details">
        <slot name="details" :groups="infoGroups">
          <div v-for="(group, groupIndex) in infoGroups" :key="groupIndex" class="au-about-dialog__info-group">
            <h4 v-if="group.title">{{ group.title }}</h4>
            <div v-for="(item, itemIndex) in group.items" :key="itemIndex" class="au-about-dialog__info-row" :class="{ 'is-extra': item.extra }">
              <span class="au-about-dialog__info-label">{{ item.label }}</span>
              <span class="au-about-dialog__info-value" :class="{ 'is-danger': item.type === 'danger' }">{{ formatInfoValue(item) }}</span>
            </div>
          </div>
        </slot>
      </div>
      <div v-if="$slots.default" class="au-about-dialog__extra"><slot></slot></div>
      <p v-if="copyright" class="au-about-dialog__copyright">{{ copyright }}</p>
    </div>

    <template #footer>
      <slot name="footer" :close="close" :details-visible="detailsVisible" :toggle-details="toggleDetails">
        <div class="au-about-dialog__footer">
          <AuButton v-if="showDetailsButton" type="info" @click="toggleDetails">{{ detailsButtonText }}</AuButton>
          <AuButton class="au-about-dialog__close" type="primary" @click="close('dismiss')">{{ closeText }}</AuButton>
        </div>
      </slot>
    </template>
  </AuDialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { normalizeReleaseNotes } from '../../utils/release-notes.js';
import { AuButton } from '../button/index.js';
import { AuDialog } from '../dialog/index.js';
import { AuLink } from '../link/index.js';
import AuReleaseNotes from '../release-notes/AuReleaseNotes.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: Boolean, default: true },
  title: { type: String, default: '关于' },
  width: { type: [String, Number], default: 560 },
  appName: { type: String, default: '' },
  iconSrc: { type: String, default: '' },
  version: { type: String, default: '' },
  platform: { type: String, default: '' },
  description: { type: String, default: '' },
  author: { type: String, default: '' },
  authorUrl: { type: String, default: '' },
  copyright: { type: String, default: '' },
  releaseNotes: { type: [String, Array], default: () => [] },
  showReleaseNotes: { type: Boolean, default: false },
  releaseNotesTitle: { type: String, default: '当前版本更新' },
  emptyNotesText: { type: String, default: '暂无更新说明' },
  infoGroups: { type: Array, default: () => [] },
  detailsVisible: { type: Boolean, default: false },
  showDetailsButton: { type: Boolean, default: false },
  detailsButtonText: { type: String, default: '详细信息…' },
  closeText: { type: String, default: '关闭' },
});

const emit = defineEmits(['update:modelValue', 'update:detailsVisible', 'details-toggle', 'author-click', 'open', 'opened', 'close', 'closed']);
const dialogRef = ref(null);
const normalizedReleaseNotes = computed(() => normalizeReleaseNotes(props.releaseNotes));

function formatInfoValue(item) {
  return item.value !== '' && item.value != null ? String(item.value) : item.suffix || '未知';
}

// 详情显隐由调用方控制；组件不获取平台数据，也不发起业务请求。
function toggleDetails() {
  const visible = !props.detailsVisible;
  emit('update:detailsVisible', visible);
  emit('details-toggle', visible);
}

function close(reason = 'api') {
  dialogRef.value?.close(reason);
}

defineExpose({ close, dialogRef });
</script>

<style scoped lang="scss" src="./AuAboutDialog.scss"></style>
