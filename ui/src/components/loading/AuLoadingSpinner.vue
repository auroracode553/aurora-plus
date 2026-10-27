<template>
  <span
    class="au-loading-spinner au-inline-center"
    :class="[`is-${size}`, { 'is-compact': compact }]"
    :style="{ color: color || undefined }"
  >
    <slot name="spinner" :size="size" :variant="variant">
      <svg
        v-if="svg"
        class="au-loading-spinner__icon au-loading-spinner__svg au-spin"
        :viewBox="svgViewBox"
        fill="none"
        stroke="currentColor"
        v-html="svg"
      ></svg>
      <AuIcon
        v-else-if="spinner"
        class="au-loading-spinner__icon au-spin"
        :icon="spinner"
      />
      <span v-else class="au-loading-spinner__indicator" :class="`is-${variant}`">
        <i v-for="index in segmentCount" :key="index"></i>
      </span>
    </slot>
    <span v-if="text" class="au-loading-spinner__text au-wrap-anywhere">{{ text }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue';
import { AuIcon } from '../icon/index.js';
import { loadingVariantProp } from './loading-variants.js';

const props = defineProps({
  variant: loadingVariantProp,
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  text: { type: String, default: '' },
  color: { type: String, default: '' },
  /** 自定义图标优先于内置 variant。 */
  spinner: { type: [Object, Function], default: null },
  compact: { type: Boolean, default: false },
  /** 可信的 SVG 内部标记；不要传入未经清理的用户内容。 */
  svg: { type: String, default: '' },
  svgViewBox: { type: String, default: '0 0 24 24' },
});

const segmentCount = computed(() => ({ ring: 1, dots: 3, bars: 4, orbit: 2 })[props.variant] || 1);
</script>

<style scoped lang="scss" src="./AuLoadingSpinner.scss"></style>
