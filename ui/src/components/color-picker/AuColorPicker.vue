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

<style scoped lang="scss" src="./AuColorPicker.scss"></style>
