<template>
  <div class="au-card au-component au-material-surface au-material-surface--base au-depth-surface au-surface-frame au-surface-frame--rounded">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.au-card {
  min-width: 0;
  max-width: 100%;
  padding: 8px 10px;
  color: var(--au-color-text-primary);
}
</style>
