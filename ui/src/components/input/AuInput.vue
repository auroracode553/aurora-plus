<template>
  <div
    class="au-input au-component au-field-shell au-field-shell--single-line au-focus-halo"
    :class="[
      `is-${size}`,
      {
        'is-disabled': disabled,
        'au-disabled': disabled,
        'is-invalid': invalid,
      },
      $attrs.class,
    ]"
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
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength ?? undefined"
      :aria-invalid="invalid ? 'true' : $attrs['aria-invalid']"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
    />

    <span v-if="hasSuffix" class="au-input__affix au-input__suffix">
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
        <AuIcon :icon="IconX" />
      </button>
    </span>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, useAttrs, useSlots } from 'vue';
import { IconX } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';

defineOptions({ inheritAttrs: false });

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
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  clearableWhenReadonly: { type: Boolean, default: false },
  replaceSuffixOnClear: { type: Boolean, default: false },
  prefixIcon: { type: [Object, Function], default: null },
  suffixIcon: { type: [Object, Function], default: null },
  maxlength: { type: [Number, String], default: null },
  showWordLimit: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'input', 'change', 'clear', 'focus', 'blur']);
const attrs = useAttrs();
const slots = useSlots();
const inputRef = ref(null);
const isComposing = ref(false);

const inputValue = computed(() => (props.modelValue == null ? '' : String(props.modelValue)));
const hasPrefix = computed(() => Boolean(slots.prefix || props.prefixIcon));
const canClear = computed(() => (
  props.clearable
  && inputValue.value.length > 0
  && !props.disabled
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
  hasSuffixContent.value
  || props.clearable
  || (props.showWordLimit && props.maxlength != null),
));
const wordCount = computed(() => Array.from(inputValue.value).length);

/** class/style 作用于组件外壳，其余原生属性与监听器透传给 input。 */
function getInputAttrs() {
  return Object.fromEntries(
    Object.entries(attrs).filter(([name]) => !['class', 'style', 'aria-invalid'].includes(name)),
  );
}

function commitInput(event) {
  const value = event.target.value;
  emit('update:modelValue', value);
  emit('input', value, event);
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

<style scoped lang="scss">
.au-input {
  align-items: center;
  padding: 0 10px;
  gap: 7px;
}

.au-input.is-small {
  padding-inline: 8px;
  gap: 6px;
}

.au-input.is-large {
  padding-inline: 12px;
  gap: 8px;
}

.au-input__control {
  width: 100%;
  min-width: 0;
  height: 100%;
  line-height: normal;
}

.au-input__control:disabled {
  cursor: not-allowed;
}

.au-input__control:read-only {
  cursor: default;
}

.au-input__control::placeholder {
  color: var(--au-color-text-placeholder);
  opacity: 1;
}

.au-input__control::-webkit-search-cancel-button,
.au-input__control::-webkit-search-decoration {
  display: none;
  appearance: none;
}

.au-input__affix {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  max-width: 50%;
  gap: 5px;
  /* 中间输入区负责收缩，避免图标与清除按钮被 affix 的裁剪区域截断。 */
  flex: 0 0 auto;
  overflow: hidden;
  color: var(--au-color-text-secondary);
  font-size: 16px;
  line-height: 1;
}

.au-input__count {
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.au-input__suffix-content {
  min-width: 0;
  flex: 0 1 auto;
}

.au-input__replaceable-suffix {
  width: 20px;
  min-width: 20px;
  height: 20px;
  flex: 0 0 20px;
}

.au-input__clear {
  width: 20px;
  min-width: 20px;
  height: 20px;
  flex: 0 0 20px;
  padding: 0;
  overflow: visible;
  border-radius: var(--au-radius-pill);
  font-size: 14px;
  opacity: 0;
  pointer-events: none;
  transition:
    color var(--au-transition-duration) var(--au-transition-timing),
    background var(--au-transition-duration) var(--au-transition-timing),
    transform var(--au-transition-duration) var(--au-transition-timing),
    opacity var(--au-transition-duration) var(--au-transition-timing);
}

.au-input__clear :deep(.au-icon) {
  width: 14px;
  min-width: 14px;
  height: 14px;
  flex: 0 0 14px;
  overflow: visible;
  contain: none;
}

.au-input__clear.is-visible {
  pointer-events: auto;
}

.au-input__clear.is-replacement {
  opacity: 1;
}

.au-input:hover .au-input__clear.is-visible,
.au-input:focus-within .au-input__clear.is-visible,
.au-input__clear:focus-visible {
  opacity: 1;
}

.au-input__clear:disabled {
  cursor: default;
}
</style>
