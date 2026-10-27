<script setup>
import { computed } from 'vue';
import { formatNumberParts } from '../../utils/number-format.js';

const props = defineProps({
  value: { type: Number, default: null },
  precision: { type: Number, default: 1 },
  suffix: { type: String, default: '%' },
  fresh: { type: Boolean, default: false },
  reverse: { type: Boolean, default: false },
  label: { type: String, default: '' },
});
const direction = computed(() => {
  if (props.fresh) return 'new';
  if (!Number.isFinite(props.value)) return 'unknown';
  return props.value > 0 ? 'up' : props.value < 0 ? 'down' : 'flat';
});
const tone = computed(() => {
  if (!['up', 'down'].includes(direction.value)) return 'neutral';
  return (direction.value === 'up') !== props.reverse ? 'success' : 'danger';
});
const text = computed(() => {
  if (props.fresh) return '新增';
  if (direction.value === 'unknown') return '—';
  const sign = { up: '+', down: '−', flat: '±' }[direction.value];
  return sign + formatNumberParts(Math.abs(props.value), { precision: props.precision }).map((part) => part.value).join('') + props.suffix;
});
</script>

<template>
  <span class="au-trend au-component au-motion-state" :class="`au-trend--${tone}`" :title="label || undefined">
    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
      <path v-if="direction === 'up'" d="M4 1 7 6H1z" />
      <path v-else-if="direction === 'down'" d="M4 7 1 2h6z" />
      <circle v-else-if="direction === 'new'" cx="4" cy="4" r="2" />
      <path v-else d="M1 3h6v2H1z" />
    </svg>
    <span>{{ text }}</span>
  </span>
</template>

<style scoped lang="scss" src="./AuTrend.scss"></style>
