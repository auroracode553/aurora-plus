<template>
  <button
    class="au-switch au-component au-choice-control au-control-reset au-focus-ring"
    :class="[
      `is-${size}`,
      {
        'is-checked': checked,
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
      <span class="au-switch__thumb au-depth-control au-inline-center">
        <AuLoadingSpinner
          v-if="loading"
          class="au-switch__loading"
          :size="size"
          color="var(--au-color-text-secondary)"
          compact
        />
      </span>
    </span>
    <span v-if="hasLabel" class="au-switch__label au-choice-label au-wrap-anywhere">
      <slot>{{ checked ? activeText : inactiveText }}</slot>
    </span>
  </button>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import AuLoadingSpinner from '../loading/AuLoadingSpinner.vue';

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

<style scoped lang="scss">
.au-switch {
  --au-focus-ring-offset: 3px;

  border-radius: var(--au-radius-compact);
}

.au-switch__track {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: auto;
  height: 20px;
  aspect-ratio: 9 / 5;
  flex: none;
  border: 1px solid var(--au-material-border-emphasis);
  border-radius: var(--au-radius-pill);
  background: var(--au-material-background-subtle);
  transition:
    background var(--au-transition-duration) var(--au-transition-timing),
    border-color var(--au-transition-duration) var(--au-transition-timing);
}

.au-switch__thumb {
  width: auto;
  height: 16px;
  aspect-ratio: 1;
  margin-left: 2px;
  border-radius: var(--au-radius-pill);
  background: var(--au-material-background-elevated);
  transform: translateX(0);
  transition:
    transform var(--au-transition-duration) var(--au-transition-timing),
    background var(--au-transition-duration) var(--au-transition-timing);
}

.au-switch.is-checked .au-switch__track {
  border-color: color-mix(in srgb, var(--au-color-primary) 72%, var(--au-material-border-emphasis));
  background: var(--au-color-primary);
}

.au-switch.is-checked .au-switch__thumb {
  background: #ffffff;
  transform: translateX(16px);
}

.au-switch.is-small .au-switch__track {
  height: 18px;
  aspect-ratio: 5 / 3;
}

.au-switch.is-small .au-switch__thumb {
  height: 14px;
}

.au-switch.is-small.is-checked .au-switch__thumb {
  transform: translateX(12px);
}

.au-switch.is-large .au-switch__track {
  height: 24px;
  aspect-ratio: 7 / 4;
}

.au-switch.is-large .au-switch__thumb {
  height: 20px;
}

.au-switch.is-large.is-checked .au-switch__thumb {
  transform: translateX(18px);
}

.au-switch__label {
  color: inherit;
}

.au-switch:hover:not(:disabled) .au-switch__track {
  border-color: color-mix(in srgb, var(--au-color-primary) 45%, var(--au-material-border-emphasis));
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
    background: var(--au-color-background-overlay);
  }

  .au-switch.is-checked .au-switch__track {
    background: var(--au-color-primary);
  }
}
</style>
