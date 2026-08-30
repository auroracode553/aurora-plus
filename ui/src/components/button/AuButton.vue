<template>
  <button
    class="au-button au-component au-depth-control au-focus-ring"
    :class="buttonClasses"
    :type="nativeType"
    :disabled="disabled || loading"
    v-bind="$attrs"
    :aria-busy="loading ? 'true' : undefined"
    :aria-pressed="resolvedAriaPressed"
    :style="buttonStyle"
    @click="handleClick"
  >
    <slot v-if="loading" name="loading">
      <AuIcon class="au-button__loading-icon au-spin" :icon="IconLoader2" />
    </slot>
    <slot v-else name="icon">
      <AuIcon v-if="icon" class="au-button__icon" :icon="icon" />
    </slot>
    <span v-if="$slots.default" class="au-button__content"><slot></slot></span>
  </button>
</template>

<script setup>
import { computed, useAttrs, useSlots } from 'vue';
import { IconLoader2 } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';

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
const attrs = useAttrs();
const slots = useSlots();

const resolvedAriaPressed = computed(() => {
  if (props.selected === undefined) return attrs['aria-pressed'];
  return props.selected ? 'true' : 'false';
});

const isSelected = computed(() => {
  return [resolvedAriaPressed.value, attrs['aria-current'], attrs['aria-expanded']].some(isAriaTrue);
});

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

function isAriaTrue(value) {
  return value === true || value === 'true';
}

function handleClick(event) {
  if (!props.disabled && !props.loading) emit('click', event);
}
</script>

<style scoped>
.au-button {
  --au-focus-ring-offset: 3px;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: 100%;
  height: 32px;
  gap: 6px;
  margin: 0;
  padding: 8px 15px;
  overflow: hidden;
  border: 1px solid var(--au-material-border-strong);
  border-radius: var(--au-radius-control);
  color: var(--au-color-text-regular);
  background: var(--au-material-bg);
  font-size: var(--au-font-size-base);
  font-weight: var(--au-font-weight-medium);
  line-height: 1;
  letter-spacing: -0.005em;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  appearance: none;
  transform: translateZ(0);
  transition:
    background var(--au-transition-duration) var(--au-transition-ease),
    border-color var(--au-transition-duration) var(--au-transition-ease),
    box-shadow var(--au-transition-duration) var(--au-transition-ease),
    color var(--au-transition-duration) var(--au-transition-ease),
    transform var(--au-transition-duration) var(--au-transition-ease);
}

.au-button:hover:not(.is-disabled) {
  border-color: color-mix(in srgb, var(--au-color-primary) 42%, transparent);
  color: var(--au-color-primary);
  background: color-mix(in srgb, var(--au-color-primary) 7%, var(--au-material-bg));
  box-shadow: var(--au-shadow-surface);
}

.au-button:active:not(.is-disabled) {
  border-color: color-mix(in srgb, var(--au-color-primary) 58%, transparent);
  color: var(--au-color-primary);
  background: color-mix(in srgb, var(--au-color-primary) 14%, var(--au-material-bg));
  box-shadow: var(--au-shadow-control);
  transform: scale(0.97);
}

.au-button--small {
  height: 28px;
  padding: 5px 11px;
  border-radius: var(--au-radius-small);
  font-size: var(--au-font-size-small);
}

.au-button--large {
  height: 40px;
  padding: 10px 19px;
  border-radius: var(--au-radius-control);
  font-size: var(--au-font-size-large);
}

.au-button.is-round {
  border-radius: var(--au-radius-round);
}

.au-button.is-circle {
  width: auto;
  aspect-ratio: 1;
  padding: 0;
  border-radius: var(--au-radius-round);
}

.au-button.is-disabled:active {
  transform: none;
}

.au-button__content {
  position: relative;
  z-index: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.au-button__icon,
.au-button__loading-icon {
  position: relative;
  z-index: 1;
  flex: none;
}

.au-button--primary {
  border-color: color-mix(in srgb, var(--au-color-primary) 78%, #ffffff);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-primary) 92%, #ffffff);
}

.au-button--success {
  border-color: color-mix(in srgb, var(--au-color-success) 78%, #ffffff);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-success) 92%, #ffffff);
}

.au-button--info {
  border-color: color-mix(in srgb, var(--au-color-info) 78%, #ffffff);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-info) 92%, #ffffff);
}

.au-button--warning {
  border-color: color-mix(in srgb, var(--au-color-warning) 78%, #ffffff);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-warning) 92%, #ffffff);
}

.au-button--danger {
  border-color: color-mix(in srgb, var(--au-color-danger) 78%, #ffffff);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-danger) 92%, #ffffff);
}

.au-button--primary:hover:not(.is-disabled) {
  border-color: var(--au-color-primary);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-primary) 82%, #ffffff);
}

.au-button--success:hover:not(.is-disabled) {
  border-color: var(--au-color-success);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-success) 82%, #ffffff);
}

.au-button--info:hover:not(.is-disabled) {
  border-color: var(--au-color-info);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-info) 82%, #ffffff);
}

.au-button--warning:hover:not(.is-disabled) {
  border-color: var(--au-color-warning);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-warning) 82%, #ffffff);
}

.au-button--danger:hover:not(.is-disabled) {
  border-color: var(--au-color-danger);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-danger) 82%, #ffffff);
}

.au-button--primary:active:not(.is-disabled) {
  border-color: var(--au-color-primary);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-primary) 100%, #102f72);
}

