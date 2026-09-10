<template>
  <div
    class="au-input au-component"
    :class="[
      `is-${size}`,
      {
        'is-disabled': disabled || loading,
        'is-loading': loading,
        'is-readonly': readonly,
        'is-invalid': resolvedInvalid,
      },
      $attrs.class,
    ]"
    :aria-busy="loading ? 'true' : undefined"
    :style="$attrs.style"
  >
    <span v-if="hasPrefix" class="au-input__affix au-input__prefix">
      <slot name="prefix">
        <AuIcon :icon="prefixIcon" />
      </slot>
    </span>

    <input
      ref="inputRef"
      class="au-input__control au-control-reset"
      v-bind="getInputAttrs()"
      :value="inputValue"
      :type="type"
      :placeholder="placeholder || undefined"
      :disabled="disabled || loading"
      :readonly="readonly"
      :maxlength="maxlength ?? undefined"
      :aria-invalid="resolvedInvalid ? 'true' : $attrs['aria-invalid']"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
    />

    <span v-if="hasSuffix" class="au-input__affix au-input__suffix">
      <AuLoadingSpinner v-if="loading" class="au-input__loading" :size="size" />
      <span v-if="showWordLimit && maxlength != null" class="au-input__count" aria-live="polite">
        {{ wordCount }}/{{ maxlength }}
      </span>
      <span
        v-if="hasSuffixContent && !shouldReplaceSuffix"
        class="au-input__suffix-content au-inline-center"
        :class="{ 'au-input__replaceable-suffix': replaceSuffixOnClear }"
      >
        <slot name="suffix">
          <AuIcon v-if="suffixIcon" :icon="suffixIcon" />
        </slot>
      </span>
      <button
        v-if="shouldRenderClear"
        class="au-input__clear au-action-control au-focus-ring"
        :class="{
          'is-visible': canClear,
          'is-replacement': shouldReplaceSuffix,
        }"
        type="button"
        :disabled="!canClear"
        :tabindex="canClear ? 0 : -1"
        :aria-hidden="canClear ? undefined : 'true'"
        aria-label="清空输入"
        @mousedown.prevent
        @click="clear"
      >
        <AuIcon class="au-input__clear-icon" :icon="IconX" />
      </button>
    </span>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, ref, useAttrs, useSlots } from 'vue';
import { IconX } from '../../icons/internal.js';
import { AuIcon } from '../icon/index.js';
import AuLoadingSpinner from '../loading/AuLoadingSpinner.vue';

defineOptions({ inheritAttrs: false });

const FORM_ITEM_CONTEXT_KEY = Symbol.for('aurora-plus.form-item-context');

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  clearableWhenReadonly: { type: Boolean, default: false },
  replaceSuffixOnClear: { type: Boolean, default: false },
  prefixIcon: { type: [Object, Function], default: null },
  suffixIcon: { type: [Object, Function], default: null },
  maxlength: { type: [Number, String], default: null },
  showWordLimit: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
  validateEvent: { type: Boolean, default: true },
});

const emit = defineEmits(['update:modelValue', 'input', 'change', 'clear', 'focus', 'blur']);
const attrs = useAttrs();
const slots = useSlots();
const inputRef = ref(null);
const isComposing = ref(false);
const formItem = inject(FORM_ITEM_CONTEXT_KEY, null);

const inputValue = computed(() => (props.modelValue == null ? '' : String(props.modelValue)));
const hasPrefix = computed(() => Boolean(slots.prefix || props.prefixIcon));
const canClear = computed(() => (
  props.clearable
  && inputValue.value.length > 0
  && !props.disabled
  && !props.loading
  && (!props.readonly || props.clearableWhenReadonly)
));
const hasSuffixContent = computed(() => Boolean(slots.suffix || props.suffixIcon));
const shouldReplaceSuffix = computed(() => (
  props.replaceSuffixOnClear && hasSuffixContent.value && canClear.value
));
const shouldRenderClear = computed(() => (
  props.clearable
  && (!props.replaceSuffixOnClear || !hasSuffixContent.value || canClear.value)
));
const hasSuffix = computed(() => Boolean(
  props.loading
  || hasSuffixContent.value
  || props.clearable
  || (props.showWordLimit && props.maxlength != null),
));
const wordCount = computed(() => Array.from(inputValue.value).length);
const resolvedInvalid = computed(() => (
  props.invalid || formItem?.validationState?.value === 'error'
));

/** class/style 作用于组件外壳，其余原生属性与监听器透传给 input。 */
function getInputAttrs() {
  return Object.fromEntries(
    Object.entries(attrs).filter(([name]) => !['class', 'style', 'aria-invalid'].includes(name)),
  );
}

async function notifyFormItem(trigger) {
  if (!props.validateEvent || !formItem?.validate) return;
  try {
    await nextTick();
    await formItem.validate(trigger);
  } catch {
    // 表单错误由 FormItem 展示，输入控件不向事件调用方泄漏校验异常。
  }
}

function commitInput(event) {
  const value = event.target.value;
  emit('update:modelValue', value);
  emit('input', value, event);
  notifyFormItem('change');
}

function handleInput(event) {
  if (isComposing.value || event.isComposing) return;
  commitInput(event);
}

function handleChange(event) {
  emit('change', event.target.value, event);
}

function handleFocus(event) {
  emit('focus', event);
}

function handleBlur(event) {
  emit('blur', event);
  notifyFormItem('blur');
}

function handleCompositionStart() {
  isComposing.value = true;
}

function handleCompositionEnd(event) {
  if (!isComposing.value) return;
  isComposing.value = false;
  commitInput(event);
}

async function clear() {
  if (!canClear.value) return;
  emit('update:modelValue', '');
  emit('input', '', null);
  emit('clear');
  await nextTick();
  await notifyFormItem('change');
  focus();
}

function focus(options) {
  inputRef.value?.focus(options);
}

function blur() {
  inputRef.value?.blur();
}

function select() {
  inputRef.value?.select();
}

defineExpose({ focus, blur, select, inputRef });
</script>

<style scoped lang="scss" src="./AuInput.scss"></style>
