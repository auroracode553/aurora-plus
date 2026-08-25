<template>
  <AuTooltip :content="tooltipText" :disabled="!tooltipText || disabled">
    <button
      class="au-close-button"
      type="button"
      :disabled="disabled"
      :aria-label="ariaLabel || tooltipText || '关闭'"
      v-bind="$attrs"
      @click="handleClick"
    >
      <AuIcon :name="icon" />
    </button>
  </AuTooltip>
</template>

<script setup>
import { computed } from 'vue';
import { AuIcon } from '../icon/index.js';
import { AuTooltip } from '../tooltip/index.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  icon: { type: String, default: 'close' },
  title: { type: String, default: '' },
  tooltip: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['click']);
const tooltipText = computed(() => props.tooltip || props.title);

function handleClick(event) {
  if (!props.disabled) emit('click', event);
}
</script>

<style scoped>
.au-close-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--au-color-text-primary) 9%, transparent);
  border-radius: 50%;
  color: color-mix(in srgb, var(--au-color-text-primary) 50%, transparent);
  background: color-mix(in srgb, var(--au-color-text-primary) 5%, transparent);
  font-size: 15px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all var(--au-transition-duration) ease;
  backdrop-filter: blur(8px);
}

.au-close-button:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--au-color-text-primary) 16%, transparent);
  color: color-mix(in srgb, var(--au-color-text-primary) 82%, transparent);
  background: color-mix(in srgb, var(--au-color-text-primary) 11%, transparent);
}

.au-close-button:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--au-color-primary) 45%, transparent);
  outline-offset: 2px;
}

.au-close-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
</style>
