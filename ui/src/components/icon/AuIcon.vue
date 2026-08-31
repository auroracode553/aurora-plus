<template>
  <span
    class="au-icon au-component"
    :style="iconStyle"
    :aria-hidden="ariaLabel ? undefined : 'true'"
    :aria-label="ariaLabel || undefined"
    role="img"
    v-bind="$attrs"
  >
    <component
      :is="icon"
      v-if="icon"
      :color="color || undefined"
      :stroke-width="strokeWidth || undefined"
    />
  </span>
</template>

<script setup>
import { computed } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  /** Tabler Icons Vue 组件，例如 IconHome、IconSearch。 */
  icon: { type: [Object, Function], default: null },
  color: { type: String, default: '' },
  size: { type: [String, Number], default: '' },
  strokeWidth: { type: Number, default: 2 },
  ariaLabel: { type: String, default: '' },
});

const iconStyle = computed(() => {
  const style = {};
  if (props.color) style.color = props.color;
  if (props.size !== '') {
    const size = typeof props.size === 'number' ? `${props.size}px` : props.size;
    style.width = size;
    style.height = size;
    style.fontSize = size;
  }
  return style;
});
</script>

<style scoped>
.au-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 1em;
  aspect-ratio: 1;
  color: inherit;
  line-height: 1;
  vertical-align: middle;
  flex: none;
  overflow: hidden;
  font-variant-numeric: tabular-nums;
  contain: paint;
  transition: color var(--au-transition-duration) var(--au-transition-timing), opacity var(--au-transition-duration) var(--au-transition-timing);
}

.au-icon :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.au-icon[aria-label] {
  vertical-align: -0.125em;
}
</style>
