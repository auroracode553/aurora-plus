<template>
  <button
    class="au-switch au-component au-focus-ring"
    :class="[
      `is-${size}`,
      {
        'is-checked': checked,
        'is-disabled': disabled,
        'is-loading': loading,
        'au-disabled': disabled || loading,
      },
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
      <span class="au-switch__thumb au-depth-control">
        <AuIcon v-if="loading" class="au-switch__loading au-spin" :icon="IconLoader2" />
      </span>
    </span>
    <span v-if="hasLabel" class="au-switch__label au-wrap-anywhere">
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
  --au-focus-ring-offset: 3px;

  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 28px;
  padding: 0;
  border: 0;
  border-radius: var(--au-border-radius-small);
  color: var(--au-color-text-regular);
  background: transparent;
  font-size: var(--au-font-size-base);
  font-weight: var(--au-font-weight-medium);
  line-height: 1.3;
  cursor: pointer;
  user-select: none;
  appearance: none;
}

.au-switch.is-small {
  gap: 6px;
  min-height: 24px;
  font-size: var(--au-font-size-small);
}

.au-switch.is-large {
  gap: 8px;
  min-height: 32px;
  font-size: var(--au-font-size-large);
}

.au-switch__track {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 36px;
  height: 20px;
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
  width: 16px;
  height: 16px;
  margin-left: 2px;
  border-radius: 50%;
  background: var(--au-material-bg-strong);
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
  transform: translateX(16px);
}

.au-switch.is-small .au-switch__track {
  width: 30px;
  height: 18px;
}

.au-switch.is-small .au-switch__thumb {
  width: 14px;
  height: 14px;
}

.au-switch.is-small.is-checked .au-switch__thumb {
  transform: translateX(12px);
}

.au-switch.is-large .au-switch__track {
  width: 42px;
  height: 24px;
}

.au-switch.is-large .au-switch__thumb {
  width: 20px;
  height: 20px;
}

.au-switch.is-large.is-checked .au-switch__thumb {
  transform: translateX(18px);
}

.au-switch__loading {
  width: 0.7em;
  height: 0.7em;
  color: var(--au-color-text-secondary);
}

.au-switch__label {
  color: inherit;
}

.au-switch:hover:not(:disabled) .au-switch__track {
  border-color: color-mix(in srgb, var(--au-color-primary) 45%, var(--au-material-border-strong));
}

.au-switch:active:not(:disabled) .au-switch__thumb {
  transform: translateX(0) scale(0.94);
}

.au-switch.is-checked:active:not(:disabled) .au-switch__thumb {
  transform: translateX(16px) scale(0.94);
}

.au-switch.is-small.is-checked:active:not(:disabled) .au-switch__thumb {
  transform: translateX(12px) scale(0.94);
}

.au-switch.is-large.is-checked:active:not(:disabled) .au-switch__thumb {
  transform: translateX(18px) scale(0.94);
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
