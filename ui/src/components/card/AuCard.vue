<template>
  <div class="au-card au-component au-material-surface au-material-surface--base au-depth-surface">
    <slot></slot>
  </div>
</template>

<style scoped>
.au-card {
  min-width: 0;
  max-width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--au-material-border);
  border-radius: var(--au-radius-surface);
  color: var(--au-color-text-primary);
}

@media (prefers-contrast: more) {
  .au-card {
    border-color: var(--au-color-text-secondary);
  }
}
</style>
