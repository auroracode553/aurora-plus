<template>
  <button
    class="au-switch au-component au-choice-control au-control-reset au-focus-ring"
    :class="[
      `is-${size}`,
      {
        'is-checked': checked,
        'au-disabled': disabled || loading,
      },
    ]"
    type="button"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="disabled || loading ? 'true' : undefined"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="toggle"
  >
    <span class="au-switch__track" aria-hidden="true">
      <span class="au-switch__thumb au-depth-control au-inline-center">
        <AuLoadingSpinner
          v-if="loading"
          class="au-switch__loading"
          :size="size"
          color="var(--au-color-text-secondary)"
          compact
        />
      </span>
    </span>
    <span v-if="hasLabel" class="au-switch__label au-choice-label au-wrap-anywhere">
      <slot>{{ checked ? activeText : inactiveText }}</slot>
    </span>
  </button>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import AuLoadingSpinner from '../loading/AuLoadingSpinner.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [Boolean, String, Number], default: false },
  activeValue: { type: [Boolean, String, Number], default: true },
  inactiveValue: { type: [Boolean, String, Number], default: false },
  activeText: { type: String, default: '' },
  inactiveText: { type: String, default: '' },
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

const checked = computed(() => Object.is(props.modelValue, props.activeValue));
const hasLabel = computed(() => Boolean(slots.default || props.activeText || props.inactiveText));

function toggle() {
  if (props.disabled || props.loading) return;
  const value = checked.value ? props.inactiveValue : props.activeValue;
  emit('update:modelValue', value);
  emit('change', value);
}
</script>

<style scoped lang="scss" src="./AuSwitch.scss"></style>
