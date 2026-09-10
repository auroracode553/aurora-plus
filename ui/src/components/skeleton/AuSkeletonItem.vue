<template>
  <span
    class="au-skeleton-item au-component"
    :class="[`is-${variant}`, { 'is-animated': isAnimated }]"
    :style="{ width: toDimension(width), height: toDimension(height) }"
  >
    <svg v-if="variant === 'image'" viewBox="0 0 32 32" fill="none">
      <rect x="5" y="6" width="22" height="20" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="m6 23 7-7 5 5 3-3 6 6" />
    </svg>
  </span>
</template>

<script setup>
import { computed, inject } from 'vue';
import { skeletonContextKey } from './skeleton-context.js';

const props = defineProps({
  variant: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'p', 'h1', 'h2', 'h3', 'caption', 'button', 'circle', 'rect', 'image'].includes(value),
  },
  width: { type: [String, Number], default: undefined },
  height: { type: [String, Number], default: undefined },
  animated: { type: Boolean, default: undefined },
});

const skeleton = inject(skeletonContextKey, null);
const isAnimated = computed(() => props.animated ?? skeleton?.animated.value ?? false);

function toDimension(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? `${Math.max(0, value)}px` : undefined;
  return value;
}
</script>

<style scoped lang="scss" src="./AuSkeletonItem.scss"></style>
