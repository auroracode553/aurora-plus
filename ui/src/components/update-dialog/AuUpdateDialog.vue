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
    <div class="au-update-dialog" :class="`is-${status}`">
      <div class="au-update-dialog__intro">
        <div class="au-update-dialog__symbol" :class="symbolClass">
          <slot name="icon" :status="status">
            <AuIcon :icon="statusIcon" :size="26" :stroke-width="1.7" :class="{ 'au-spin': isBusy }" />
          </slot>
        </div>
        <div class="au-update-dialog__heading">
          <p v-if="appName" class="au-update-dialog__app">{{ appName }}</p>
          <h3 class="au-update-dialog__title">{{ presentation.title }}</h3>
          <p class="au-update-dialog__description">{{ description || presentation.description }}</p>
        </div>
      </div>

      <slot
        v-if="normalizedSources.length || $slots.sources"
        name="sources"
        :sources="normalizedSources"
        :source="source"
        :active-source="effectiveActiveSource"
        :disabled="sourceLocked"
        :select="selectSource"
      >
        <AuUpdateSources
          :sources="normalizedSources"
          :source="source"
          :active-source="effectiveActiveSource"
          :selectable="sourceSelectable"
          :disabled="sourceLocked"
          :locked-text="sourceDisabled ? '更新源暂不可更改。' : '当前任务期间不能切换更新源。'"
          @select="selectSource"
        />
      </slot>

      <div v-if="currentVersion || (hasRelease && latestVersion)" class="au-update-dialog__versions">
        <div v-if="currentVersion" class="au-update-dialog__version">
          <span class="au-update-dialog__label">当前版本</span>
          <strong>{{ currentVersion }}</strong>
        </div>
        <AuIcon v-if="currentVersion && hasRelease && latestVersion" :icon="IconArrowRight" :size="16" class="au-update-dialog__version-arrow" />
        <div v-if="hasRelease && latestVersion" class="au-update-dialog__version is-new">
          <span class="au-update-dialog__label">最新版本</span>
          <strong>{{ latestVersion }}</strong>
        </div>
        <span v-if="status === 'latest'" class="au-update-dialog__tag is-success">已是最新</span>
        <span v-else-if="hasRelease && channel" class="au-update-dialog__tag">{{ channel }}</span>
      </div>

      <div v-if="hasRelease && (releaseDate || downloadSize)" class="au-update-dialog__meta">
        <span v-if="releaseDate">发布于 {{ releaseDate }}</span>
        <span v-if="downloadSize">{{ downloadSize }}</span>
      </div>

      <section v-if="hasRelease && (normalizedReleaseNotes.length || $slots['release-notes'] || releaseUrl)" class="au-update-dialog__notes">
        <div class="au-update-dialog__section-heading">
          <h4>更新内容</h4>
          <AuLink v-if="releaseUrl" :href="releaseUrl" target="_blank" rel="noopener noreferrer" type="primary">完整更新说明</AuLink>
        </div>
        <div v-if="normalizedReleaseNotes.length || $slots['release-notes']" class="au-update-dialog__notes-scroll au-scroll-region au-thin-scrollbar">
          <slot name="release-notes" :version="latestVersion" :notes="releaseNotes">
            <AuReleaseNotes :groups="normalizedReleaseNotes" />
          </slot>
        </div>
      </section>

      <div v-if="status === 'checking' || status === 'downloading' || status === 'installing'" class="au-update-dialog__progress-area">
        <div class="au-update-dialog__progress-copy">
          <span>{{ progressText || defaultProgressText }}</span>
          <strong v-if="status === 'downloading' && normalizedProgress !== null">{{ normalizedProgress }}%</strong>
        </div>
        <div class="au-update-dialog__progress-track" :class="{ 'is-indeterminate': status !== 'downloading' || normalizedProgress === null }">
          <span class="au-update-dialog__progress-fill" :style="progressStyle"></span>
        </div>
        <div v-if="status === 'downloading' && (downloadedSize || downloadSize || downloadSpeed)" class="au-update-dialog__download-meta">
          <span>{{ downloadedSize || '—' }}<template v-if="downloadSize"> / {{ downloadSize }}</template></span>
          <span v-if="downloadSpeed">{{ downloadSpeed }}</span>
        </div>
      </div>

      <p v-if="status === 'error'" class="au-update-dialog__error">{{ errorMessage || '请检查网络连接或稍后重试。' }}</p>
      <div v-if="$slots.default" class="au-update-dialog__extra"><slot :status="status"></slot></div>
    </div>

    <template #footer>
      <slot name="footer" :status="status" :close="close" :check="check" :download="download" :install="install" :retry="retry" :cancel="cancel" :later="later" :skip="skip">
        <div class="au-update-dialog__footer">
          <div class="au-update-dialog__preferences">
            <AuCheckbox v-if="showAutoCheck" :model-value="autoCheck" size="small" @update:model-value="emit('update:autoCheck', $event)">自动检查更新</AuCheckbox>
            <AuButton v-if="showSkip && status === 'available'" type="menu" size="small" @click="skip">跳过此版本</AuButton>
          </div>
          <div class="au-update-dialog__actions">
            <AuButton v-if="status === 'checking' || status === 'downloading'" @click="cancel">{{ status === 'checking' ? '取消检查' : '取消下载' }}</AuButton>
            <AuButton v-else-if="status === 'available' || status === 'ready'" @click="later">稍后提醒</AuButton>
            <AuButton v-else @click="close('dismiss')">关闭</AuButton>
            <AuButton v-if="presentation.action" type="primary" :icon="actionIcon" :disabled="requiresSource && !hasUsableSource" :loading="status === 'installing'" @click="handlePrimary">{{ presentation.action }}</AuButton>
          </div>
        </div>
      </slot>
    </template>
  </AuDialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { IconAlertCircle, IconArrowRight, IconArrowUp, IconCircleCheck, IconDownload, IconLoader2, IconRefresh } from '../../icons/internal.js';
