<template>
  <div
    class="au-input au-component"
    :class="[
      `is-${size}`,
      {
        'is-disabled': disabled,
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
      class="au-input__control"
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
      <slot name="suffix">
        <AuIcon v-if="suffixIcon" :icon="suffixIcon" />
      </slot>
      <button
        v-if="clearable"
        class="au-input__clear au-focus-ring"
        :class="{ 'is-visible': canClear }"
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
const canClear = computed(() => props.clearable && inputValue.value.length > 0 && !props.disabled && !props.readonly);
const hasSuffix = computed(() => Boolean(
  slots.suffix
  || props.suffixIcon
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

<style scoped>
.au-input {
  display: inline-flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  height: 30px;
  padding: 0 10px;
  gap: 7px;
  border: 0.5px solid var(--au-material-border-strong);
  border-radius: var(--au-radius-control);
  color: var(--au-color-text-regular);
  background: var(--au-material-bg-subtle);
  font-size: 13px;
  transition:
    border-color var(--au-transition-duration) var(--au-transition-ease),
    background var(--au-transition-duration) var(--au-transition-ease),
    box-shadow var(--au-transition-duration) var(--au-transition-ease);
}

.au-input.is-small {
  height: 26px;
  padding-inline: 8px;
  gap: 6px;
  border-radius: var(--au-radius-small);
  font-size: var(--au-font-size-small);
}

.au-input.is-large {
  height: 36px;
  padding-inline: 12px;
  gap: 8px;
  border-radius: var(--au-radius-control);
  font-size: var(--au-font-size-base);
}

.au-input:focus-within:not(.is-disabled) {
  border-color: color-mix(in srgb, var(--au-color-primary) 45%, transparent);
  background: var(--au-material-bg-subtle);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--au-color-primary) 8%, transparent);
}

.au-input.is-invalid {
  border-color: var(--au-color-danger);
}

.au-input.is-invalid:focus-within {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--au-color-danger) 10%, transparent);
}

.au-input.is-disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.au-input__control {
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  line-height: normal;
  appearance: none;
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
  flex: 0 1 auto;
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

.au-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 20px;
  aspect-ratio: 1;
  margin: 0 -4px 0 0;
  padding: 0;
  border: 0;
  border-radius: var(--au-radius-round);
  color: var(--au-color-text-secondary);
  background: transparent;
  font-size: 14px;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition:
    color var(--au-transition-duration) var(--au-transition-ease),
    background var(--au-transition-duration) var(--au-transition-ease),
    opacity var(--au-transition-duration) var(--au-transition-ease);
}

.au-input__clear.is-visible {
  pointer-events: auto;
}

.au-input:hover .au-input__clear.is-visible,
.au-input:focus-within .au-input__clear.is-visible,
.au-input__clear:focus-visible {
  opacity: 1;
}

.au-input__clear:hover:not(:disabled) {
  color: var(--au-color-text-primary);
  background: var(--au-color-bg-hover);
}

.au-input__clear:disabled {
  cursor: default;
}

@media (prefers-reduced-transparency: reduce) {
  .au-input,
  .au-input:focus-within:not(.is-disabled) {
    background: var(--au-color-bg-overlay);
  }
}

@media (prefers-contrast: more) {
  .au-input {
    border-width: 1px;
    border-color: var(--au-color-border);
  }
}
</style>
