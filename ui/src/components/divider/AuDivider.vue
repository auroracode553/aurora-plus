<template>
  <span
    class="au-divider au-component"
    :class="`is-${orientation}`"
    role="separator"
    :aria-orientation="orientation"
  ></span>
</template>

<script setup>
defineProps({
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value),
  },
});
</script>

<style scoped>
.au-divider {
  flex: none;
  border: 0;
  background: color-mix(in srgb, currentColor 24%, transparent);
}

.au-divider.is-horizontal {
  display: block;
  width: 100%;
  height: 1px;
  margin: 8px 0;
}

.au-divider.is-vertical {
  display: inline-flex;
  align-self: center;
  width: 1px;
  height: 16px;
  margin: 0 5px;
  vertical-align: middle;
}

@media (prefers-contrast: more) {
  .au-divider {
    background: currentColor;
  }
}

@media (forced-colors: active) {
  .au-divider {
    background: CanvasText;
  }
}
</style>