import { AuButton } from '../button/index.js';
import { AuCheckbox } from '../checkbox/index.js';
import { AuDialog } from '../dialog/index.js';
import { AuIcon } from '../icon/index.js';
import { AuLink } from '../link/index.js';
import AuUpdateSources from './AuUpdateSources.vue';
import AuReleaseNotes from '../release-notes/AuReleaseNotes.vue';
import { normalizeReleaseNotes } from '../../utils/release-notes.js';
import { isUpdateSourceLocked, normalizeUpdateSources } from './update-sources.js';
import { getUpdatePresentation, normalizeUpdateProgress, UPDATE_ERROR_STAGES, UPDATE_STATUSES } from './update-state.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  status: { type: String, default: 'idle', validator: (value) => UPDATE_STATUSES.includes(value) },
  title: { type: String, default: '软件更新' },
  width: { type: [String, Number], default: 480 },
  appName: { type: String, default: '' },
  description: { type: String, default: '' },
  currentVersion: { type: String, default: '' },
  latestVersion: { type: String, default: '' },
  channel: { type: String, default: '' },
  releaseDate: { type: String, default: '' },
  releaseNotes: { type: [String, Array], default: () => [] },
  releaseUrl: { type: String, default: '' },
  progress: { type: Number, default: null },
  progressText: { type: String, default: '' },
  downloadSize: { type: String, default: '' },
  downloadedSize: { type: String, default: '' },
  downloadSpeed: { type: String, default: '' },
  errorStage: { type: String, default: 'check', validator: (value) => UPDATE_ERROR_STAGES.includes(value) },
  errorMessage: { type: String, default: '' },
  showAutoCheck: { type: Boolean, default: false },
  autoCheck: { type: Boolean, default: false },
  showSkip: { type: Boolean, default: false },
  sources: { type: Array, default: () => [] },
  source: { type: String, default: '' },
  activeSource: { type: String, default: '' },
  sourceSelectable: { type: Boolean, default: true },
  sourceDisabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'update:autoCheck', 'update:source', 'source-change', 'check', 'download', 'install', 'retry', 'cancel', 'later', 'skip', 'open', 'opened', 'close', 'closed']);
