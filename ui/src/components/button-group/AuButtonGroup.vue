<template>
  <div
    class="au-button-group au-component au-control-group"
    :class="[
      `is-${variant}`,
      `is-${orientation}`,
      {
        'is-icon-only': iconOnly,
        'au-material-surface': variant !== 'segmented',
        'au-material-surface--base': variant !== 'segmented',
        'au-material-blur': variant === 'segmented',
        'au-depth-surface': variant !== 'segmented',
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

<style scoped lang="scss">
.au-button-group {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  max-width: 100%;
  vertical-align: middle;
  isolation: isolate;
}

.au-button-group.is-vertical {
  align-items: stretch;
  flex-direction: column;
}

.au-button-group :deep(> .au-button-group-item),
.au-button-group :deep(> .au-button-group-item > .au-popover) {
  min-width: 0;
  max-width: 100%;
}

.au-button-group.is-vertical :deep(> .au-button-group-item),
.au-button-group.is-vertical :deep(> .au-button-group-item > .au-popover) {
  width: 100%;
}

/* 连体与悬浮控制组共用 UI 库的玻璃表面，只保留布局差异。 */
.au-button-group.is-connected,
.au-button-group.is-floating {
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--au-material-border);
  border-radius: var(--au-radius-surface);
  color: var(--au-color-text-default);
}

/* 分段选择使用同一套控制按钮，仅让容器占满并均分子项。 */
.au-button-group.is-segmented {
  width: 100%;
  gap: 2px;
  padding: 2px;
  border: 0;
  border-radius: var(--au-radius-surface);
  color: var(--au-color-text-default);
  background: var(--au-material-background-subtle);
}

.au-button-group.is-segmented :deep(> .au-button-group-item) {
  min-width: 0;
  flex: 1 1 0;
}

.au-button-group.is-segmented :deep(> .au-button),
.au-button-group.is-segmented :deep(> .au-button-group-item > .au-button) {
  width: 100%;
  min-width: 0;
  flex: 1 1 0;
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-semibold);
}

.au-button-group.is-vertical :deep(> .au-button),
.au-button-group.is-vertical :deep(> .au-button-group-item > .au-button),
.au-button-group.is-vertical :deep(> .au-button-group-item > .au-popover > .au-button) {
  width: 100%;
  justify-content: flex-start;
}

.au-button-group.is-icon-only :deep(> .au-button),
.au-button-group.is-icon-only :deep(> .au-button-group-item > .au-button),
.au-button-group.is-icon-only :deep(> .au-button-group-item > .au-popover > .au-button) {
  width: auto;
  min-width: 0;
  height: 28px;
  aspect-ratio: 1;
  padding: 0;
  border-radius: var(--au-radius-compact);
}

@media (prefers-reduced-transparency: reduce) {
  .au-button-group.is-segmented {
    background: var(--au-color-background-subtle);
  }
}

@media (prefers-contrast: more) {
  .au-button-group.is-segmented {
    border: 1px solid var(--au-color-text-secondary);
  }
}
</style>
