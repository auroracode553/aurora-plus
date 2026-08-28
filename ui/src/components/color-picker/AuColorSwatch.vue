<template>
  <button
    class="au-color-swatch au-component au-focus-ring"
    :class="[`is-${size}`, { 'is-selected': selected, 'is-disabled': disabled }]"
    type="button"
    :disabled="disabled"
    :aria-label="ariaLabel || undefined"
    :aria-pressed="selected"
    :title="title || ariaLabel || undefined"
    @click="handleClick"
  >
    <span class="au-color-swatch__color" :style="{ backgroundColor: color }" aria-hidden="true">
      <AuIcon
        v-if="selected"
        class="au-color-swatch__check"
        :icon="IconCheck"
        :color="checkColor"
      />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { IconCheck } from '@tabler/icons-vue';
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
  ariaLabel: { type: String, default: '选择颜色' },
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

<style scoped>
.au-color-swatch {
  display: inline-grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 3px;
  border: 1px solid transparent;
  border-radius: 50%;
  color: var(--au-color-text-primary);
  background: transparent;
  cursor: pointer;
  appearance: none;
  transition:
    border-color var(--au-transition-duration) var(--au-transition-ease),
    background var(--au-transition-duration) var(--au-transition-ease),
    transform 100ms ease-out;
}

.au-color-swatch.is-small {
  width: 28px;
  height: 28px;
}

.au-color-swatch.is-large {
  width: 40px;
  height: 40px;
  padding: 4px;
}

.au-color-swatch:hover:not(.is-disabled),
.au-color-swatch:focus-visible {
  background: var(--au-color-bg-hover);
}

.au-color-swatch.is-selected {
  border-color: var(--au-color-primary);
  background: color-mix(in srgb, var(--au-color-primary) 9%, transparent);
}

.au-color-swatch:active:not(.is-disabled) {
  transform: scale(0.95);
}

.au-color-swatch.is-disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.au-color-swatch__color {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border: 1px solid var(--au-color-border-light);
  border-radius: 50%;
}

.au-color-swatch.is-small .au-color-swatch__color {
  width: 18px;
  height: 18px;
}

.au-color-swatch.is-large .au-color-swatch__color {
  width: 30px;
  height: 30px;
}

.au-color-swatch__check {
  width: 14px;
  height: 14px;
}

.au-color-swatch__check :deep(svg) {
  display: block;
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
}

@media (prefers-reduced-motion: reduce) {
  .au-color-swatch {
    transition: none;
  }
}

@media (prefers-contrast: more) {
  .au-color-swatch {
    border-color: var(--au-color-border);
  }

  .au-color-swatch.is-selected {
    border-width: 2px;
  }
}
</style>
