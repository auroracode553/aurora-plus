<script setup>
import { computed } from 'vue';
import { useMotionReady } from '../../utils/use-motion-ready.js';

const props = defineProps({
  percentage: { type: Number, default: 0 },
  type: { type: String, default: 'line', validator: (value) => ['line', 'circle', 'ticks'].includes(value) },
  status: { type: String, default: '', validator: (value) => ['', 'success', 'warning', 'danger'].includes(value) },
  showText: { type: Boolean, default: true },
  format: { type: Function, default: null },
  width: { type: Number, default: 96, validator: (value) => Number.isFinite(value) && value > 0 },
  strokeWidth: { type: Number, default: 4, validator: (value) => Number.isFinite(value) && value > 0 },
  ticks: { type: Number, default: 60 },
  animated: { type: Boolean, default: true },
});
const ready = useMotionReady(() => props.animated);
const percentage = computed(() => Number.isFinite(props.percentage) ? Math.min(100, Math.max(0, props.percentage)) : 0);
const displayed = computed(() => ready.value || !props.animated ? percentage.value : 0);
const text = computed(() => props.format ? props.format(percentage.value) : `${Math.round(percentage.value)}%`);
const color = computed(() => `var(--au-color-${props.status || 'primary'})`);
const stroke = computed(() => Number.isFinite(props.strokeWidth) ? Math.min(20, Math.max(1, props.strokeWidth)) : 4);
const circumference = 2 * Math.PI * 44;
const marks = computed(() => {
  const count = Number.isFinite(props.ticks) ? Math.min(120, Math.max(4, Math.trunc(props.ticks))) : 60;
  return Array.from({ length: count }, (_, index) => {
    const angle = index / count * 2 * Math.PI - Math.PI / 2;
    const inner = index % 5 === 0 ? 37 : 41;
    return {
      x1: 50 + Math.cos(angle) * inner, y1: 50 + Math.sin(angle) * inner,
      x2: 50 + Math.cos(angle) * 47, y2: 50 + Math.sin(angle) * 47,
      lit: index < Math.round(displayed.value / 100 * count),
    };
  });
});
</script>

<template>
  <div class="au-progress au-component au-motion-state" :class="[`au-progress--${type}`, { 'is-animated': animated }]" :style="{ color }">
    <template v-if="type === 'line'">
      <div class="au-progress__track" :style="{ height: `${stroke}px` }"><div class="au-progress__fill" :style="{ transform: `scaleX(${displayed / 100})` }" /></div>
      <span v-if="showText" class="au-progress__text"><slot :percentage="percentage">{{ text }}</slot></span>
    </template>
    <div v-else class="au-progress__ring" :style="{ width: `${width}px`, maxWidth: '100%' }">
      <svg viewBox="0 0 100 100" class="au-progress__graphic">
        <template v-if="type === 'circle'">
          <circle class="au-progress__circle-track" cx="50" cy="50" r="44" fill="none" :stroke-width="stroke" />
          <circle class="au-progress__circle-fill" cx="50" cy="50" r="44" fill="none" :stroke-width="stroke" stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="circumference * (1 - displayed / 100)" transform="rotate(-90 50 50)" />
        </template>
        <line v-for="(mark, index) in type === 'ticks' ? marks : []" :key="index" class="au-progress__tick" :class="{ 'is-lit': mark.lit }" :x1="mark.x1" :y1="mark.y1" :x2="mark.x2" :y2="mark.y2" stroke-width="1.5" stroke-linecap="round" :style="{ transitionDelay: animated ? `${Math.min(index, 59) * 8}ms` : '0ms' }" />
      </svg>
      <span v-if="showText" class="au-progress__center"><slot :percentage="percentage">{{ text }}</slot></span>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./AuProgress.scss"></style>
