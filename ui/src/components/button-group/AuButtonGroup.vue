<template>
  <div
    class="au-button-group au-component"
    :class="[
      `is-${variant}`,
      `is-${orientation}`,
      {
        'is-icon-only': iconOnly,
        'au-depth-surface': variant !== 'segmented',
        'au-material-blur': variant === 'connected',
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
defineProps({
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
  role: {
    type: String,
    default: 'group',
    validator: (value) => ['group', 'toolbar'].includes(value),
  },
  iconOnly: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '' },
});
</script>

<style scoped>
.au-button-group {
  display: inline-flex;
  align-items: stretch;
  vertical-align: middle;
  isolation: isolate;
}

.au-button-group.is-vertical {
  flex-direction: column;
}

.au-button-group :deep(> .au-button-group-item) {
  flex: 0 0 auto;
}

.au-button-group.is-vertical :deep(> .au-button-group-item) {
  width: 100%;
}

.au-button-group.is-connected {
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--au-material-border-strong);
  border-radius: var(--au-radius-surface);
  color: var(--au-color-text-regular);
  background: color-mix(in srgb, var(--au-material-bg-subtle) 72%, var(--au-color-bg-soft));
}

.au-button-group.is-vertical.is-connected {
  align-items: stretch;
}

.au-button-group.is-connected :deep(> .au-button),
.au-button-group.is-connected :deep(> .au-button-group-item > .au-button) {
  position: relative;
  height: 30px;
  padding: 0 10px;
  border: 0;
  border-radius: var(--au-radius-control);
  color: var(--au-color-text-secondary);
  background: transparent;
  box-shadow: none;
  font-weight: var(--au-font-weight-medium);
  transform: none;
}

.au-button-group.is-vertical.is-connected :deep(> .au-button),
.au-button-group.is-vertical.is-connected :deep(> .au-button-group-item > .au-button) {
  width: 100%;
  justify-content: flex-start;
}

.au-button-group.is-connected :deep(> .au-button:hover:not(.is-disabled)),
.au-button-group.is-connected :deep(> .au-button-group-item > .au-button:hover:not(.is-disabled)) {
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-color-text-primary) 7%, transparent);
  box-shadow: none;
}

.au-button-group.is-connected :deep(> .au-button:active:not(.is-disabled)),
.au-button-group.is-connected :deep(> .au-button-group-item > .au-button:active:not(.is-disabled)) {
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-color-text-primary) 11%, transparent);
  box-shadow: none;
  transform: scale(0.98);
}

.au-button-group.is-connected :deep(> .au-button.is-active),
.au-button-group.is-connected :deep(> .au-button[aria-pressed='true']),
.au-button-group.is-connected :deep(> .au-button[aria-current='true']),
.au-button-group.is-connected :deep(> .au-button[aria-expanded='true']),
.au-button-group.is-connected :deep(> .au-button-group-item > .au-button.is-active),
.au-button-group.is-connected :deep(> .au-button-group-item > .au-button[aria-pressed='true']),
.au-button-group.is-connected :deep(> .au-button-group-item > .au-button[aria-current='true']),
.au-button-group.is-connected :deep(> .au-button-group-item > .au-button[aria-expanded='true']) {
  z-index: 1;
  color: var(--au-color-text-primary);
  background: var(--au-material-bg-strong);
  box-shadow: var(--au-shadow-control);
}

.au-button-group.is-connected :deep(> .au-button:focus-visible),
.au-button-group.is-connected :deep(> .au-button-group-item > .au-button:focus-visible) {
  z-index: 2;
  outline: var(--au-focus-ring-width) solid var(--au-focus-ring-color);
  outline-offset: -1px;
}

.au-button-group.is-segmented {
  width: 100%;
  gap: 3px;
  padding: 3px;
  border: 0;
  border-radius: var(--au-radius-surface);
  color: var(--au-color-text-regular);
  background: color-mix(in srgb, var(--au-color-bg-soft) 88%, var(--au-material-bg-subtle));
}

