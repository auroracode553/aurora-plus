<template>
  <label
    class="au-checkbox au-component"
    :class="[
      `is-${size}`,
      {
        'is-checked': checked,
        'is-indeterminate': indeterminate,
        'is-disabled': disabled,
        'au-disabled': disabled,
      },
    ]"
  >
    <input
      ref="inputRef"
      class="au-checkbox__input au-visually-hidden"
      type="checkbox"
      :name="name || undefined"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      :aria-checked="indeterminate ? 'mixed' : checked"
      v-bind="$attrs"
      @change="handleChange"
    />
    <span class="au-checkbox__box au-depth-control" aria-hidden="true">
      <span class="au-checkbox__mark"></span>
    </span>
    <span v-if="hasLabel" class="au-checkbox__label au-wrap-anywhere">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, useSlots, watch } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [Boolean, Array], default: false },
  value: { type: [String, Number, Boolean, Object], default: true },
  trueValue: { type: [Boolean, String, Number], default: true },
  falseValue: { type: [Boolean, String, Number], default: false },
  label: { type: String, default: '' },
  name: { type: String, default: '' },
  indeterminate: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'change']);
const slots = useSlots();
const inputRef = ref(null);

const checked = computed(() => {
  if (Array.isArray(props.modelValue)) return props.modelValue.some((item) => Object.is(item, props.value));
  return Object.is(props.modelValue, props.trueValue);
});
const hasLabel = computed(() => Boolean(slots.default || props.label));

function syncIndeterminate() {
  if (inputRef.value) inputRef.value.indeterminate = props.indeterminate;
}

function handleChange(event) {
  if (props.disabled) return;
  const nextValue = getNextValue();
  emit('update:modelValue', nextValue);
  emit('change', nextValue, event);
  nextTick(syncIndeterminate);
}

function getNextValue() {
  if (!Array.isArray(props.modelValue)) return checked.value ? props.falseValue : props.trueValue;
  if (checked.value) return props.modelValue.filter((item) => !Object.is(item, props.value));
  return [...props.modelValue, props.value];
}

watch(() => props.indeterminate, syncIndeterminate);
onMounted(syncIndeterminate);
</script>

<style scoped>
.au-checkbox {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  max-width: 100%;
  gap: 7px;
  min-height: 28px;
  color: var(--au-color-text-default);
  font-size: var(--au-font-size-base);
  font-weight: var(--au-font-weight-medium);
  line-height: 1.3;
  cursor: pointer;
  user-select: none;
}

.au-checkbox__label {
  min-width: 0;
  flex: 1 1 auto;
}

.au-checkbox.is-small {
  gap: 6px;
  min-height: 24px;
  font-size: var(--au-font-size-small);
}

.au-checkbox.is-large {
  gap: 8px;
  min-height: 32px;
  font-size: var(--au-font-size-large);
}

.au-checkbox__box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 18px;
  aspect-ratio: 1;
  flex: none;
  border: 1px solid var(--au-material-border-emphasis);
  border-radius: var(--au-radius-compact);
  background: var(--au-material-background-subtle);
  transition:
    background var(--au-transition-duration) var(--au-transition-timing),
    border-color var(--au-transition-duration) var(--au-transition-timing),
    transform var(--au-transition-duration) var(--au-transition-timing);
}

.is-small .au-checkbox__box {
  height: 16px;
  border-radius: var(--au-radius-compact);
}

.is-large .au-checkbox__box {
  height: 20px;
  border-radius: var(--au-radius-compact);
}

.au-checkbox__mark {
  width: 5px;
  height: 9px;
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
  opacity: 0;
  transform: translateY(-1px) rotate(45deg) scale(0.7);
  transition: opacity var(--au-transition-duration) var(--au-transition-timing), transform var(--au-transition-duration) var(--au-transition-timing);
}

.au-checkbox.is-checked .au-checkbox__box,
.au-checkbox.is-indeterminate .au-checkbox__box {
  border-color: var(--au-color-primary);
  background: var(--au-color-primary);
}

.au-checkbox.is-checked .au-checkbox__mark {
  opacity: 1;
  transform: translateY(-1px) rotate(45deg) scale(1);
}

.au-checkbox.is-indeterminate .au-checkbox__mark {
  width: 9px;
  height: 2px;
  border: 0;
  border-radius: var(--au-radius-pill);
  background: #ffffff;
  opacity: 1;
  transform: none;
}

.au-checkbox:hover:not(.is-disabled) .au-checkbox__box {
  border-color: color-mix(in srgb, var(--au-color-primary) 48%, var(--au-material-border-emphasis));
}

.au-checkbox__input:focus-visible + .au-checkbox__box {
  outline: var(--au-focus-ring-width) solid var(--au-focus-ring-color);
  outline-offset: 3px;
}

.au-checkbox:active:not(.is-disabled) .au-checkbox__box {
  transform: scale(0.94);
}

@media (prefers-reduced-transparency: reduce) {
  .au-checkbox__box {
    background: var(--au-color-background-overlay);
  }

  .au-checkbox.is-checked .au-checkbox__box,
  .au-checkbox.is-indeterminate .au-checkbox__box {
    background: var(--au-color-primary);
  }
}
</style>