.au-button--success:active:not(.is-disabled) {
  border-color: var(--au-color-success);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-success) 100%, #15573e);
}

.au-button--info:active:not(.is-disabled) {
  border-color: var(--au-color-info);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-info) 100%, #3d4657);
}

.au-button--warning:active:not(.is-disabled) {
  border-color: var(--au-color-warning);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-warning) 100%, #754815);
}

.au-button--danger:active:not(.is-disabled) {
  border-color: var(--au-color-danger);
  color: #ffffff;
  background: color-mix(in srgb, var(--au-color-danger) 100%, #7e1e32);
}

.au-button--primary.is-plain {
  border-color: var(--au-color-primary);
  color: var(--au-color-primary);
  background: color-mix(in srgb, var(--au-color-primary) 12%, var(--au-material-bg));
}

.au-button--success.is-plain {
  border-color: var(--au-color-success);
  color: var(--au-color-success);
  background: color-mix(in srgb, var(--au-color-success) 12%, var(--au-material-bg));
}

.au-button--info.is-plain {
  border-color: var(--au-color-info);
  color: var(--au-color-info);
  background: color-mix(in srgb, var(--au-color-info) 12%, var(--au-material-bg));
}

.au-button--warning.is-plain {
  border-color: var(--au-color-warning);
  color: var(--au-color-warning);
  background: color-mix(in srgb, var(--au-color-warning) 12%, var(--au-material-bg));
}

.au-button--danger.is-plain {
  border-color: var(--au-color-danger);
  color: var(--au-color-danger);
  background: color-mix(in srgb, var(--au-color-danger) 12%, var(--au-material-bg));
}

.au-button--primary.is-plain:hover:not(.is-disabled) {
  background: var(--au-color-primary);
}

.au-button--success.is-plain:hover:not(.is-disabled) {
  background: var(--au-color-success);
}

.au-button--info.is-plain:hover:not(.is-disabled) {
  background: var(--au-color-info);
}

.au-button--warning.is-plain:hover:not(.is-disabled) {
  background: var(--au-color-warning);
}

.au-button--danger.is-plain:hover:not(.is-disabled) {
  background: var(--au-color-danger);
}

.au-button.au-button--menu {
  --au-focus-ring-offset: 0;

  min-width: 26px;
  height: 26px;
  gap: 4px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: var(--au-radius-small);
  color: var(--au-color-text-regular);
  background: transparent;
  box-shadow: none;
  font-size: 13px;
  font-weight: var(--au-font-weight-medium);
  letter-spacing: 0;
  -webkit-app-region: no-drag;
}

.au-button.au-button--menu.au-button--small {
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border-radius: var(--au-radius-small);
  font-size: var(--au-font-size-small);
}

.au-button.au-button--menu.au-button--large {
  min-width: 30px;
  height: 30px;
  padding: 0 10px;
  font-size: var(--au-font-size-base);
}

.au-button.au-button--menu.is-circle,
.au-button.au-button--menu.is-icon-only {
  width: 36px;
  padding: 0;
  border-radius: var(--au-radius-small);
}

.au-button.au-button--menu.au-button--small.is-circle,
.au-button.au-button--menu.au-button--small.is-icon-only {
  width: 32px;
}

.au-button.au-button--menu.au-button--large.is-circle,
.au-button.au-button--menu.au-button--large.is-icon-only {
  width: 40px;
}

.au-button.au-button--menu:hover:not(.is-disabled),
.au-button.au-button--menu:focus-visible {
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, currentColor 7%, transparent);
  box-shadow: none;
}

.au-button.au-button--menu:active:not(.is-disabled) {
  border-color: transparent;
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, currentColor 11%, transparent);
  box-shadow: none;
  transform: scale(0.98);
}

.au-button.au-button--menu.is-selected {
  border-color: color-mix(in srgb, currentColor 18%, transparent);
  color: var(--au-color-primary);
  background: color-mix(in srgb, currentColor 13%, transparent);
  box-shadow: none;
}

.au-button.au-button--menu.is-selected:hover:not(.is-disabled),
.au-button.au-button--menu.is-selected:focus-visible {
  background: color-mix(in srgb, currentColor 16%, transparent);
}

.au-button.au-button--menu.is-selected:active:not(.is-disabled) {
  border-color: color-mix(in srgb, currentColor 24%, transparent);
  background: color-mix(in srgb, currentColor 20%, transparent);
}

.au-button.au-button--menu.is-disabled {
  color: var(--au-color-text-disabled);
  background: transparent;
  box-shadow: none;
}

.au-button.au-button--menu.is-selected.is-disabled {
  border-color: color-mix(in srgb, currentColor 14%, transparent);
  background: color-mix(in srgb, currentColor 8%, transparent);
}

.au-button.au-button--menu:focus-visible {
  outline-offset: -2px;
}

@media (prefers-reduced-transparency: reduce) {
  .au-button.au-button--menu.is-selected {
    background: color-mix(in srgb, currentColor 13%, var(--au-color-bg-overlay));
  }
}

@media (prefers-contrast: more) {
  .au-button.au-button--menu.is-selected {
    border-color: currentColor;
    background: transparent;
  }
}

@media (forced-colors: active) {
  .au-button.au-button--menu.is-selected {
    border-color: Highlight;
    color: HighlightText;
    background: Highlight;
  }
}

</style>
