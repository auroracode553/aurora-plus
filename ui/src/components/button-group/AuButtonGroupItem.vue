<template>
  <button
    class="au-button-group-item au-component au-control-reset au-inline-center au-focus-ring"
    :class="itemClasses"
    :type="nativeType"
    :disabled="disabled || loading"
    v-bind="$attrs"
    :aria-busy="loading ? 'true' : undefined"
    :aria-pressed="resolvedAriaPressed"
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
import { computed, useAttrs, useSlots } from 'vue';
import { AuIcon } from '../icon/index.js';
import AuLoadingSpinner from '../loading/AuLoadingSpinner.vue';
import { useButtonGroupContext } from './button-group-context.js';

defineOptions({ inheritAttrs: false });

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
const attrs = useAttrs();
const slots = useSlots();
const group = useButtonGroupContext();

const variant = computed(() => group?.variant.value || 'connected');
const orientation = computed(() => group?.orientation.value || 'horizontal');
const size = computed(() => group?.size.value || 'default');
const inverse = computed(() => Boolean(group?.inverse.value));
const resolvedAriaPressed = computed(() => {
  if (props.selected === undefined) return attrs['aria-pressed'];
  return props.selected ? 'true' : 'false';
});
const isSelected = computed(() => [
  resolvedAriaPressed.value,
  attrs['aria-current'],
  attrs['aria-expanded'],
].some(isAriaTrue));
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
    'au-disabled': props.disabled || props.loading,
  },
]);

function isAriaTrue(value) {
  return value === true || value === 'true';
}

function handleClick(event) {
  if (!props.disabled && !props.loading) emit('click', event);
}
</script>

<style scoped lang="scss">
@use '../../theme/config';
@use './button-group-config' as group-config;

.au-button-group-item {
  --au-focus-ring-offset: 0;

  position: relative;
  min-width: 0;
  height: 28px;
  gap: 4px;
  padding: 0 8px;
  border: 0;
  border-radius: var(--au-radius-compact);
  color: var(--au-color-text-default);
  background: transparent;
  box-shadow: none;
  font-size: 13px;
  font-weight: var(--au-font-weight-medium);
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transform: translateZ(0);
  transition:
    background var(--au-transition-duration) var(--au-transition-timing),
    color var(--au-transition-duration) var(--au-transition-timing),
    transform var(--au-transition-duration) var(--au-transition-timing);
}

.au-button-group-item:hover:not(.is-disabled),
.au-button-group-item:focus-visible {
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, currentColor 7%, transparent);
}

.au-button-group-item:active:not(.is-disabled) {
  background: color-mix(in srgb, currentColor 11%, transparent);
  transform: scale(0.97);
}

.au-button-group-item.is-selected {
  z-index: 1;
  color: var(--au-color-text-primary);
  background: var(--au-material-background-elevated);
  box-shadow: var(--au-shadow-control);
}

.au-button-group-item.is-disabled {
  color: var(--au-color-text-disabled);
  background: transparent;
  box-shadow: none;
  cursor: not-allowed;
}

.au-button-group-item.is-small {
  height: 24px;
  padding: 0 7px;
  font-size: var(--au-font-size-small);
}

.au-button-group-item.is-large {
  height: 40px;
  padding: 0 14px;
  font-size: var(--au-font-size-large);
}

.au-button-group-item.is-icon-only {
  width: 28px;
  padding: 0;
  aspect-ratio: 1;
}

.au-button-group-item.is-small.is-icon-only {
  width: 24px;
}

.au-button-group-item.is-large.is-icon-only {
  width: 40px;
  font-size: 18px;
}

.au-button-group-item.is-segmented {
  width: 100%;
  flex: 1 1 0;
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-semibold);
}

.au-button-group-item.is-vertical:not(.is-icon-only) {
  width: 100%;
  justify-content: flex-start;
}

/* 面板边框与 2px 内边距合计 3px，按钮使用对应的同心内圆角。 */
.au-button-group-item.is-floating {
  border-radius: 9px;
}

.au-button-group-item.is-floating.is-small {
  border-radius: 5px;
}

.au-button-group-item.is-floating.is-large {
  border-radius: 11px;
}

.au-button-group-item.is-inverse {
  color: group-config.$inverse-color;
}

.au-button-group-item.is-inverse:hover:not(.is-disabled),
.au-button-group-item.is-inverse:focus-visible {
  color: #ffffff;
  background: group-config.$inverse-background-hover;
}

.au-button-group-item.is-inverse:active:not(.is-disabled) {
  color: #ffffff;
  background: group-config.$inverse-background-active;
}

.au-button-group-item.is-inverse.is-selected {
  color: #ffffff;
  background: rgb(255 255 255 / 14%);
  box-shadow: none;
}

.au-button-group-item.is-inverse.is-disabled {
  color: rgb(255 255 255 / 36%);
  background: transparent;
}

.au-button-group-item__content,
.au-button-group-item__icon,
.au-button-group-item__loading-icon {
  position: relative;
  z-index: 1;
}

@each $tone, $color in config.$semantic-colors {
  .au-button-group-item--#{$tone}:not(.is-disabled) {
    color: $color;
  }
}

@media (prefers-reduced-motion: reduce) {
  .au-button-group-item:active:not(.is-disabled) {
    transform: none;
  }
}

@media (prefers-contrast: more) {
  .au-button-group-item.is-selected:not(.is-disabled) {
    outline: 1px solid currentColor;
    outline-offset: -1px;
  }
}

@media (forced-colors: active) {
  .au-button-group-item {
    border: 1px solid ButtonText;
    color: ButtonText;
    background: Canvas;
  }

  .au-button-group-item.is-selected:not(.is-disabled) {
    color: HighlightText;
    background: Highlight;
  }
}
</style>