.au-button-group.is-segmented :deep(> .au-button-group-item) {
  flex: 1 1 0;
  min-width: 0;
}

.au-button-group.is-segmented :deep(> .au-button),
.au-button-group.is-segmented :deep(> .au-button-group-item > .au-button) {
  flex: 1 1 0;
  width: 100%;
  min-width: 0;
  height: 28px;
  padding: 0 6px;
  border: 0;
  border-radius: var(--au-radius-control);
  color: var(--au-color-text-secondary);
  background: transparent;
  box-shadow: none;
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-semibold);
  transform: none;
}

.au-button-group.is-segmented :deep(> .au-button:hover:not(.is-disabled)),
.au-button-group.is-segmented :deep(> .au-button-group-item > .au-button:hover:not(.is-disabled)) {
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-color-text-primary) 6%, transparent);
  box-shadow: none;
}

.au-button-group.is-segmented :deep(> .au-button:active:not(.is-disabled)),
.au-button-group.is-segmented :deep(> .au-button-group-item > .au-button:active:not(.is-disabled)) {
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-color-text-primary) 10%, transparent);
  box-shadow: none;
  transform: scale(0.97);
}

.au-button-group.is-segmented :deep(> .au-button.is-active),
.au-button-group.is-segmented :deep(> .au-button[aria-pressed='true']),
.au-button-group.is-segmented :deep(> .au-button[aria-current='true']),
.au-button-group.is-segmented :deep(> .au-button-group-item > .au-button.is-active),
.au-button-group.is-segmented :deep(> .au-button-group-item > .au-button[aria-pressed='true']),
.au-button-group.is-segmented :deep(> .au-button-group-item > .au-button[aria-current='true']) {
  z-index: 1;
  color: var(--au-color-text-primary);
  background: var(--au-material-bg-strong);
  box-shadow: var(--au-shadow-control);
}

.au-button-group.is-segmented :deep(> .au-button:focus-visible),
.au-button-group.is-segmented :deep(> .au-button-group-item > .au-button:focus-visible) {
  z-index: 2;
  outline: var(--au-focus-ring-width) solid var(--au-focus-ring-color);
  outline-offset: -1px;
}

.au-button-group.is-floating {
  gap: 2px;
  padding: 2px;
  border: 1px solid color-mix(in srgb, var(--au-color-text-primary) 22%, transparent);
  border-radius: var(--au-radius-surface);
  color: var(--au-color-text-regular);
  background: color-mix(in srgb, var(--au-color-bg-overlay) 88%, #000000 12%);
}

/* The floating example is intentionally neutral gray, without blue glass tint. */
.au-button-group.is-floating[data-au-theme='dark'],
[data-au-theme='dark'] .au-button-group.is-floating {
  border-color: rgba(255, 255, 255, 0.3);
  color: #e1e3e7;
  background: #46474b;
}

.au-button-group.is-floating :deep(> .au-button--default),
.au-button-group.is-floating :deep(> .au-button-group-item > .au-button--default) {
  border: 1px solid color-mix(in srgb, var(--au-color-text-primary) 18%, transparent);
  border-radius: var(--au-radius-control);
  color: var(--au-color-text-regular);
  background: color-mix(in srgb, var(--au-color-text-primary) 8%, transparent);
  box-shadow: none;
}

.au-button-group.is-floating[data-au-theme='dark'] :deep(> .au-button--default),
.au-button-group.is-floating[data-au-theme='dark'] :deep(> .au-button-group-item > .au-button--default),
[data-au-theme='dark'] .au-button-group.is-floating :deep(> .au-button--default),
[data-au-theme='dark'] .au-button-group.is-floating :deep(> .au-button-group-item > .au-button--default) {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.06);
}

