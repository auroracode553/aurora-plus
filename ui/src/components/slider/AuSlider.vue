<template>
  <div
    class="au-slider au-component"
    :class="[
      `is-${size}`,
      {
        'is-dragging': isDragging,
        'is-disabled': disabled,
        'au-disabled': disabled,
      },
      $attrs.class,
    ]"
    :style="$attrs.style"
  >
    <div
      ref="controlRef"
      class="au-slider__control"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerCancel"
      @lostpointercapture="handleLostPointerCapture"
    >
      <input
        ref="inputRef"
        class="au-slider__input"
        v-bind="getInputAttrs()"
        type="range"
        :value="currentValue"
        :min="rangeMin"
        :max="rangeMax"
        :step="normalizedStep"
        :disabled="disabled"
        :aria-valuetext="ariaValueText"
        @input="handleNativeInput"
        @change="handleNativeChange"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />

      <span ref="trackRef" class="au-slider__track" aria-hidden="true">
        <span class="au-slider__fill" :style="{ inlineSize: `${percentage}%` }"></span>
        <span
          class="au-slider__thumb"
          :style="{ insetInlineStart: `${percentage}%` }"
        ></span>
      </span>
    </div>

    <output
      v-if="hasValue"
      class="au-slider__value"
      :for="$attrs.id || undefined"
    >
      <slot
        name="value"
        :value="currentValue"
        :formatted-value="formattedValue"
        :percentage="percentage"
      >
        {{ formattedValue }}
      </slot>
    </output>
  </div>
</template>

<script setup>
import { computed, ref, useAttrs, useSlots, watch } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [Number, String], default: 0 },
  min: { type: [Number, String], default: 0 },
  max: { type: [Number, String], default: 100 },
  step: { type: [Number, String], default: 1 },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  disabled: { type: Boolean, default: false },
  showValue: { type: Boolean, default: false },
  formatValue: { type: Function, default: null },
});

const emit = defineEmits([
  'update:modelValue',
  'input',
  'change',
  'focus',
  'blur',
]);

const attrs = useAttrs();
const slots = useSlots();
const controlRef = ref(null);
const trackRef = ref(null);
const inputRef = ref(null);
const currentValue = ref(0);
const isDragging = ref(false);
const activePointerId = ref(null);
const pointerStartValue = ref(0);

const numericMin = computed(() => toFiniteNumber(props.min, 0));
const numericMax = computed(() => toFiniteNumber(props.max, 100));
const rangeMin = computed(() => Math.min(numericMin.value, numericMax.value));
const rangeMax = computed(() => Math.max(numericMin.value, numericMax.value));
const normalizedStep = computed(() => {
  const value = toFiniteNumber(props.step, 1);
  return value > 0 ? value : 1;
});
const percentage = computed(() => {
  const span = rangeMax.value - rangeMin.value;
  if (span <= 0) return 0;
  return Math.min(100, Math.max(0, ((currentValue.value - rangeMin.value) / span) * 100));
});
const formattedValue = computed(() => {
  const value = props.formatValue?.(currentValue.value) ?? currentValue.value;
  return String(value);
});
const ariaValueText = computed(() => (
  attrs['aria-valuetext']
  ?? (props.formatValue ? formattedValue.value : undefined)
));
const hasValue = computed(() => props.showValue || Boolean(slots.value));

function toFiniteNumber(value, fallback) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function getDecimalPlaces(value) {
  const match = String(value).toLowerCase().match(
    /^[-+]?(?:\d+)?(?:\.(\d*))?(?:e([-+]?\d+))?$/,
  );
  if (!match) return 0;

  const decimalLength = (match[1] || '').length;
  const exponent = Number(match[2] || 0);
  return Math.max(0, decimalLength - exponent);
}

/** 将任意输入限制到合法区间，并以 min 为基准吸附到 step。 */
function normalizeValue(value) {
  const min = rangeMin.value;
  const max = rangeMax.value;
  if (max <= min) return min;

  const numericValue = toFiniteNumber(value, min);
  const clampedValue = Math.min(max, Math.max(min, numericValue));
  const steps = Math.round((clampedValue - min) / normalizedStep.value);
  const snappedValue = min + steps * normalizedStep.value;
  const precision = Math.min(
    12,
    Math.max(getDecimalPlaces(min), getDecimalPlaces(normalizedStep.value)),
  );

  return Math.min(max, Math.max(min, Number(snappedValue.toFixed(precision))));
}

function getInputAttrs() {
  return Object.fromEntries(
    Object.entries(attrs).filter(([name]) => ![
      'class',
      'style',
      'aria-valuetext',
    ].includes(name)),
  );
}

function updateValue(value, event) {
  const nextValue = normalizeValue(value);
  if (Object.is(nextValue, currentValue.value)) return false;

  currentValue.value = nextValue;
  emit('update:modelValue', nextValue);
  emit('input', nextValue, event);
  return true;
}

/** 拖动直接映射到可见轨道，避免原生 range 在不同浏览器中的边距差异。 */
function updateFromPointer(event) {
  const track = trackRef.value;
  if (!track) return;

  const rect = track.getBoundingClientRect();
  if (rect.width <= 0) return;

  const horizontalRatio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  const direction = globalThis.getComputedStyle
    ? globalThis.getComputedStyle(controlRef.value).direction
    : 'ltr';
  const isRtl = direction === 'rtl';
  const ratio = isRtl ? 1 - horizontalRatio : horizontalRatio;
  updateValue(rangeMin.value + ratio * (rangeMax.value - rangeMin.value), event);
}

