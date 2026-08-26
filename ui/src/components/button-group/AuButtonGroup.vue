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
    default: 'connected',
    validator: (value) => ['connected', 'floating'].includes(value),
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
  /* Keep groups dense by default; glass is expressed through surface tokens. */
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

.au-button-group.is-connected :deep(> .au-button) {
  position: relative;
  border-radius: 0;
}

.au-button-group.is-connected :deep(> .au-button:hover),
.au-button-group.is-connected :deep(> .au-button:focus-visible),
.au-button-group.is-connected :deep(> .au-button:active) {
  z-index: 1;
}

.au-button-group.is-horizontal.is-connected :deep(> .au-button + .au-button) {
  margin-left: -1px;
}

.au-button-group.is-horizontal.is-connected :deep(> .au-button:first-child) {
  border-radius: var(--au-border-radius-base) 0 0 var(--au-border-radius-base);
}

.au-button-group.is-horizontal.is-connected :deep(> .au-button:last-child) {
  border-radius: 0 var(--au-border-radius-base) var(--au-border-radius-base) 0;
}

.au-button-group.is-horizontal.is-connected :deep(> .au-button:only-child) {
  border-radius: var(--au-border-radius-base);
}

.au-button-group.is-vertical.is-connected :deep(> .au-button + .au-button) {
  margin-top: -1px;
}

.au-button-group.is-vertical.is-connected :deep(> .au-button:first-child) {
  border-radius: var(--au-border-radius-base) var(--au-border-radius-base) 0 0;
}

.au-button-group.is-vertical.is-connected :deep(> .au-button:last-child) {
  border-radius: 0 0 var(--au-border-radius-base) var(--au-border-radius-base);
}

.au-button-group.is-vertical.is-connected :deep(> .au-button:only-child) {
  border-radius: var(--au-border-radius-base);
}

.au-button-group.is-floating {
  --au-button-group-control-size: 28px;
  --au-button-group-surface: color-mix(in srgb, var(--au-color-bg-overlay) 88%, #000000 12%);
  --au-button-group-border: color-mix(in srgb, var(--au-color-text-primary) 22%, transparent);
  --au-button-group-control-surface: color-mix(in srgb, var(--au-color-text-primary) 8%, transparent);
  --au-button-group-control-border: color-mix(in srgb, var(--au-color-text-primary) 18%, transparent);

  gap: 2px;
  padding: 2px;
  border: 1px solid var(--au-button-group-border);
  border-radius: 10px;
  color: var(--au-color-text-regular);
  background: var(--au-button-group-surface);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.22);
}

/* The floating example is intentionally neutral gray, without blue glass tint. */
.au-button-group.is-floating[data-au-theme='dark'],
[data-au-theme='dark'] .au-button-group.is-floating {
  --au-button-group-surface: #46474b;
  --au-button-group-border: rgba(255, 255, 255, 0.3);
  --au-button-group-control-surface: rgba(255, 255, 255, 0.06);
  --au-button-group-control-border: rgba(255, 255, 255, 0.3);
  color: #e1e3e7;
}

.au-button-group.is-floating :deep(> .au-button--default) {
  border: 1px solid var(--au-button-group-control-border);
  border-radius: 8px;
  color: var(--au-color-text-regular);
  background: var(--au-button-group-control-surface);
  box-shadow: none;
}

.au-button-group.is-floating :deep(> .au-button--default:hover:not(.is-disabled)) {
  border-color: color-mix(in srgb, var(--au-color-text-primary) 36%, transparent);
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-color-text-primary) 13%, transparent);
  box-shadow: none;
}

.au-button-group.is-floating :deep(> .au-button--default:active:not(.is-disabled)) {
  border-color: color-mix(in srgb, var(--au-color-text-primary) 28%, transparent);
  background: color-mix(in srgb, #000000 14%, transparent);
  transform: none;
}

.au-button-group.is-floating :deep(> .au-button::before) {
  display: none;
}

.au-button-group.is-floating :deep(> .au-button:focus-visible) {
  z-index: 1;
  box-shadow: none;
  outline: 1px solid var(--au-color-primary);
  outline-offset: -1px;
}

.au-button-group.is-icon-only :deep(> .au-button) {
  width: var(--au-button-group-control-size);
  min-width: var(--au-button-group-control-size);
  height: var(--au-button-group-control-size);
  padding: 0;
  border-radius: 7px;
}

@media (prefers-reduced-transparency: reduce) {
  .au-button-group.is-floating {
    background: var(--au-color-bg-overlay);
  }
}
</style>
