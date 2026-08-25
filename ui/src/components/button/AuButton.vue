<template>
  <button
    class="au-button"
    :class="buttonClasses"
    :type="nativeType"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot v-if="loading" name="loading">
      <AuIcon class="au-button__loading-icon" name="loading" />
    </slot>
    <slot v-else name="icon">
      <AuIcon v-if="icon" class="au-button__icon" :name="icon" />
    </slot>
    <span v-if="$slots.default" class="au-button__content"><slot></slot></span>
  </button>
</template>

<script setup>
import { computed } from 'vue';
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
  icon: { type: String, default: '' },
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
    'is-loading': props.loading,
  },
]);

function handleClick(event) {
  if (!props.disabled && !props.loading) emit('click', event);
}
</script>

<style scoped>
.au-button {
  --au-button-bg: var(--au-color-bg);
  --au-button-border: var(--au-color-border);
  --au-button-text: var(--au-color-text-regular);
  --au-button-hover-bg: var(--au-button-default-hover-bg);
  --au-button-hover-border: var(--au-button-default-hover-border);
  --au-button-hover-text: var(--au-button-default-hover-text);
  --au-button-active-bg: var(--au-button-default-active-bg);
  --au-button-active-border: var(--au-button-default-active-border);
  --au-button-active-text: var(--au-button-default-active-text);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  margin: 0;
  padding: 8px 15px;
  border: 1px solid var(--au-button-border);
  border-radius: var(--au-border-radius-base);
  color: var(--au-button-text);
  background: var(--au-button-bg);
  font-size: var(--au-font-size-base);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  outline: none;
  appearance: none;
  transition:
    background var(--au-transition-duration) ease,
    border-color var(--au-transition-duration) ease,
    color var(--au-transition-duration) ease,
    box-shadow var(--au-transition-duration) ease;
}

.au-button:hover:not(.is-disabled) {
  border-color: var(--au-button-hover-border);
  color: var(--au-button-hover-text);
  background: var(--au-button-hover-bg);
}

.au-button:active:not(.is-disabled) {
  border-color: var(--au-button-active-border);
  color: var(--au-button-active-text);
  background: var(--au-button-active-bg);
  transform: scale(0.97);
}

.au-button:focus-visible:not(.is-disabled) {
  outline: 2px solid color-mix(in srgb, var(--au-color-primary) 42%, transparent);
  outline-offset: 2px;
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

.au-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.au-button.is-disabled:active {
  transform: none;
}

.au-button__icon,
.au-button__loading-icon {
  flex: none;
  font-size: 1em;
}

.au-button__loading-icon {
  animation: au-button-spin 0.8s linear infinite;
}

@keyframes au-button-spin {
  to {
    transform: rotate(360deg);
  }
}

.au-button--primary {
  --au-button-bg: var(--au-color-primary);
  --au-button-border: var(--au-color-primary);
  --au-button-text: #ffffff;
  --au-button-hover-bg: #66b1ff;
  --au-button-hover-border: #66b1ff;
  --au-button-hover-text: #ffffff;
  --au-button-active-bg: #3a8ee6;
  --au-button-active-border: #3a8ee6;
  --au-button-active-text: #ffffff;
}

.au-button--success {
  --au-button-bg: var(--au-color-success);
  --au-button-border: var(--au-color-success);
  --au-button-text: #ffffff;
  --au-button-hover-bg: #85ce61;
  --au-button-hover-border: #85ce61;
  --au-button-hover-text: #ffffff;
  --au-button-active-bg: #5daf34;
  --au-button-active-border: #5daf34;
  --au-button-active-text: #ffffff;
}

.au-button--info {
  --au-button-bg: var(--au-color-info);
  --au-button-border: var(--au-color-info);
  --au-button-text: #ffffff;
  --au-button-hover-bg: #a6a9ad;
  --au-button-hover-border: #a6a9ad;
  --au-button-hover-text: #ffffff;
  --au-button-active-bg: #82848a;
  --au-button-active-border: #82848a;
  --au-button-active-text: #ffffff;
}

.au-button--warning {
  --au-button-bg: var(--au-color-warning);
  --au-button-border: var(--au-color-warning);
  --au-button-text: #ffffff;
  --au-button-hover-bg: #ebb563;
  --au-button-hover-border: #ebb563;
  --au-button-hover-text: #ffffff;
  --au-button-active-bg: #cf9236;
  --au-button-active-border: #cf9236;
  --au-button-active-text: #ffffff;
}

.au-button--danger {
  --au-button-bg: var(--au-color-danger);
  --au-button-border: var(--au-color-danger);
  --au-button-text: #ffffff;
  --au-button-hover-bg: #f78989;
  --au-button-hover-border: #f78989;
  --au-button-hover-text: #ffffff;
  --au-button-active-bg: #dd6161;
  --au-button-active-border: #dd6161;
  --au-button-active-text: #ffffff;
}

.au-button--primary.is-plain,
.au-button--success.is-plain,
.au-button--info.is-plain,
.au-button--warning.is-plain,
.au-button--danger.is-plain {
  --au-button-bg: color-mix(in srgb, var(--au-button-border) 10%, var(--au-color-bg));
  --au-button-text: var(--au-button-border);
  --au-button-hover-bg: var(--au-button-border);
  --au-button-hover-text: #ffffff;
  --au-button-active-text: #ffffff;
}
</style>
