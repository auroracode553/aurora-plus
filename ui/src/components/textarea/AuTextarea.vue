<template>
  <span
    class="au-textarea au-component"
    :class="[
      `is-${size}`,
      `is-resize-${resize}`,
      {
        'is-disabled': disabled,
        'is-readonly': readonly,
        'is-invalid': invalid,
      },
      $attrs.class,
    ]"
    :style="$attrs.style"
  >
    <textarea
      ref="textareaRef"
      class="au-textarea__control au-control-reset"
      v-bind="getTextareaAttrs()"
      :value="inputValue"
      :rows="rows"
      :placeholder="placeholder || undefined"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength ?? undefined"
      @input="handleInput"
      @change="handleChange"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    ></textarea>
    <span v-if="showWordLimit && maxlength != null" class="au-textarea__count">
      {{ wordCount }}/{{ maxlength }}
    </span>
  </span>
</template>

<script setup>
import { computed, ref, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  rows: { type: [Number, String], default: 3 },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  maxlength: { type: [Number, String], default: null },
  showWordLimit: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
  resize: {
    type: String,
    default: 'vertical',
    validator: (value) => ['none', 'both', 'horizontal', 'vertical'].includes(value),
  },
});

const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur']);
const attrs = useAttrs();
const textareaRef = ref(null);
const inputValue = computed(() => (props.modelValue == null ? '' : String(props.modelValue)));
const wordCount = computed(() => Array.from(inputValue.value).length);

function getTextareaAttrs() {
  return Object.fromEntries(
    Object.entries(attrs).filter(([name]) => !['class', 'style'].includes(name)),
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
  if (textareaRef.value) textareaRef.value.focus(options);
}

function blur() {
  if (textareaRef.value) textareaRef.value.blur();
}

function select() {
  if (textareaRef.value) textareaRef.value.select();
}

defineExpose({ focus, blur, select, textareaRef });
</script>

<style scoped lang="scss" src="./AuTextarea.scss"></style>
