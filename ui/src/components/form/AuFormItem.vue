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
      ></slot>
      <Transition name="au-form-item-message">
        <div
          v-if="shouldShowMessage"
          :id="messageId"
          class="au-form-item__message"
          role="alert"
          aria-live="polite"
        >
          <slot name="error" :error="resolvedMessage">{{ resolvedMessage }}</slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
} from 'vue';
import { FORM_CONTEXT_KEY } from './form-context.js';
import {
  cloneFieldValue,
  getFieldValue,
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
  prop: { type: String, default: '' },
  required: { type: Boolean, default: false },
  rules: { type: [Object, Array], default: null },
  error: { type: String, default: '' },
  validateStatus: {
    type: String,
    default: '',
    validator: (value) => ['', 'error', 'success', 'validating'].includes(value),
  },
  showMessage: { type: Boolean, default: true },
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
const labelId = `${fieldId}-label`;
const messageId = `${fieldId}-message`;
const initialValue = cloneFieldValue(fieldValue());
let resetting = false;
let validationSequence = 0;

const hasLabel = computed(() => Boolean(props.label || slots.label));
const resolvedSize = computed(() => props.size || form?.size.value || 'default');
const resolvedLabelPosition = computed(() => props.labelPosition || form?.labelPosition.value || 'right');
const mergedRules = computed(() => [
  ...normalizeRules(form?.rules.value?.[props.prop]),
  ...normalizeRules(props.rules),
]);
const isRequired = computed(() => props.required || mergedRules.value.some((rule) => rule.required));
const resolvedState = computed(() => props.validateStatus || (props.error ? 'error' : validationState.value));
const resolvedMessage = computed(() => props.error || errorMessage.value);
const shouldShowMessage = computed(() => Boolean(
  resolvedMessage.value
  && props.showMessage
  && (form?.showMessage.value ?? true),
));
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
  validate('blur');
}

const fieldContext = {
  fieldId,
  prop: props.prop,
  element,
  errorMessage,
  validate,
  resetField,
  clearValidate,
};

watch(
  () => fieldValue(),
  () => {
    if (!resetting) validate('change');
  },
  { deep: true },
);

onMounted(() => form?.registerField(fieldContext));
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
  color: var(--au-color-text-regular);
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

.au-form-item__content {
  position: relative;
  min-width: 0;
  flex: 1;
}

.au-form-item__message {
  padding: 4px 2px 0;
  color: var(--au-color-danger);
  font-size: 11px;
  line-height: 1.35;
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
  transition: opacity var(--au-transition-duration) var(--au-transition-ease);
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
