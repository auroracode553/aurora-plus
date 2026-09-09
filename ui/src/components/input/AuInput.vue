<template>
  <div
    class="au-input au-component au-field-shell au-field-shell--single-line"
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

<style scoped lang="scss">
@use '../../theme/glass-controls' as glass;

.au-input.au-field-shell {
  align-items: center;
  padding: 0 10px;
  gap: 7px;
  /* 使用全局材质表面，避免共享表单的蓝灰底色；solid 仍遵循主题设置。 */
  @include glass.surface;
}

@media (hover: hover) {
  .au-input.au-field-shell:hover:not(.is-disabled, .is-readonly, .is-invalid) {
    border-color: color-mix(in srgb, var(--au-color-text-primary) 26%, transparent);
    background: var(--au-material-background-elevated);
  }
}

.au-input.au-field-shell:focus-within:not(.is-disabled) {
  @include glass.focus;
}

.au-input.au-field-shell.is-readonly {
  color: var(--au-color-text-default);
  box-shadow: none;
}

.au-input.au-field-shell.is-invalid {
  border-color: color-mix(in srgb, var(--au-color-danger) 78%, transparent);
}

.au-input.au-field-shell.is-invalid:focus-within {
  outline-color: color-mix(in srgb, var(--au-color-danger) 28%, transparent);
  box-shadow: none;
}

/* 禁用通过文字和边界表达，保留玻璃表面与加载指示器的可读性。 */
.au-input.au-field-shell.is-disabled {
  border-color: color-mix(in srgb, var(--au-color-text-primary) 9%, transparent);
  color: var(--au-color-text-disabled);
  cursor: not-allowed;
  box-shadow: none;
}

.au-input.au-field-shell.is-loading {
  color: var(--au-color-text-secondary);
  cursor: progress;
}

.au-input.is-loading .au-input__control {
  cursor: progress;
}

.au-input.is-disabled .au-input__affix,
.au-input.is-disabled .au-input__count {
  color: inherit;
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
  color: inherit;
  -webkit-text-fill-color: currentColor;
  opacity: 1;
  cursor: not-allowed;
}

.au-input__control:read-only {
  cursor: default;
}

.au-input__control::placeholder {
  color: var(--au-color-text-secondary);
  opacity: 1;
}

.au-input.is-disabled .au-input__control::placeholder {
  color: inherit;
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

.au-input__loading {
  color: var(--au-color-primary);
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

.au-input__clear-icon {
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

/* 无模糊支持及无障碍偏好使用实色表面，焦点轮廓独立于阴影。 */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .au-input.au-field-shell,
  .au-input.au-field-shell:hover:not(.is-disabled, .is-readonly, .is-invalid),
  .au-input.au-field-shell:focus-within:not(.is-disabled) {
    background: var(--au-color-background-overlay);
  }
}

@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .au-input.au-field-shell,
  .au-input.au-field-shell:hover:not(.is-disabled, .is-readonly, .is-invalid),
  .au-input.au-field-shell:focus-within:not(.is-disabled) {
    background: var(--au-color-background-overlay);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

@media (prefers-contrast: more) {
  .au-input.au-field-shell,
  .au-input.au-field-shell:hover:not(.is-disabled, .is-readonly, .is-invalid) {
    border-width: 1px;
    border-color: var(--au-color-text-secondary);
  }

  .au-input.au-field-shell.is-disabled {
    color: var(--au-color-text-secondary);
    border-color: currentColor;
  }

  .au-input.au-field-shell:focus-within:not(.is-disabled) {
    outline-color: var(--au-color-primary);
  }

  .au-input.au-field-shell.is-invalid {
    border-color: var(--au-color-danger);
  }

  .au-input.au-field-shell.is-invalid:focus-within {
    outline-color: var(--au-color-danger);
  }
}

@media (forced-colors: active) {
  .au-input.au-field-shell,
  .au-input.au-field-shell:hover:not(.is-disabled, .is-readonly, .is-invalid),
  .au-input.au-field-shell:focus-within:not(.is-disabled) {
    color: CanvasText;
    background: Canvas;
    border: 1px solid CanvasText;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
  }

  .au-input.au-field-shell.is-disabled {
    color: GrayText;
    border-color: GrayText;
  }

  .au-input.au-field-shell.is-invalid {
    border-style: dashed;
  }

  .au-input.au-field-shell:focus-within:not(.is-disabled) {
    outline: 2px solid Highlight;
  }

  .au-input__control::placeholder,
  .au-input__affix,
  .au-input__count,
  .au-input__loading {
    color: inherit;
  }
}

@media (prefers-reduced-motion: reduce) {
  .au-input.au-field-shell,
  .au-input__clear {
    transition: none;
  }

  .au-input__clear:active:not(:disabled) {
    transform: none;
  }
}
</style>
