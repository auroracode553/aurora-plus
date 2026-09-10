<template>
  <button
    class="au-button-group-item au-component au-control-reset au-inline-center"
    :class="itemClasses"
    :type="nativeType"
    :disabled="disabled || loading"
    v-bind="$attrs"
    :style="itemStyle"
    @click="handleClick"
  >
    <slot v-if="loading" name="loading">
      <AuLoadingSpinner class="au-button-group-item__loading-icon" :size="size" color="currentColor" />
    </slot>
    <slot v-else name="icon">
      <AuIcon v-if="icon" class="au-button-group-item__icon" :icon="icon" />
    </slot>
    <span v-if="$slots.default" class="au-button-group-item__content au-truncate"><slot></slot></span>
  </button>
</template>

<script setup>
import { computed, inject, useSlots } from 'vue';
import { AuIcon } from '../icon/index.js';
import AuLoadingSpinner from '../loading/AuLoadingSpinner.vue';

defineOptions({ inheritAttrs: false });

const BUTTON_GROUP_CONTEXT = Symbol.for('aurora-plus.button-group-context');

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'info', 'warning', 'danger'].includes(value),
  },
  selected: { type: Boolean, default: undefined },
  selectedColor: { type: String, default: '' },
  nativeType: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  icon: { type: [Object, Function], default: null },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['click']);
const slots = useSlots();
const group = inject(BUTTON_GROUP_CONTEXT, null);

const variant = computed(() => group?.variant.value || 'connected');
const orientation = computed(() => group?.orientation.value || 'horizontal');
const size = computed(() => group?.size.value || 'default');
const inverse = computed(() => Boolean(group?.inverse.value));
const isSelected = computed(() => Boolean(props.selected));

const isIconOnly = computed(() => Boolean(
  group?.iconOnly.value || (!slots.default && (props.icon || slots.icon || props.loading)),
));
const itemStyle = computed(() => {
  const color = String(props.selectedColor || '').trim();
  if (!isSelected.value || !color || props.disabled || props.loading) return undefined;
  return { color };
});
const itemClasses = computed(() => [
  `au-button-group-item--${props.type}`,
  `is-${variant.value}`,
  `is-${orientation.value}`,
  `is-${size.value}`,
  {
    'is-inverse': inverse.value,
    'is-icon-only': isIconOnly.value,
    'is-selected': isSelected.value,
    'is-disabled': props.disabled || props.loading,
  },
]);

function handleClick(event) {
  if (!props.disabled && !props.loading) emit('click', event);
}
</script>

<style scoped lang="scss" src="./AuButtonGroupItem.scss"></style>
