<template>
  <span
    v-if="hasContent"
    ref="triggerRef"
    class="au-help-tooltip"
    :class="{ 'is-disabled': disabled || !active }"
    @click.stop="show"
    @mouseleave.capture="keepOpen"
    @focusout.capture="keepOpen"
  >
    <AuTooltip
      ref="tooltipRef"
      :placement="placement"
      :offset="offset"
      :show-after="0"
      :hide-after="0"
      :max-width="maxWidth"
      :disabled="disabled || !active"
      @open="observe"
      @closed="stopObserving"
    >
      <AuIcon :icon="IconHelpCircle" :size="size" />
      <template #content>
        <span ref="contentRef" class="au-help-tooltip__content">
          <slot name="content">
            <strong v-if="title">{{ title }}</strong>
            <span v-if="contentText">{{ contentText }}</span>
            <span v-for="(line, index) in lines" :key="index">{{ line }}</span>
          </slot>
        </span>
      </template>
    </AuTooltip>
  </span>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, useSlots, watch } from 'vue';
import { IconHelpCircle } from '../../icons/internal.js';
import { AuIcon } from '../icon/index.js';
import AuTooltip from './AuTooltip.vue';

const props = defineProps({
  title: { type: String, default: '' },
  content: { type: [String, Number], default: '' },
  lines: { type: Array, default: () => [] },
  size: { type: [String, Number], default: 16 },
  placement: { type: String, default: 'bottom' },
  offset: { type: Number, default: 10 },
  maxWidth: { type: [String, Number], default: 360 },
  active: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
});

const slots = useSlots();
const triggerRef = ref(null);
const contentRef = ref(null);
const tooltipRef = ref(null);
const contentText = computed(() => String(props.content ?? '').trim());
const hasContent = computed(() => Boolean(props.title.trim() || contentText.value || props.lines.length || slots.content));
let pinned = false;

function show() {
  if (!props.active || props.disabled || !hasContent.value) return;
  pinned = true;
  tooltipRef.value?.show();
}

function hide() {
  pinned = false;
  tooltipRef.value?.hide();
}

// 点击后保持可读，浮层定位、宿主视口与窗口失焦仍由 Tooltip 管理。
function keepOpen(event) {
  if (pinned) event.stopPropagation();
}

function dismissOutside(event) {
  if (!triggerRef.value?.contains(event.target) && !contentRef.value?.contains(event.target)) hide();
}

function observe() {
  document.addEventListener('pointerdown', dismissOutside, true);
}

function stopObserving() {
  pinned = false;
  document.removeEventListener('pointerdown', dismissOutside, true);
}

watch([() => props.active, () => props.disabled, hasContent], ([active, disabled, available]) => {
  if (!active || disabled || !available) hide();
});
watch([() => props.title, () => props.content, () => props.lines], hide);
onBeforeUnmount(stopObserving);

defineExpose({ show, hide, updatePosition: () => tooltipRef.value?.updatePosition() });
</script>

<style scoped lang="scss" src="./AuHelpTooltip.scss"></style>
