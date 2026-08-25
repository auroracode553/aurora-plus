<template>
  <div
    class="au-button-group"
    :class="[
      `is-${variant}`,
      `is-${orientation}`,
      { 'is-icon-only': iconOnly },
    ]"
    role="group"
    :aria-label="ariaLabel || undefined"
  >
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'floating'].includes(value),
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value),
  },
  iconOnly: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '' },
});
</script>

<style scoped>
.au-button-group {
  --au-button-group-control-size: 28px;

  display: inline-flex;
  align-items: stretch;
  box-sizing: border-box;
  vertical-align: middle;
  isolation: isolate;
}

.au-button-group.is-vertical {
  flex-direction: column;
}

.au-button-group.is-default :deep(> .au-button) {
  position: relative;
  border-radius: 0;
}

.au-button-group.is-default :deep(> .au-button:hover),
.au-button-group.is-default :deep(> .au-button:focus-visible),
.au-button-group.is-default :deep(> .au-button:active) {
  z-index: 1;
}

.au-button-group.is-horizontal.is-default :deep(> .au-button + .au-button) {
  margin-left: -1px;
}

.au-button-group.is-horizontal.is-default :deep(> .au-button:first-child) {
  border-radius: var(--au-border-radius-base) 0 0 var(--au-border-radius-base);
}

.au-button-group.is-horizontal.is-default :deep(> .au-button:last-child) {
  border-radius: 0 var(--au-border-radius-base) var(--au-border-radius-base) 0;
}

.au-button-group.is-horizontal.is-default :deep(> .au-button:only-child) {
  border-radius: var(--au-border-radius-base);
}

.au-button-group.is-vertical.is-default :deep(> .au-button + .au-button) {
  margin-top: -1px;
}

.au-button-group.is-vertical.is-default :deep(> .au-button:first-child) {
  border-radius: var(--au-border-radius-base) var(--au-border-radius-base) 0 0;
}

.au-button-group.is-vertical.is-default :deep(> .au-button:last-child) {
  border-radius: 0 0 var(--au-border-radius-base) var(--au-border-radius-base);
}

.au-button-group.is-vertical.is-default :deep(> .au-button:only-child) {
  border-radius: var(--au-border-radius-base);
}

.au-button-group.is-floating {
  gap: 2px;
  padding: 2px;
  border: 1px solid color-mix(in srgb, var(--au-color-text-primary) 14%, transparent);
  border-radius: 10px;
  color: var(--au-color-text-regular);
  background: color-mix(in srgb, var(--au-color-bg-overlay) 82%, transparent);
  box-shadow: var(--au-shadow-light);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.au-button-group.is-floating :deep(> .au-button--default) {
  border-color: transparent;
  color: var(--au-color-text-regular);
  background: transparent;
}

.au-button-group.is-floating :deep(> .au-button--default:hover:not(.is-disabled)) {
  border-color: transparent;
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-color-text-primary) 11%, transparent);
}

.au-button-group.is-floating :deep(> .au-button--default:active:not(.is-disabled)) {
  border-color: transparent;
  background: color-mix(in srgb, var(--au-color-text-primary) 16%, transparent);
}

.au-button-group.is-floating :deep(> .au-button:focus-visible) {
  z-index: 1;
  outline-offset: -2px;
}

.au-button-group.is-icon-only :deep(> .au-button) {
  width: var(--au-button-group-control-size);
  min-width: var(--au-button-group-control-size);
  height: var(--au-button-group-control-size);
  padding: 0;
  border-radius: 7px;
}
</style>
