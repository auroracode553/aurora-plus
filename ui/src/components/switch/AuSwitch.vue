<template>
  <button
    class="au-switch"
    :class="[
      `is-${size}`,
      { 'is-checked': checked, 'is-disabled': disabled, 'is-loading': loading },
    ]"
    type="button"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="disabled || loading ? 'true' : undefined"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="toggle"
  >
    <span class="au-switch__track" aria-hidden="true">
      <span class="au-switch__thumb">
        <AuIcon v-if="loading" class="au-switch__loading" :icon="IconLoader2" />
      </span>
    </span>
    <span v-if="hasLabel" class="au-switch__label">
      <slot>{{ checked ? activeText : inactiveText }}</slot>
    </span>
  </button>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import { IconLoader2 } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [Boolean, String, Number], default: false },
  activeValue: { type: [Boolean, String, Number], default: true },
  inactiveValue: { type: [Boolean, String, Number], default: false },
  activeText: { type: String, default: '' },
  inactiveText: { type: String, default: '' },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'change']);
const slots = useSlots();

const checked = computed(() => Object.is(props.modelValue, props.activeValue));
const hasLabel = computed(() => Boolean(slots.default || props.activeText || props.inactiveText));

function toggle() {
  if (props.disabled || props.loading) return;
  const value = checked.value ? props.inactiveValue : props.activeValue;
  emit('update:modelValue', value);
  emit('change', value);
}
</script>

<style scoped>
.au-switch {
  --au-switch-track-width: 36px;
  --au-switch-track-height: 20px;
  --au-switch-thumb-size: 16px;
  --au-switch-thumb-offset: 2px;
  --au-switch-thumb-travel: 16px;

  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 28px;
  padding: 0;
  border: 0;
  color: var(--au-color-text-regular);
  background: transparent;
  font-family: var(--au-font-family);
  font-size: var(--au-font-size-base);
  font-weight: var(--au-font-weight-medium);
  line-height: 1.3;
  cursor: pointer;
  user-select: none;
  outline: none;
  appearance: none;
}

.au-switch.is-small {
  --au-switch-track-width: 30px;
  --au-switch-track-height: 18px;
  --au-switch-thumb-size: 14px;
  --au-switch-thumb-offset: 2px;
  --au-switch-thumb-travel: 12px;
  gap: 6px;
  min-height: 24px;
  font-size: var(--au-font-size-small);
}

.au-switch.is-large {
  --au-switch-track-width: 42px;
  --au-switch-track-height: 24px;
  --au-switch-thumb-size: 20px;
  --au-switch-thumb-offset: 2px;
  --au-switch-thumb-travel: 18px;
  gap: 8px;
  min-height: 32px;
  font-size: var(--au-font-size-large);
}

.au-switch__track {
  position: relative;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  width: var(--au-switch-track-width);
  height: var(--au-switch-track-height);
  flex: none;
  border: 1px solid var(--au-material-border-strong);
  border-radius: 999px;
  background: var(--au-material-bg-subtle);
  transition:
    background var(--au-transition-duration) var(--au-transition-ease),
    border-color var(--au-transition-duration) var(--au-transition-ease);
}

.au-switch__thumb {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: var(--au-switch-thumb-size);
  height: var(--au-switch-thumb-size);
  margin-left: var(--au-switch-thumb-offset);
  border-radius: 50%;
  background: var(--au-material-bg-strong);
  box-shadow: 0 1px 3px color-mix(in srgb, var(--au-color-mask) 22%, transparent);
  transform: translateX(0);
  transition:
    transform var(--au-transition-duration) var(--au-transition-ease),
    background var(--au-transition-duration) var(--au-transition-ease);
}

.au-switch.is-checked .au-switch__track {
  border-color: color-mix(in srgb, var(--au-color-primary) 72%, var(--au-material-border-strong));
  background: var(--au-color-primary);
}

.au-switch.is-checked .au-switch__thumb {
  background: #ffffff;
  transform: translateX(var(--au-switch-thumb-travel));
}

.au-switch__loading {
  width: 0.7em;
  height: 0.7em;
  color: var(--au-color-text-secondary);
  animation: au-switch-spin 0.8s linear infinite;
}

.au-switch__label {
  min-width: 0;
  color: inherit;
  overflow-wrap: anywhere;
}

.au-switch:hover:not(:disabled) .au-switch__track {
  border-color: color-mix(in srgb, var(--au-color-primary) 45%, var(--au-material-border-strong));
}

.au-switch:active:not(:disabled) .au-switch__thumb {
  transform: translateX(0) scale(0.94);
}

.au-switch.is-checked:active:not(:disabled) .au-switch__thumb {
  transform: translateX(var(--au-switch-thumb-travel)) scale(0.94);
}

.au-switch:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--au-color-primary) 52%, transparent);
  outline-offset: 3px;
  border-radius: var(--au-border-radius-small);
}

.au-switch:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

@keyframes au-switch-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .au-switch__track,
  .au-switch__thumb {
    transition-duration: 0.01ms;
  }

  .au-switch__loading {
    animation-duration: 1.2s;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .au-switch__track,
  .au-switch__thumb {
    background: var(--au-color-bg-overlay);
  }

  .au-switch.is-checked .au-switch__track {
    background: var(--au-color-primary);
  }
}
</style>
