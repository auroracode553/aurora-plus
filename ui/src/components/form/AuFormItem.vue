<template>
  <div
    ref="element"
    class="au-form-item au-component"
    :class="[
      `is-label-${resolvedLabelPosition}`,
      `is-${resolvedSize}`,
      {
        'is-required': isRequired,
        'is-error': resolvedState === 'error',
        'is-success': resolvedState === 'success',
        'is-validating': resolvedState === 'validating',
        'is-inline-message': resolvedInlineMessage,
        'has-message-space': messageEnabled && !resolvedInlineMessage,
        'is-asterisk-right': resolvedAsteriskPosition === 'right',
        'is-asterisk-hidden': form?.hideRequiredAsterisk.value,
      },
    ]"
  >
    <label
      v-if="hasLabel"
      class="au-form-item__label"
      :style="labelStyle"
      :for="labelFor || undefined"
    >
      <slot name="label" :label="label">{{ label }}</slot>
    </label>
    <div class="au-form-item__content">
      <slot
        :field-id="fieldId"
        :validate="validate"
        :clear-validate="clearValidate"
        :disabled="form?.disabled.value || false"
        :size="resolvedSize"
        :invalid="resolvedState === 'error'"
        :error="resolvedMessage"
        :validate-status="resolvedState"
      ></slot>
      <Transition name="au-form-item-message">
        <div
          v-if="shouldShowMessage"
          class="au-form-item__message au-field-feedback"
        >
          <slot name="error" :error="resolvedMessage">{{ resolvedMessage }}</slot>
        </div>
      </Transition>
      <AuIcon
        v-if="resolvedStatusIcon"
        class="au-form-item__status-icon"
        :class="[`is-${resolvedState}`, { 'au-spin': resolvedState === 'validating' }]"
        :icon="statusIconComponent"
      />
    </div>
  </div>
</template>

<script>
let formItemSeed = 0;
</script>

<script setup>
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  useSlots,
} from 'vue';
import { IconAlertCircle, IconCircleCheck, IconLoader2 } from '../../icons/internal.js';
import { AuIcon } from '../icon/index.js';
import {
  cloneFieldValue,
  getFieldValue,
  getRulesByPath,
  normalizeRules,
  setFieldValue,
  validateRules,
} from './form-validation.js';

const FORM_CONTEXT_KEY = Symbol.for('aurora-plus.form-context');
const FORM_ITEM_CONTEXT_KEY = Symbol.for('aurora-plus.form-item-context');

const props = defineProps({
  label: { type: String, default: '' },
  labelFor: { type: String, default: '' },
  labelWidth: { type: [String, Number], default: '' },
  labelPosition: {
    type: String,
    default: '',
    validator: (value) => ['', 'left', 'right', 'top'].includes(value),
  },
  prop: { type: [String, Array], default: '' },
  required: { type: Boolean, default: false },
  rules: { type: [Object, Array], default: null },
  error: { type: String, default: '' },
  validateStatus: {
    type: String,
    default: '',
    validator: (value) => ['', 'error', 'success', 'validating'].includes(value),
  },
  showMessage: { type: Boolean, default: true },
  inlineMessage: { type: Boolean, default: undefined },
  statusIcon: { type: Boolean, default: undefined },
  size: {
    type: String,
    default: '',
    validator: (value) => ['', 'small', 'default', 'large'].includes(value),
  },
});

const slots = useSlots();
const form = inject(FORM_CONTEXT_KEY, null);
const element = ref(null);
const errorMessage = ref('');
const validationState = ref('');
const fieldId = `au-form-item-${++formItemSeed}`;
const initialValue = cloneFieldValue(fieldValue());
let validationSequence = 0;

const hasLabel = computed(() => Boolean(props.label || slots.label));
const resolvedSize = computed(() => props.size || form?.size.value || 'default');
const resolvedLabelPosition = computed(() => props.labelPosition || form?.labelPosition.value || 'right');
const baseRules = computed(() => [
  ...getRulesByPath(form?.rules.value, props.prop),
  ...normalizeRules(props.rules),
]);
const mergedRules = computed(() => [
  ...baseRules.value,
  ...(props.required && !baseRules.value.some((rule) => rule.required)
    ? [{ required: true }]
    : []),
]);
const isRequired = computed(() => props.required || mergedRules.value.some((rule) => rule.required));
const resolvedState = computed(() => props.validateStatus || (props.error ? 'error' : validationState.value));
const resolvedMessage = computed(() => props.error || errorMessage.value);
const messageEnabled = computed(() => props.showMessage && (form?.showMessage.value ?? true));
const shouldShowMessage = computed(() => Boolean(resolvedMessage.value && messageEnabled.value));
const resolvedInlineMessage = computed(() => props.inlineMessage ?? form?.inlineMessage.value ?? false);
const resolvedStatusIcon = computed(() => Boolean(
  (props.statusIcon ?? form?.statusIcon.value)
  && ['error', 'success', 'validating'].includes(resolvedState.value),
));
const resolvedAsteriskPosition = computed(() => form?.requireAsteriskPosition.value || 'left');
const statusIconComponent = computed(() => {
  if (resolvedState.value === 'success') return IconCircleCheck;
  if (resolvedState.value === 'validating') return IconLoader2;
  return IconAlertCircle;
});
const labelStyle = computed(() => {
  if (resolvedLabelPosition.value === 'top') return undefined;
  const width = props.labelWidth || form?.labelWidth.value;
  if (width === '' || width == null) return undefined;
  return { width: typeof width === 'number' ? `${width}px` : width };
});

function fieldValue() {
  return form && props.prop ? getFieldValue(form.model.value, props.prop) : undefined;
}

async function validate(trigger = '') {
  if (!props.prop || mergedRules.value.length === 0) {
    clearValidate();
    return true;
  }
  const currentSequence = ++validationSequence;
  validationState.value = 'validating';
  const message = await validateRules(fieldValue(), mergedRules.value, form?.model.value, trigger);
  if (currentSequence !== validationSequence) return !message;
  errorMessage.value = message;
  validationState.value = message ? 'error' : 'success';
  form?.notifyValidate(props.prop, !message, message);
  return !message;
}

function clearValidate() {
  validationSequence += 1;
  errorMessage.value = '';
  validationState.value = '';
}

function resetField() {
  if (!form || !props.prop) return;
  setFieldValue(form.model.value, props.prop, initialValue);
  clearValidate();
}

const fieldContext = {
  fieldId,
  get prop() { return props.prop; },
  element,
  errorMessage,
  validationState,
  validate,
  resetField,
  clearValidate,
};

provide(FORM_ITEM_CONTEXT_KEY, fieldContext);
onMounted(() => form?.registerField(fieldContext));
onBeforeUnmount(() => form?.unregisterField(fieldContext));

defineExpose(fieldContext);
</script>

<style scoped lang="scss" src="./AuFormItem.scss"></style>
