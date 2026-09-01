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
import { computed, provide, ref, unref, watch } from 'vue';
import { getFieldValue, getRulesByPath, validateRules } from './form-validation.js';

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
  inlineMessage: { type: Boolean, default: false },
  statusIcon: { type: Boolean, default: false },
  hideRequiredAsterisk: { type: Boolean, default: false },
  requireAsteriskPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value),
  },
  validateOnRuleChange: { type: Boolean, default: true },
  scrollToError: { type: Boolean, default: false },
  scrollIntoViewOptions: {
    type: [Object, Boolean],
    default: () => ({ block: 'center', behavior: 'smooth' }),
  },
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
  const registered = [...fields.values()];
  const isRegisteredPath = Array.isArray(fieldProps)
    && registered.some((field) => normalizeProp(field.prop) === normalizeProp(fieldProps));
  const requestedValues = Array.isArray(fieldProps) && !isRegisteredPath ? fieldProps : [fieldProps];
  const requested = new Set(requestedValues.map(normalizeProp));
  return registered.filter((field) => requested.has(normalizeProp(field.prop)));
}

function normalizeProp(prop) {
  return Array.isArray(prop) ? prop.join('.') : String(prop || '');
}

async function validate(callback) {
  const targetFields = getFields();
  const ruleProps = Object.keys(props.rules || {});
  const result = targetFields.length === 0 && ruleProps.length > 0
    ? await validateModelRules(ruleProps)
    : await validateFields(targetFields);
  callback?.(result.valid, result.errors);
  return result.valid;
}

async function validateField(fieldProps, callback) {
  const result = await validateFields(getFields(fieldProps));
  callback?.(result.valid, result.errors);
  return result.valid;
}

async function validateFields(targetFields) {
  const results = await Promise.all(targetFields.map(async (field) => {
    const valid = await field.validate('');
    return {
      prop: normalizeProp(field.prop),
      valid,
      message: valid ? '' : unref(field.errorMessage) || '字段校验失败',
    };
  }));
  const errors = Object.fromEntries(
    results.filter((result) => !result.valid).map((result) => [result.prop, result.message]),
  );
  const valid = results.every((result) => result.valid);
  if (!valid && props.scrollToError) {
    scrollToField(Object.keys(errors)[0], props.scrollIntoViewOptions);
  }
  return { valid, errors };
}

async function validateModelRules(ruleProps) {
  const entries = await Promise.all(ruleProps.map(async (prop) => {
    const message = await validateRules(
      getFieldValue(props.model, prop),
      getRulesByPath(props.rules, prop),
      props.model,
    );
    emit('validate', prop, !message, message);
    return [prop, message];
  }));
  const errors = Object.fromEntries(entries.filter(([, message]) => message));
  return { valid: Object.keys(errors).length === 0, errors };
}

function resetFields(fieldProps) {
  getFields(fieldProps).forEach((field) => field.resetField());
}

function clearValidate(fieldProps) {
  getFields(fieldProps).forEach((field) => field.clearValidate());
}

function scrollToField(prop, options = { block: 'center', behavior: 'smooth' }) {
  const element = getFields(prop)[0]?.element.value;
  if (!element?.scrollIntoView) return;
  if (options === false) element.scrollIntoView();
  else element.scrollIntoView(options);
}

function getField(prop) {
  return getFields(prop)[0];
}

provide('aurora-ui.form-context', {
  model: computed(() => props.model),
  rules: computed(() => props.rules),
  labelPosition: computed(() => props.labelPosition),
  labelWidth: computed(() => props.labelWidth),
  size: computed(() => props.size),
  disabled: computed(() => props.disabled),
  showMessage: computed(() => props.showMessage),
  inlineMessage: computed(() => props.inlineMessage),
  statusIcon: computed(() => props.statusIcon),
  hideRequiredAsterisk: computed(() => props.hideRequiredAsterisk),
  requireAsteriskPosition: computed(() => props.requireAsteriskPosition),
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

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate,
  scrollToField,
  getField,
  fields,
  formRef,
});
</script>

<style scoped lang="scss">
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
