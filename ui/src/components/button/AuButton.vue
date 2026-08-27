<template>
  <button
    class="au-button au-component au-depth-control au-focus-ring"
    :class="buttonClasses"
    :type="nativeType"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
    v-bind="$attrs"
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
import { computed } from 'vue';
import { IconLoader2 } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'info', 'warning', 'danger'].includes(value),
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
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

const buttonClasses = computed(() => [
  `au-button--${props.type}`,
  `au-button--${props.size}`,
  {
    'is-plain': props.plain,
    'is-round': props.round,
    'is-circle': props.circle,
    'is-disabled': props.disabled || props.loading,
    'au-disabled': props.disabled || props.loading,
    'is-loading': props.loading,
  },
]);

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
  height: 32px;
  gap: 6px;
  margin: 0;
  padding: 8px 15px;
  overflow: hidden;
  border: 1px solid var(--au-material-border-strong);
  border-radius: var(--au-border-radius-base);
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
  border-radius: var(--au-border-radius-small);
  font-size: var(--au-font-size-small);
}

.au-button--large {
  height: 40px;
  padding: 10px 19px;
  border-radius: 8px;
  font-size: var(--au-font-size-large);
}

.au-button.is-round {
  border-radius: 999px;
}

.au-button.is-circle {
  width: 32px;
  padding: 0;
  border-radius: 50%;
}

.au-button--small.is-circle {
  width: 28px;
}

.au-button--large.is-circle {
  width: 40px;
}

.au-button.is-disabled:active {
  transform: none;
}

.au-button__content,
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

</style>
