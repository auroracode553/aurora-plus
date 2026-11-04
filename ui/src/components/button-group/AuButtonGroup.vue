<template>
  <div
    class="au-button-group au-component au-motion-state"
    :class="[
      `is-${variant}`,
      `is-${orientation}`,
      `is-${size}`,
      {
        'is-icon-only': iconOnly,
        'is-inverse': inverse,
      },
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { provideButtonGroup } from '../../utils/button-group-context.js';

const props = defineProps({
  variant: {
    type: String,
    default: 'connected',
    validator: (value) => ['connected', 'segmented', 'floating'].includes(value),
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value),
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  iconOnly: { type: Boolean, default: false },
  inverse: { type: Boolean, default: false },
});

provideButtonGroup({
  variant: () => props.variant,
  orientation: () => props.orientation,
  size: () => props.size,
  iconOnly: () => props.iconOnly,
  inverse: () => props.inverse,
});
</script>

<style scoped lang="scss" src="./AuButtonGroup.scss"></style>
