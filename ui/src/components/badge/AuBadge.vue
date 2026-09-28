<template>
  <span class="au-badge au-component" :class="{ 'has-content': hasDefaultSlot }">
    <slot />
    <span
      v-if="visible"
      class="au-badge__mark"
      :class="[`is-${type}`, badgeClass, { 'is-dot': isDot }]"
      :style="markStyle"
    >
      <template v-if="!isDot">
        <slot name="content" :value="value">{{ displayValue }}</slot>
      </template>
    </span>
  </span>
</template>

<script setup>
import { computed, useSlots } from 'vue';

const props = defineProps({
  value: { type: [String, Number], default: '' },
  max: { type: Number, default: 99 },
  isDot: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
  showZero: { type: Boolean, default: true },
  type: {
    type: String,
    default: 'danger',
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'info'].includes(value),
  },
  color: { type: String, default: '' },
  offset: { type: Array, default: () => [0, 0] },
  badgeClass: { type: String, default: '' },
  badgeStyle: { type: Object, default: () => ({}) },
});

const slots = useSlots();
const hasDefaultSlot = computed(() => Boolean(slots.default));
const visible = computed(() => {
  if (props.hidden) return false;
  if (props.isDot) return true;
  if (props.value === 0 && !props.showZero) return false;
  if (slots.content) return true;
  if (props.value === '' || props.value === null || props.value === undefined) return false;
  return true;
});
const displayValue = computed(() => (
  typeof props.value === 'number' && props.value > props.max
    ? `${props.max}+`
    : props.value
));
const markStyle = computed(() => ({
  ...(hasDefaultSlot.value ? {
    right: `${Number(props.offset[0]) || 0}px`,
    top: `${Number(props.offset[1]) || 0}px`,
  } : {}),
  ...(props.color ? { backgroundColor: props.color } : {}),
  ...props.badgeStyle,
}));
</script>

<style scoped lang="scss" src="./AuBadge.scss"></style>
