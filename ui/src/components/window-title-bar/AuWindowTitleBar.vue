<template>
  <div
    class="au-window-title-bar au-component"
    :class="{
      'is-maximized': maximized,
      'is-drag-disabled': !draggable,
      'is-controls-start': controlsPosition === 'start',
    }"
    v-bind="$attrs"
  >
    <div
      v-if="hasIcon"
      class="au-window-title-bar__icon"
      @click="emit('icon-click', $event)"
    >
      <slot name="icon" :icon-src="iconSrc" :icon-alt="iconAlt">
        <img
          v-if="iconSrc"
          :src="iconSrc"
          :alt="iconAlt"
          draggable="false"
        />
      </slot>
    </div>

    <div
      class="au-window-title-bar__title"
      :title="titleText || undefined"
      @dblclick="handleTitleDoubleClick"
    >
      <slot name="title" :title="titleText">{{ titleText }}</slot>
    </div>

    <div
      v-if="$slots['controls-before']"
      class="au-window-title-bar__controls-before"
    >
      <slot
        name="controls-before"
        :maximized="maximized"
        :request-minimize="requestMinimize"
        :request-toggle-maximize="requestToggleMaximize"
        :request-close="requestClose"
      ></slot>
    </div>

    <div v-if="hasControlsArea" class="au-window-title-bar__controls">
      <slot
        name="controls"
        :maximized="maximized"
        :request-minimize="requestMinimize"
        :request-toggle-maximize="requestToggleMaximize"
        :request-close="requestClose"
      >
        <AuTooltip
          v-if="showMinimize"
          :content="minimizeLabel"
          :placement="tooltipPlacement"
          :show-after="tooltipShowAfter"
          :disabled="!showTooltips"
        >
          <button
            class="au-window-title-bar__button is-minimize au-focus-ring"
            type="button"
            :aria-label="minimizeLabel"
            :disabled="minimizeDisabled"
            @click="requestMinimize"
          >
            <slot name="minimize-icon">
              <AuIcon :icon="IconMinus" />
            </slot>
          </button>
        </AuTooltip>

        <AuTooltip
          v-if="showMaximize"
          :content="maximizeButtonLabel"
          :placement="tooltipPlacement"
          :show-after="tooltipShowAfter"
          :disabled="!showTooltips"
        >
          <button
            class="au-window-title-bar__button is-maximize au-focus-ring"
            type="button"
            :aria-label="maximizeButtonLabel"
            :aria-pressed="maximized ? 'true' : 'false'"
            :disabled="maximizeDisabled"
            @click="requestToggleMaximize"
          >
            <slot v-if="maximized" name="restore-icon">
              <AuIcon :icon="IconCopy" />
            </slot>
            <slot v-else name="maximize-icon">
              <AuIcon :icon="IconSquare" />
            </slot>
          </button>
        </AuTooltip>

        <AuTooltip
          v-if="showClose"
          :content="closeLabel"
          :placement="tooltipPlacement"
          :show-after="tooltipShowAfter"
          :disabled="!showTooltips"
        >
          <button
            class="au-window-title-bar__button is-close au-focus-ring"
            type="button"
            :aria-label="closeLabel"
            :disabled="closeDisabled"
            @click="requestClose"
          >
            <slot name="close-icon">
              <AuIcon :icon="IconX" />
            </slot>
          </button>
        </AuTooltip>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import { IconCopy, IconMinus, IconSquare, IconX } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';
import { AuTooltip } from '../tooltip/index.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  title: { type: [String, Number], default: '' },
  iconSrc: { type: String, default: '' },
  iconAlt: { type: String, default: '' },
  showIcon: { type: Boolean, default: false },
  maximized: { type: Boolean, default: false },
  draggable: { type: Boolean, default: true },
  controlsPosition: {
    type: String,
    default: 'end',
    validator: (value) => ['start', 'end'].includes(value),
  },
  maximizeOnDoubleClick: { type: Boolean, default: true },
  showMinimize: { type: Boolean, default: true },
  showMaximize: { type: Boolean, default: true },
  showClose: { type: Boolean, default: true },
  minimizeDisabled: { type: Boolean, default: false },
  maximizeDisabled: { type: Boolean, default: false },
  closeDisabled: { type: Boolean, default: false },
  showTooltips: { type: Boolean, default: true },
  tooltipPlacement: { type: String, default: 'bottom' },
  tooltipShowAfter: { type: Number, default: 220 },
  minimizeLabel: { type: String, default: '最小化' },
  maximizeLabel: { type: String, default: '最大化' },
  restoreLabel: { type: String, default: '还原' },
  closeLabel: { type: String, default: '关闭' },
});

