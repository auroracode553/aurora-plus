<template>
  <label
    class="au-color-picker au-component"
    :class="[`is-${size}`, { 'is-disabled': disabled }, $attrs.class]"
    :style="$attrs.style"
  >
    <span class="au-color-picker__swatch" :style="{ backgroundColor: resolvedValue }"></span>
    <input
      ref="inputRef"
      class="au-color-picker__control"
      v-bind="getInputAttrs()"
      type="color"
      :value="resolvedValue"
      :disabled="disabled"
      :aria-label="ariaLabel || undefined"
      @input="handleInput"
      @change="handleChange"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
  </label>
</template>

<script setup>
import { computed, ref, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: String, default: '#000000' },
  fallback: { type: String, default: '#ffffff' },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  disabled: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '选择颜色' },
});

const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur']);
const attrs = useAttrs();
const inputRef = ref(null);
const resolvedValue = computed(() => (
  /^#[0-9a-f]{6}$/i.test(props.modelValue) ? props.modelValue : props.fallback
));

function getInputAttrs() {
  return Object.fromEntries(
    Object.entries(attrs).filter(([name]) => !['class', 'style', 'aria-label'].includes(name)),
  );
}

function handleInput(event) {
  const value = event.target.value;
  emit('update:modelValue', value);
  emit('input', value, event);
}

function handleChange(event) {
  emit('change', event.target.value, event);
}

function focus(options) {
  if (inputRef.value) inputRef.value.focus(options);
}

defineExpose({ focus, inputRef });
</script>

<style scoped>
.au-color-picker {
  position: relative;
  display: inline-grid;
  place-items: center;
  flex: none;
  width: auto;
  height: 32px;
  aspect-ratio: 1;
  padding: 0;
  border: 0.5px solid var(--au-color-border-lighter);
  border-radius: var(--au-radius-round);
  background: var(--au-material-bg-subtle);
  cursor: pointer;
  transition:
    border-color var(--au-transition-duration) var(--au-transition-ease),
    background var(--au-transition-duration) var(--au-transition-ease),
    box-shadow var(--au-transition-duration) var(--au-transition-ease);
}

.au-color-picker.is-small {
  height: 28px;
}

.au-color-picker.is-large {
  height: 40px;
}

.au-color-picker:hover:not(.is-disabled) {
  border-color: color-mix(in srgb, var(--au-color-primary) 30%, var(--au-color-border-lighter));
  background: var(--au-color-bg-hover);
}

.au-color-picker:focus-within:not(.is-disabled) {
  border-color: color-mix(in srgb, var(--au-color-primary) 45%, transparent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--au-color-primary) 8%, transparent);
}

.au-color-picker.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.au-color-picker__swatch {
  width: auto;
  height: 18px;
  aspect-ratio: 1;
  border: 0.5px solid var(--au-color-border-lighter);
  border-radius: var(--au-radius-round);
  pointer-events: none;
}

.au-color-picker.is-small .au-color-picker__swatch {
  height: 16px;
}

.au-color-picker.is-large .au-color-picker__swatch {
  height: 22px;
}

.au-color-picker__control {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  opacity: 0;
  cursor: inherit;
}

@media (forced-colors: active) {
  .au-color-picker {
    border: 1px solid ButtonText;
  }
}
</style>
