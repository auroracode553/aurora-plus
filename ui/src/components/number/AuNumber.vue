<script setup>
import { computed } from 'vue';
import { formatNumberParts, numberCells } from '../../utils/number-format.js';
import { useMotionReady } from '../../utils/use-motion-ready.js';

const props = defineProps({
  value: { type: Number, default: null },
  precision: { type: Number, default: 0 },
  grouping: { type: Boolean, default: true },
  locale: { type: String, default: 'en-US' },
  animated: { type: Boolean, default: true },
});
const ready = useMotionReady(() => props.animated);
const cells = computed(() => numberCells(formatNumberParts(props.value, props)));
</script>

<template>
  <span class="au-number au-component au-motion-state" :class="{ 'is-animated': animated }">
    <span v-for="cell in cells" :key="cell.key" class="au-number__cell" :class="{ 'is-separator': cell.digit === null, 'is-fraction': cell.fraction }">
      <span v-if="cell.digit !== null" class="au-number__strip" :style="{ transform: `translateY(${-(ready || !animated ? cell.digit : 0) * 10}%)` }">
        <span v-for="digit in 10" :key="digit">{{ digit - 1 }}</span>
      </span>
      <template v-else>{{ cell.character }}</template>
    </span>
  </span>
</template>

<style scoped lang="scss" src="./AuNumber.scss"></style>
