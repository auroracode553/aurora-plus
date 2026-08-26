<template>
  <div
    class="au-button-group au-component au-depth-surface"
    :class="[
      `is-${variant}`,
      `is-${orientation}`,
      {
        'is-icon-only': iconOnly,
        'au-material-blur': variant === 'connected',
      },
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
  vertical-align: middle;
  isolation: isolate;
}

.au-button-group.is-vertical {
  flex-direction: column;
}

.au-button-group.is-connected {
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--au-material-border-strong);
  border-radius: 13px;
  color: var(--au-color-text-regular);
  background: color-mix(in srgb, var(--au-material-bg-subtle) 72%, var(--au-color-bg-soft));
}

.au-button-group.is-vertical.is-connected {
  align-items: stretch;
}

.au-button-group.is-connected :deep(> .au-button) {
  position: relative;
  height: 30px;
  padding: 0 10px;
  border: 0;
  border-radius: 9px;
  color: var(--au-color-text-secondary);
  background: transparent;
  box-shadow: none;
  font-weight: var(--au-font-weight-medium);
  transform: none;
}

.au-button-group.is-vertical.is-connected :deep(> .au-button) {
  justify-content: flex-start;
}

.au-button-group.is-connected :deep(> .au-button:hover:not(.is-disabled)) {
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-color-text-primary) 7%, transparent);
  box-shadow: none;
}

.au-button-group.is-connected :deep(> .au-button:active:not(.is-disabled)) {
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-color-text-primary) 11%, transparent);
  box-shadow: none;
  transform: scale(0.98);
}

.au-button-group.is-connected :deep(> .au-button.is-active),
.au-button-group.is-connected :deep(> .au-button[aria-pressed='true']),
.au-button-group.is-connected :deep(> .au-button[aria-current='true']) {
  z-index: 1;
  color: var(--au-color-text-primary);
  background: var(--au-material-bg-strong);
  box-shadow: var(--au-shadow-control);
}

.au-button-group.is-connected :deep(> .au-button:focus-visible) {
  z-index: 2;
  outline: var(--au-focus-ring-width) solid var(--au-focus-ring-color);
  outline-offset: -1px;
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
  outline: 1px solid var(--au-focus-ring-color);
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
  .au-button-group.is-connected {
    background: var(--au-color-bg-soft);
  }

  .au-button-group.is-connected :deep(> .au-button.is-active),
  .au-button-group.is-connected :deep(> .au-button[aria-pressed='true']),
  .au-button-group.is-connected :deep(> .au-button[aria-current='true']) {
    background: var(--au-color-bg-overlay);
  }

  .au-button-group.is-floating {
    background: var(--au-color-bg-overlay);
  }
}
</style>
