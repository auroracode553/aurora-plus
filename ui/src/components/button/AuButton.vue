<template>
  <button
    class="au-button au-component au-control-reset au-inline-center au-depth-control"
    :class="buttonClasses"
    :type="nativeType"
    :disabled="disabled || loading"
    v-bind="$attrs"
    :style="buttonStyle"
    @click="handleClick"
  >
    <slot v-if="loading" name="loading">
      <AuLoadingSpinner class="au-button__loading-icon" :size="size" color="currentColor" />
    </slot>
    <slot v-else name="icon">
      <AuIcon v-if="icon" class="au-button__icon" :icon="icon" />
    </slot>
    <span v-if="$slots.default" class="au-button__content au-truncate"><slot></slot></span>
  </button>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import { AuIcon } from '../icon/index.js';
import AuLoadingSpinner from '../loading/AuLoadingSpinner.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'info', 'warning', 'danger', 'menu'].includes(value),
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  selected: { type: Boolean, default: undefined },
  selectedColor: { type: String, default: '' },
  nativeType: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  /** Tabler Icons Vue 组件，传入组件本身而不是字符串名称。 */
  icon: { type: [Object, Function], default: null },
  plain: { type: Boolean, default: false },
  round: { type: Boolean, default: false },
  circle: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['click']);
const slots = useSlots();

const isSelected = computed(() => Boolean(props.selected));

const isIconOnly = computed(() => {
  return !slots.default && Boolean(props.icon || slots.icon || props.loading);
});

const buttonStyle = computed(() => {
  const color = String(props.selectedColor || '').trim();
  if (props.type !== 'menu' || !isSelected.value || !color || props.disabled || props.loading) {
    return undefined;
  }

  // 只注入选中强调色，浅色背景由 CSS 基于 currentColor 自动生成。
  return { color };
});

const buttonClasses = computed(() => [
  `au-button--${props.type}`,
  `au-button--${props.size}`,
  {
    'is-plain': props.plain,
    'is-round': props.round,
    'is-circle': props.circle,
    'is-icon-only': isIconOnly.value,
    'is-selected': isSelected.value,
    'is-disabled': props.disabled || props.loading,
    'au-disabled': props.disabled || props.loading,
  },
]);

function handleClick(event) {
  if (!props.disabled && !props.loading) emit('click', event);
}
</script>

<style scoped lang="scss" src="./AuButton.scss"></style>