const emit = defineEmits([
  'minimize',
  'toggle-maximize',
  'close',
  'icon-click',
  'title-double-click',
]);

const slots = useSlots();
const titleText = computed(() => String(props.title ?? ''));
const hasIcon = computed(() => Boolean(props.showIcon || props.iconSrc || slots.icon));
const hasWindowControls = computed(() => (
  props.showMinimize || props.showMaximize || props.showClose
));
const hasControlsArea = computed(() => Boolean(slots.controls || hasWindowControls.value));
const maximizeButtonLabel = computed(() => (
  props.maximized ? props.restoreLabel : props.maximizeLabel
));

function requestToggleMaximize(event) {
  if (props.maximizeDisabled) return;
  emit('toggle-maximize', event);
}

function requestMinimize(event) {
  if (props.minimizeDisabled) return;
  emit('minimize', event);
}

function requestClose(event) {
  if (props.closeDisabled) return;
  emit('close', event);
}

function handleTitleDoubleClick(event) {
  emit('title-double-click', event);
  if (props.maximizeOnDoubleClick) requestToggleMaximize(event);
}
</script>

<style scoped>
.au-window-title-bar {
  position: relative;
  z-index: 10001;
  display: flex;
  align-items: center;
  flex: none;
  width: 100%;
  height: 32px;
  min-height: 32px;
  padding: 0;
  border-bottom: 1px solid var(--au-color-border);
  color: var(--au-color-text-primary);
  background: var(--au-color-bg-overlay);
  -webkit-app-region: drag;
  user-select: none;
  pointer-events: none;
}

.au-window-title-bar.is-drag-disabled,
.au-window-title-bar.is-drag-disabled .au-window-title-bar__title {
  -webkit-app-region: no-drag;
}

.au-window-title-bar__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 32px;
  height: 100%;
  padding: 6px;
  -webkit-app-region: no-drag;
  pointer-events: auto;
}

.au-window-title-bar__icon img {
  display: block;
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.au-window-title-bar__title {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 8px;
  overflow: hidden;
  color: inherit;
  font-size: 13px;
  font-weight: 400;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-app-region: drag;
  pointer-events: auto;
}

.au-window-title-bar__controls-before,
.au-window-title-bar__controls {
  display: flex;
  align-items: center;
  flex: none;
  height: 100%;
  -webkit-app-region: no-drag;
  pointer-events: auto;
}

.au-window-title-bar.is-controls-start .au-window-title-bar__controls-before {
  order: -2;
}

.au-window-title-bar.is-controls-start .au-window-title-bar__controls {
  order: -1;
}

.au-window-title-bar__controls :deep(.au-tooltip__trigger) {
  height: 100%;
}

.au-window-title-bar__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 100%;
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  cursor: pointer;
  appearance: none;
  transition:
    color var(--au-transition-duration) var(--au-transition-ease),
    background-color var(--au-transition-duration) var(--au-transition-ease),
    opacity var(--au-transition-duration) var(--au-transition-ease);
}

.au-window-title-bar__button:hover:not(:disabled) {
  background: var(--au-color-bg-hover);
}

.au-window-title-bar__button.is-close:hover:not(:disabled) {
  color: #ffffff;
  background: #e81123;
}

.au-window-title-bar__button:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.au-window-title-bar__button:focus-visible {
  outline-offset: -2px;
}

.au-window-title-bar__button :deep(.au-icon) {
  width: 12px;
  height: 12px;
}

@media (prefers-reduced-motion: reduce) {
  .au-window-title-bar__button {
    transition-duration: 0.01ms;
  }
}
</style>
