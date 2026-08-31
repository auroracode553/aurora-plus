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
        'is-asterisk-right': resolvedAsteriskPosition === 'right',
        'is-asterisk-hidden': form?.hideRequiredAsterisk.value,
      },
    ]"
    role="group"
    :aria-invalid="resolvedState === 'error' ? 'true' : undefined"
    :aria-labelledby="hasLabel ? labelId : undefined"
    :aria-describedby="shouldShowMessage ? messageId : undefined"
    @focusout.capture="handleFocusout"
  >
    <label
      v-if="hasLabel"
      :id="labelId"
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
          :id="messageId"
          class="au-form-item__message au-field-feedback"
          role="alert"
          aria-live="polite"
        >
          <slot name="error" :error="resolvedMessage">{{ resolvedMessage }}</slot>
        </div>
      </Transition>
      <AuIcon
        v-if="resolvedStatusIcon"
        class="au-form-item__status-icon"
        :class="[`is-${resolvedState}`, { 'au-spin': resolvedState === 'validating' }]"
        :icon="statusIconComponent"
        aria-hidden="true"
      />
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  useSlots,
  watch,
} from 'vue';
import { IconAlertCircle, IconCircleCheck, IconLoader2 } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';
import {
  cloneFieldValue,
  getFieldValue,
  getRulesByPath,
  normalizeRules,
  setFieldValue,
  validateRules,
} from './form-validation.js';

let formItemSeed = 0;

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
  validateEvent: { type: Boolean, default: true },
  size: {
    type: String,
    default: '',
    validator: (value) => ['', 'small', 'default', 'large'].includes(value),
  },
});

const slots = useSlots();
const form = inject('aurora-ui.form-context', null);
const element = ref(null);
const errorMessage = ref('');
const validationState = ref('');
const fieldId = `au-form-item-${++formItemSeed}`;
const labelId = `${fieldId}-label`;
const messageId = `${fieldId}-message`;
const initialValue = cloneFieldValue(fieldValue());
let resetting = false;
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
const shouldShowMessage = computed(() => Boolean(
  resolvedMessage.value
  && props.showMessage
  && (form?.showMessage.value ?? true),
));
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
  resetting = true;
  setFieldValue(form.model.value, props.prop, initialValue);
  clearValidate();
  Promise.resolve().then(() => {
    resetting = false;
  });
}

function handleFocusout(event) {
  if (element.value?.contains(event.relatedTarget)) return;
  if (!props.validateEvent) return;
  validate('blur');
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

watch(
  () => fieldValue(),
  () => {
    if (!resetting && props.validateEvent) validate('change');
  },
  { deep: true },
);

function ensureRegistered() {
  form?.registerField(fieldContext);
}

// 重复注册只会覆盖同一 Map 项，可修复父表单热更新后字段表重建的情况。
ensureRegistered();
onMounted(ensureRegistered);
onUpdated(ensureRegistered);
onBeforeUnmount(() => form?.unregisterField(fieldId));

defineExpose(fieldContext);
</script>

<style scoped>
.au-form-item {
  display: flex;
  align-items: flex-start;
  min-width: 0;
  margin-bottom: 16px;
}

.au-form-item.is-label-top {
  display: block;
}

.au-form-item__label {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 30px;
  padding-right: 10px;
  flex: 0 0 auto;
  color: var(--au-color-text-default);
  font-size: 13px;
  line-height: 1.35;
}

.au-form-item.is-label-left .au-form-item__label {
  justify-content: flex-start;
}

.au-form-item.is-label-top .au-form-item__label {
  justify-content: flex-start;
  min-height: 0;
  margin-bottom: 6px;
  padding-right: 0;
}

.au-form-item.is-required > .au-form-item__label::before {
  margin-right: 4px;
  color: var(--au-color-danger);
  content: '*';
}

.au-form-item.is-required.is-asterisk-hidden > .au-form-item__label::before,
.au-form-item.is-required.is-asterisk-right > .au-form-item__label::before {
  display: none;
}

.au-form-item.is-required.is-asterisk-right:not(.is-asterisk-hidden) > .au-form-item__label::after {
  margin-left: 4px;
  color: var(--au-color-danger);
  content: '*';
}

.au-form-item__content {
  position: relative;
  min-width: 0;
  flex: 1;
}

.au-form-item.is-inline-message .au-form-item__content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.au-form-item.is-inline-message .au-form-item__message {
  padding-top: 0;
  flex: none;
}

.au-form-item__status-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--au-color-text-secondary);
  pointer-events: none;
}

.au-form-item__status-icon.is-error {
  color: var(--au-color-danger);
}

.au-form-item__status-icon.is-success {
  color: var(--au-color-success);
}

.au-form-item__message {
  padding: 4px 2px 0;
}

.au-form-item.is-small {
  margin-bottom: 13px;
}

.au-form-item.is-small .au-form-item__label {
  min-height: 26px;
  font-size: var(--au-font-size-small);
}

.au-form-item.is-large {
  margin-bottom: 18px;
}

.au-form-item.is-large .au-form-item__label {
  min-height: 36px;
  font-size: var(--au-font-size-base);
}

.au-form-item-message-enter-active,
.au-form-item-message-leave-active {
  transition: opacity var(--au-transition-duration) var(--au-transition-timing);
}

.au-form-item-message-enter-from,
.au-form-item-message-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .au-form-item-message-enter-active,
  .au-form-item-message-leave-active {
    transition: none;
  }
}
</style>