.au-button-group.is-floating :deep(> .au-button--default:hover:not(.is-disabled)),
.au-button-group.is-floating :deep(> .au-button-group-item > .au-button--default:hover:not(.is-disabled)) {
  border-color: color-mix(in srgb, var(--au-color-text-primary) 36%, transparent);
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-color-text-primary) 13%, transparent);
  box-shadow: none;
}

.au-button-group.is-floating :deep(> .au-button--default:active:not(.is-disabled)),
.au-button-group.is-floating :deep(> .au-button-group-item > .au-button--default:active:not(.is-disabled)) {
  border-color: color-mix(in srgb, var(--au-color-text-primary) 28%, transparent);
  background: color-mix(in srgb, #000000 14%, transparent);
  transform: none;
}

.au-button-group.is-floating :deep(> .au-button::before),
.au-button-group.is-floating :deep(> .au-button-group-item > .au-button::before) {
  display: none;
}

.au-button-group.is-floating :deep(> .au-button:focus-visible),
.au-button-group.is-floating :deep(> .au-button-group-item > .au-button:focus-visible) {
  z-index: 1;
  box-shadow: none;
  outline: 1px solid var(--au-focus-ring-color);
  outline-offset: -1px;
}

.au-button-group.is-icon-only :deep(> .au-button),
.au-button-group.is-icon-only :deep(> .au-button-group-item > .au-button) {
  width: 28px;
  min-width: 28px;
  height: 28px;
  padding: 0;
  border-radius: var(--au-radius-small);
}

@media (prefers-reduced-transparency: reduce) {
  .au-button-group.is-connected,
  .au-button-group.is-segmented {
    background: var(--au-color-bg-soft);
  }

  .au-button-group.is-connected :deep(> .au-button.is-active),
  .au-button-group.is-connected :deep(> .au-button[aria-pressed='true']),
  .au-button-group.is-connected :deep(> .au-button[aria-current='true']),
  .au-button-group.is-connected :deep(> .au-button[aria-expanded='true']),
  .au-button-group.is-connected :deep(> .au-button-group-item > .au-button.is-active),
  .au-button-group.is-connected :deep(> .au-button-group-item > .au-button[aria-pressed='true']),
  .au-button-group.is-connected :deep(> .au-button-group-item > .au-button[aria-current='true']),
  .au-button-group.is-connected :deep(> .au-button-group-item > .au-button[aria-expanded='true']),
  .au-button-group.is-segmented :deep(> .au-button.is-active),
  .au-button-group.is-segmented :deep(> .au-button[aria-pressed='true']),
  .au-button-group.is-segmented :deep(> .au-button[aria-current='true']),
  .au-button-group.is-segmented :deep(> .au-button-group-item > .au-button.is-active),
  .au-button-group.is-segmented :deep(> .au-button-group-item > .au-button[aria-pressed='true']),
  .au-button-group.is-segmented :deep(> .au-button-group-item > .au-button[aria-current='true']) {
    background: var(--au-color-bg-overlay);
  }

  .au-button-group.is-floating {
    background: var(--au-color-bg-overlay);
  }
}

@media (prefers-contrast: more) {
  .au-button-group.is-segmented {
    padding: 2px;
    border: 1px solid var(--au-color-text-secondary);
  }

  .au-button-group.is-segmented :deep(> .au-button.is-active),
  .au-button-group.is-segmented :deep(> .au-button[aria-pressed='true']),
  .au-button-group.is-segmented :deep(> .au-button[aria-current='true']),
  .au-button-group.is-segmented :deep(> .au-button-group-item > .au-button.is-active),
  .au-button-group.is-segmented :deep(> .au-button-group-item > .au-button[aria-pressed='true']),
  .au-button-group.is-segmented :deep(> .au-button-group-item > .au-button[aria-current='true']) {
    outline: 1px solid var(--au-color-text-secondary);
    outline-offset: -1px;
  }
}
</style>
