<template>
  <div class="au-card">
    <slot></slot>
  </div>
</template>

<style scoped>
.au-card {
  box-sizing: border-box;
  padding: var(--au-card-padding, 30px);
  border: 1px solid color-mix(in srgb, var(--au-color-border-light) 72%, transparent);
  border-radius: var(--au-card-border-radius, 28px);
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-color-bg-overlay) 86%, transparent);
  box-shadow: var(--au-shadow-overlay);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
}

@media (prefers-reduced-transparency: reduce) {
  .au-card {
    background: var(--au-color-bg-overlay);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

@media (prefers-contrast: more) {
  .au-card {
    border-color: var(--au-color-text-secondary);
    background: var(--au-color-bg-overlay);
  }
}
</style>
