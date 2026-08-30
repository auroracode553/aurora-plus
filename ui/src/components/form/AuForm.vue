<template>
  <form
    ref="formRef"
    class="au-form au-component"
    :class="[
      `is-label-${labelPosition}`,
      `is-${size}`,
      { 'is-inline': inline, 'is-disabled': disabled },
    ]"
    :aria-disabled="disabled ? 'true' : undefined"
    v-bind="$attrs"
    @submit="emit('submit', $event)"
  >
    <slot></slot>
  </form>
</template>

<script setup>
import { computed, provide, ref, watch } from 'vue';
import { FORM_CONTEXT_KEY } from './form-context.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  model: { type: Object, default: () => ({}) },
  rules: { type: Object, default: () => ({}) },
  labelPosition: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right', 'top'].includes(value),
  },
  labelWidth: { type: [String, Number], default: '' },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  inline: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  showMessage: { type: Boolean, default: true },
  validateOnRuleChange: { type: Boolean, default: true },
  scrollToError: { type: Boolean, default: false },
});

const emit = defineEmits(['validate', 'submit']);
const formRef = ref(null);
const fields = new Map();

function registerField(field) {
  if (field?.fieldId) fields.set(field.fieldId, field);
}

function unregisterField(fieldId) {
  fields.delete(fieldId);
}

function getFields(fieldProps) {
  if (fieldProps == null) return [...fields.values()];
  const requested = new Set(Array.isArray(fieldProps) ? fieldProps : [fieldProps]);
  return [...fields.values()].filter((field) => requested.has(field.prop));
}

async function validate(callback) {
  const result = await validateFields(getFields());
  callback?.(result.valid, result.errors);
  return result.valid;
}

async function validateField(fieldProps, callback) {
  const result = await validateFields(getFields(fieldProps));
  callback?.(result.valid, result.errors);
  return result.valid;
}

async function validateFields(targetFields) {
  const entries = await Promise.all(targetFields.map(async (field) => {
    const valid = await field.validate('');
    return [field.prop, valid ? '' : field.errorMessage.value];
  }));
  const errors = Object.fromEntries(entries.filter(([, message]) => message));
  const valid = Object.keys(errors).length === 0;
  if (!valid && props.scrollToError) scrollToField(Object.keys(errors)[0]);
  return { valid, errors };
}

function resetFields(fieldProps) {
  getFields(fieldProps).forEach((field) => field.resetField());
}

function clearValidate(fieldProps) {
  getFields(fieldProps).forEach((field) => field.clearValidate());
}

function scrollToField(prop, options = { block: 'center', behavior: 'smooth' }) {
  getFields(prop)[0]?.element.value?.scrollIntoView?.(options);
}

provide(FORM_CONTEXT_KEY, {
  model: computed(() => props.model),
  rules: computed(() => props.rules),
  labelPosition: computed(() => props.labelPosition),
  labelWidth: computed(() => props.labelWidth),
  size: computed(() => props.size),
  disabled: computed(() => props.disabled),
  showMessage: computed(() => props.showMessage),
  registerField,
  unregisterField,
  notifyValidate(prop, valid, message) {
    emit('validate', prop, valid, message);
  },
});

watch(
  () => props.rules,
  () => {
    if (props.validateOnRuleChange) validate();
  },
  { deep: true },
);

defineExpose({ validate, validateField, resetFields, clearValidate, scrollToField, formRef });
</script>

<style scoped>
.au-form {
  display: block;
  min-width: 0;
}

.au-form.is-inline {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px 16px;
}

.au-form.is-disabled {
  cursor: not-allowed;
}
</style>