const dialogRef = ref(null);
const normalizedReleaseNotes = computed(() => normalizeReleaseNotes(props.releaseNotes));
const normalizedSources = computed(() => normalizeUpdateSources(props.sources));
const sourceLocked = computed(() => props.sourceDisabled || isUpdateSourceLocked(props.status, props.errorStage));
const effectiveActiveSource = computed(() => props.activeSource || normalizedSources.value.find((item) => item.active)?.id || '');
const hasUsableSource = computed(() => {
  if (!props.sources.length) return true;
  const useActiveSource = props.status === 'available' || (props.status === 'error' && props.errorStage === 'download');
  const id = useActiveSource ? effectiveActiveSource.value || props.source : props.source;
  return normalizedSources.value.some((item) => !item.disabled && (!id || item.id === id));
});
const requiresSource = computed(() => ['idle', 'latest', 'available', 'error'].includes(props.status) && !(props.status === 'error' && props.errorStage === 'install'));
const presentation = computed(() => getUpdatePresentation(props.status, props.errorStage));
const isBusy = computed(() => ['checking', 'downloading', 'installing'].includes(props.status));
const hasRelease = computed(() => ['available', 'downloading', 'ready', 'installing'].includes(props.status) || (props.status === 'error' && props.errorStage !== 'check'));
const normalizedProgress = computed(() => normalizeUpdateProgress(props.progress));
const progressStyle = computed(() => props.status === 'downloading' && normalizedProgress.value !== null ? { width: `${normalizedProgress.value}%` } : undefined);
const progressSourceName = computed(() => {
  const id = effectiveActiveSource.value || props.source;
  return normalizedSources.value.find((item) => item.id === id)?.name || id;
});
const defaultProgressText = computed(() => {
  const name = progressSourceName.value;
  if (props.status === 'checking' && !props.source && normalizedSources.value.length) {
    const enabled = normalizedSources.value.filter((item) => !item.disabled);
    const completed = enabled.filter((item) => !['pending', 'checking'].includes(item.status)).length;
    return `正在检查更新源（${completed}/${enabled.length}）…`;
  }
  return {
    checking: name ? `正在检查 ${name} 更新…` : '正在连接更新服务…',
    downloading: name ? `正在从 ${name} 下载更新文件…` : '正在下载更新文件…',
    installing: '正在安装新版本…',
  }[props.status];
});
const symbolClass = computed(() => ({ 'is-success': ['latest', 'ready'].includes(props.status), 'is-error': props.status === 'error' }));
const statusIcon = computed(() => {
  if (isBusy.value) return IconLoader2;
  if (['latest', 'ready'].includes(props.status)) return IconCircleCheck;
  return props.status === 'error' ? IconAlertCircle : IconArrowUp;
});
const actionIcon = computed(() => {
  if (props.status === 'available') return IconDownload;
  if (props.status === 'ready') return IconArrowUp;
  return IconRefresh;
});

function close(reason = 'api') {
  dialogRef.value?.close(reason);
}

function check() {
  if (['idle', 'latest'].includes(props.status) && hasUsableSource.value) emit('check', sourceContext());
}

function download() {
  if (props.status === 'available' && hasUsableSource.value) emit('download', props.latestVersion, sourceContext());
}

function install() {
  if (props.status === 'ready') emit('install', props.latestVersion);
}

function retry() {
  if (props.status === 'error' && (!requiresSource.value || hasUsableSource.value)) emit('retry', props.errorStage, sourceContext());
}

function sourceContext() {
  return { source: props.source, activeSource: effectiveActiveSource.value };
}

function selectSource(id) {
  if (sourceLocked.value || !props.sourceSelectable || id === props.source) return;
  if (id && !normalizedSources.value.some((item) => item.id === id && !item.disabled)) return;
  if (!id && !normalizedSources.value.some((item) => !item.disabled)) return;
  const previousSource = props.source;
  emit('update:source', id);
  emit('source-change', id, previousSource);
}

// 组件只发出业务请求；关闭窗口不会隐式取消下载或安装任务。
function cancel() {
  if (!['checking', 'downloading'].includes(props.status)) return;
  emit('cancel', props.status);
  close('cancel');
}

function later() {
  if (!['available', 'ready'].includes(props.status)) return;
  emit('later', props.status);
  close('later');
}

function skip() {
  if (props.status !== 'available') return;
  emit('skip', props.latestVersion);
  close('skip');
}

function handlePrimary() {
  if (props.status === 'available') download();
  else if (props.status === 'ready') install();
  else if (props.status === 'error') retry();
  else check();
}

defineExpose({ close, dialogRef });
</script>

<style scoped lang="scss" src="./AuUpdateDialog.scss"></style>