function handlePointerDown(event) {
  if (
    props.disabled
    || !event.isPrimary
    || activePointerId.value !== null
    || (event.pointerType === 'mouse' && event.button !== 0)
  ) return;

  event.preventDefault();
  activePointerId.value = event.pointerId;
  pointerStartValue.value = currentValue.value;
  isDragging.value = true;
  controlRef.value?.setPointerCapture?.(event.pointerId);
  inputRef.value?.focus({ preventScroll: true });
  updateFromPointer(event);
}

function handlePointerMove(event) {
  if (!isDragging.value || event.pointerId !== activePointerId.value) return;
  updateFromPointer(event);
}

function finishPointer(event, updatePosition) {
  if (event.pointerId !== activePointerId.value) return;
  if (updatePosition) updateFromPointer(event);

  const changed = !Object.is(currentValue.value, pointerStartValue.value);
  const pointerId = activePointerId.value;
  activePointerId.value = null;
  isDragging.value = false;

  if (controlRef.value?.hasPointerCapture?.(pointerId)) {
    controlRef.value.releasePointerCapture(pointerId);
  }
  if (changed) emit('change', currentValue.value, event);
}

function handlePointerUp(event) {
  finishPointer(event, true);
}

function handlePointerCancel(event) {
  finishPointer(event, false);
}

function handleLostPointerCapture(event) {
  finishPointer(event, false);
}

function handleNativeInput(event) {
  updateValue(event.target.value, event);
}

function handleNativeChange(event) {
  const value = normalizeValue(event.target.value);
  currentValue.value = value;
  emit('change', value, event);
}

function focus(options) {
  inputRef.value?.focus(options);
}

function blur() {
  inputRef.value?.blur();
}

watch(
  () => [props.modelValue, props.min, props.max, props.step],
  () => {
    currentValue.value = normalizeValue(props.modelValue);
  },
  { immediate: true },
);

defineExpose({ focus, blur, inputRef });
</script>

<style scoped lang="scss">
.au-slider {
  display: inline-flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  gap: 8px;
  color: var(--au-color-text-default);
  font-size: var(--au-font-size-base);
}

.au-slider__control {
  position: relative;
  width: 100%;
  min-width: 72px;
  height: 24px;
  flex: 1 1 auto;
  cursor: pointer;
  touch-action: none;
  user-select: none;
}

.au-slider.is-small .au-slider__control {
  height: 20px;
}

.au-slider.is-large .au-slider__control {
  height: 28px;
}

.au-slider__input {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}

.au-slider__track {
  position: absolute;
  inset-inline: 8px;
  top: 50%;
  height: 4px;
  border-radius: var(--au-radius-pill);
  background: var(--au-color-border-default);
  transform: translateY(-50%);
}

.au-slider.is-small .au-slider__track {
  inset-inline: 7px;
  height: 3px;
}

.au-slider.is-large .au-slider__track {
  inset-inline: 9px;
  height: 5px;
}

.au-slider__fill {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  border-radius: inherit;
  background: var(--au-color-primary);
}

.au-slider__thumb {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: var(--au-radius-pill);
  background: var(--au-color-primary);
  transform: translate(-50%, -50%);
  transition:
    transform var(--au-transition-duration) var(--au-transition-timing),
    box-shadow var(--au-transition-duration) var(--au-transition-timing);
}

.au-slider:dir(rtl) .au-slider__thumb {
  transform: translate(50%, -50%);
}

.au-slider.is-small .au-slider__thumb {
  width: 14px;
  height: 14px;
}

.au-slider.is-large .au-slider__thumb {
  width: 18px;
  height: 18px;
}

.au-slider:not(.is-disabled) .au-slider__control:hover .au-slider__thumb {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--au-color-primary) 10%, transparent);
}

.au-slider.is-dragging .au-slider__thumb {
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--au-color-primary) 14%, transparent);
  transform: translate(-50%, -50%) scale(0.94);
}

.au-slider.is-dragging:dir(rtl) .au-slider__thumb {
  transform: translate(50%, -50%) scale(0.94);
}

.au-slider__input:focus-visible ~ .au-slider__track .au-slider__thumb {
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--au-color-primary) 18%, transparent);
}

.au-slider__value {
  min-width: 3ch;
  color: var(--au-color-primary);
  font-size: var(--au-font-size-small);
  font-variant-numeric: tabular-nums;
  font-weight: var(--au-font-weight-semibold);
  line-height: 1;
  text-align: end;
  white-space: nowrap;
}

.au-slider.is-disabled .au-slider__control {
  cursor: not-allowed;
}

@media (prefers-contrast: more) {
  .au-slider__track {
    outline: 1px solid var(--au-color-text-secondary);
  }

  .au-slider__thumb {
    outline: 1px solid var(--au-color-text-primary);
  }
}

@media (forced-colors: active) {
  .au-slider__track {
    background: CanvasText;
  }

  .au-slider__fill,
  .au-slider__thumb {
    background: Highlight;
  }

  .au-slider__input:focus-visible ~ .au-slider__track .au-slider__thumb {
    outline: 2px solid Highlight;
    outline-offset: 3px;
  }
}
</style>
