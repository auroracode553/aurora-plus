<template>
  <span
    class="au-select au-component"
    :class="[
      `is-${size}`,
      {
        'is-disabled': disabled,
        'is-invalid': invalid,
      },
      $attrs.class,
    ]"
    :style="$attrs.style"
  >
    <select
      ref="selectRef"
      class="au-select__control"
      v-bind="getSelectAttrs()"
      :value="modelValue"
      :disabled="disabled"
      :aria-invalid="invalid ? 'true' : $attrs['aria-invalid']"
      @change="handleChange"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    >
      <slot></slot>
    </select>
    <AuIcon class="au-select__icon" :icon="IconChevronDown" aria-hidden="true" />
  </span>
</template>

<script setup>
import { ref, useAttrs } from 'vue';
import { IconChevronDown } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';

defineOptions({ inheritAttrs: false });

defineProps({
  modelValue: { type: [String, Number, Boolean], default: '' },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  disabled: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);
const attrs = useAttrs();
const selectRef = ref(null);

function getSelectAttrs() {
  return Object.fromEntries(
    Object.entries(attrs).filter(([name]) => !['class', 'style', 'aria-invalid'].includes(name)),
  );
}

function handleChange(event) {
  const value = event.target.value;
  emit('update:modelValue', value);
  emit('change', value, event);
}

function focus(options) {
  if (selectRef.value) selectRef.value.focus(options);
}

function blur() {
  if (selectRef.value) selectRef.value.blur();
}

defineExpose({ focus, blur, selectRef });
</script>

<style scoped>
.au-select {
  display: inline-flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  height: 30px;
  padding: 0 8px 0 10px;
  gap: 6px;
  border: 0.5px solid var(--au-color-border-lighter);
  border-radius: 7px;
  color: var(--au-color-text-regular);
  background: var(--au-color-bg-hover);
  font-size: 13px;
  transition:
    border-color var(--au-transition-duration) var(--au-transition-ease),
    background var(--au-transition-duration) var(--au-transition-ease),
    box-shadow var(--au-transition-duration) var(--au-transition-ease);
}

.au-select.is-small {
  height: 26px;
  padding-inline: 8px 6px;
  border-radius: 6px;
  font-size: var(--au-font-size-small);
}

.au-select.is-large {
  height: 36px;
  padding-inline: 12px 9px;
  border-radius: 8px;
  font-size: var(--au-font-size-base);
}

.au-select:focus-within:not(.is-disabled) {
  border-color: color-mix(in srgb, var(--au-color-primary) 45%, transparent);
  background: var(--au-material-bg-subtle);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--au-color-primary) 8%, transparent);
}

.au-select.is-invalid {
  border-color: color-mix(in srgb, var(--au-color-danger) 60%, transparent);
}

.au-select.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.au-select__control {
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  appearance: none;
  cursor: pointer;
}

.au-select__control:disabled {
  cursor: not-allowed;
}

.au-select__icon {
  flex: none;
  color: var(--au-color-text-secondary);
  pointer-events: none;
}

@media (forced-colors: active) {
  .au-select {
    border: 1px solid CanvasText;
  }
}
</style>
