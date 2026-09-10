<template>
  <div
    class="au-window-title-bar au-component au-material-surface au-material-surface--base"
    :class="{
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
      class="au-window-title-bar__title au-truncate"
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
          fill-trigger
        >
          <button
            class="au-window-title-bar__button au-control-reset au-inline-center"
            :class="{ 'au-disabled': minimizeDisabled }"
            type="button"
            :disabled="minimizeDisabled"
            @click="requestMinimize"
          >
            <slot name="minimize-icon">
              <AuIcon class="au-window-title-bar__button-icon" :icon="IconMinus" />
            </slot>
          </button>
        </AuTooltip>

        <AuTooltip
          v-if="showMaximize"
          :content="maximizeButtonLabel"
          :placement="tooltipPlacement"
          :show-after="tooltipShowAfter"
          :disabled="!showTooltips"
          fill-trigger
        >
          <button
            class="au-window-title-bar__button au-control-reset au-inline-center"
            :class="{ 'au-disabled': maximizeDisabled }"
            type="button"
            :disabled="maximizeDisabled"
            @click="requestToggleMaximize"
          >
            <slot v-if="maximized" name="restore-icon">
              <AuIcon class="au-window-title-bar__button-icon" :icon="IconCopy" />
            </slot>
            <slot v-else name="maximize-icon">
              <AuIcon class="au-window-title-bar__button-icon" :icon="IconSquare" />
            </slot>
          </button>
        </AuTooltip>

        <AuTooltip
          v-if="showClose"
          :content="closeLabel"
          :placement="tooltipPlacement"
          :show-after="tooltipShowAfter"
          :disabled="!showTooltips"
          fill-trigger
        >
          <button
            class="au-window-title-bar__button is-close au-control-reset au-inline-center"
            :class="{ 'au-disabled': closeDisabled }"
            type="button"
            :disabled="closeDisabled"
            @click="requestClose"
          >
            <slot name="close-icon">
              <AuIcon class="au-window-title-bar__button-icon" :icon="IconX" />
            </slot>
          </button>
        </AuTooltip>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import { IconCopy, IconMinus, IconSquare, IconX } from '../../icons/internal.js';
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

<style scoped lang="scss" src="./AuWindowTitleBar.scss"></style>
