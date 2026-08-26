<template>
  <div class="au-card">
    <slot></slot>
  </div>
</template>

<style scoped>
.au-card {
  box-sizing: border-box;
  padding: var(--au-card-padding, 24px);
  border: 1px solid var(--au-material-border);
  border-radius: var(--au-card-border-radius, 16px);
  color: var(--au-color-text-primary);
  background: var(--au-material-bg);
  box-shadow: var(--au-shadow-overlay);
  backdrop-filter: blur(var(--au-material-blur)) saturate(var(--au-material-saturation));
  -webkit-backdrop-filter: blur(var(--au-material-blur)) saturate(var(--au-material-saturation));
}

@media (prefers-reduced-transparency: reduce) {
  .au-card {
    background: var(--au-color-bg-overlay);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: var(--au-shadow-overlay);
  }
}

@media (prefers-contrast: more) {
  .au-card {
    border-color: var(--au-color-text-secondary);
    background: var(--au-color-bg-overlay);
    box-shadow: var(--au-shadow-overlay);
  }
}
</style>
