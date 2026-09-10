<template>
  <div
    class="au-button-group au-component"
    :class="[
      `is-${variant}`,
      `is-${orientation}`,
      `is-${size}`,
      {
        'is-icon-only': iconOnly,
        'is-inverse': inverse,
        'au-material-blur': variant === 'segmented',
      },
    ]"
    :role="role"
    :aria-label="ariaLabel || undefined"
    :aria-orientation="role === 'toolbar' ? orientation : undefined"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, provide } from 'vue';

const BUTTON_GROUP_CONTEXT = Symbol.for('aurora-plus.button-group-context');

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
  role: {
    type: String,
    default: 'group',
    validator: (value) => ['group', 'toolbar'].includes(value),
  },
  iconOnly: { type: Boolean, default: false },
  inverse: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '' },
});

provide(BUTTON_GROUP_CONTEXT, {
  variant: computed(() => props.variant),
  orientation: computed(() => props.orientation),
  size: computed(() => props.size),
  iconOnly: computed(() => props.iconOnly),
  inverse: computed(() => props.inverse),
});
</script>

<style scoped lang="scss" src="./AuButtonGroup.scss"></style>
