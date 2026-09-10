<template>
  <label
    class="au-checkbox au-component au-choice-control"
    :class="[
      `is-${size}`,
      {
        'is-checked': checked,
        'is-indeterminate': indeterminate,
        'is-disabled': disabled || loading,
        'au-disabled': disabled || loading,
      },
    ]"
    :aria-busy="loading ? 'true' : undefined"
  >
    <input
      ref="inputRef"
      class="au-checkbox__input au-visually-hidden"
      type="checkbox"
      :name="name || undefined"
      :value="value"
      :checked="checked"
      :disabled="disabled || loading"
      :aria-checked="indeterminate ? 'mixed' : checked"
      v-bind="$attrs"
      @change="handleChange"
    />
    <span class="au-checkbox__box au-depth-control au-inline-center" aria-hidden="true">
      <AuLoadingSpinner
        v-if="loading"
        class="au-checkbox__loading"
        :size="size"
        :color="checked || indeterminate ? '#ffffff' : 'var(--au-color-primary)'"
        compact
      />
      <span v-else class="au-checkbox__mark"></span>
    </span>
    <span v-if="hasLabel" class="au-checkbox__label au-choice-label au-wrap-anywhere">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, useSlots, watch } from 'vue';
import AuLoadingSpinner from '../loading/AuLoadingSpinner.vue';

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
  loading: { type: Boolean, default: false },
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
  if (props.disabled || props.loading) return;
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

<style scoped lang="scss" src="./AuCheckbox.scss"></style>
