<template>
  <button
    class="au-color-swatch au-component au-control-reset"
    :class="[`is-${size}`, { 'is-selected': selected, 'is-disabled': disabled, 'au-disabled': disabled }]"
    type="button"
    :disabled="disabled"
    :title="title || '选择颜色'"
    @click="handleClick"
  >
    <span class="au-color-swatch__color au-grid-center" :style="{ backgroundColor: color }">
      <AuIcon
        v-if="selected"
        class="au-color-swatch__check"
        :icon="IconCheck"
        :color="checkColor"
        :stroke-width="2.5"
      />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { IconCheck } from '../../icons/internal.js';
import { AuIcon } from '../icon/index.js';

const props = defineProps({
  color: { type: String, default: '#000000' },
  selected: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  disabled: { type: Boolean, default: false },
  title: { type: String, default: '' },
});

const emit = defineEmits(['select', 'click']);
const checkColor = computed(() => resolveCheckColor(props.color));

function handleClick(event) {
  if (props.disabled) return;
  emit('select', props.color);
  emit('click', event);
}

function resolveCheckColor(color) {
  const channels = parseColorChannels(color);
  if (!channels) return '#ffffff';
  const luminance = (channels.red * 0.299 + channels.green * 0.587 + channels.blue * 0.114) / 255;
  return luminance > 0.66 ? '#172033' : '#ffffff';
}

function parseColorChannels(color) {
  const value = String(color || '').trim();
  const hexMatch = value.match(/^#([\da-f]{6})$/i);
  if (hexMatch) {
    return {
      red: Number.parseInt(hexMatch[1].slice(0, 2), 16),
      green: Number.parseInt(hexMatch[1].slice(2, 4), 16),
      blue: Number.parseInt(hexMatch[1].slice(4, 6), 16),
    };
  }

  const rgbMatch = value.match(
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\s*\)$/i,
  );
  if (!rgbMatch) return null;
  return {
    red: clampChannel(rgbMatch[1]),
    green: clampChannel(rgbMatch[2]),
    blue: clampChannel(rgbMatch[3]),
  };
}

function clampChannel(value) {
  return Math.max(0, Math.min(Number.parseInt(value, 10), 255));
}
</script>

<style scoped lang="scss" src="./AuColorSwatch.scss"></style>
