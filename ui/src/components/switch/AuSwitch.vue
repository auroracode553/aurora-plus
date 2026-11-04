<template>
  <button
    ref="root"
    class="au-switch au-component au-choice-control au-control-reset au-motion-state"
    :class="[
      `is-${size}`,
      {
        'is-checked': checked,
        'is-dragging': dragging,
        'au-disabled': disabled || loading,
      },
    ]"
    type="button"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="motion.click"
    @pointerdown="motion.down"
    @pointermove="motion.move"
    @pointerup="motion.up"
    @pointercancel="motion.lost"
    @lostpointercapture="motion.lost"
    @blur="motion.cancel"
  >
    <span class="au-switch__track" :style="trackStyle">
      <span class="au-switch__thumb au-inline-center" :style="thumbStyle">
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
import { computed, ref, useSlots } from 'vue';
import { useSwitchMotion } from './use-switch-motion.js';
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

const root = ref(null);
const motion = useSwitchMotion(props, checked, root, (active) => {
  if (props.disabled || props.loading) return;
  const value = active ? props.activeValue : props.inactiveValue;
  emit('update:modelValue', value);
  emit('change', value);
});
const { dragging, thumbStyle, trackStyle } = motion;
</script>

<style scoped lang="scss" src="./AuSwitch.scss"></style>
