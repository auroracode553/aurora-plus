<template>
  <span
    class="au-loading-spinner au-inline-center"
    :class="[`is-${size}`, { 'is-compact': compact }]"
    :style="{ color: color || undefined }"
  >
    <slot name="spinner">
      <svg
        v-if="svg"
        class="au-loading-spinner__icon au-loading-spinner__svg au-spin"
        :viewBox="svgViewBox"
        fill="none"
        stroke="currentColor"
        v-html="svg"
      ></svg>
      <AuIcon
        v-else
        class="au-loading-spinner__icon au-spin"
        :icon="spinner || IconLoader2"
      />
    </slot>
    <span v-if="text" class="au-loading-spinner__text au-wrap-anywhere">{{ text }}</span>
  </span>
</template>

<script setup>
import { IconLoader2 } from '../../icons/internal.js';
import { AuIcon } from '../icon/index.js';

defineProps({
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  text: { type: String, default: '' },
  color: { type: String, default: '' },
  /** Tabler 图标组件；不传时使用统一的环形加载图标。 */
  spinner: { type: [Object, Function], default: null },
  compact: { type: Boolean, default: false },
  /** 可信的 SVG 内部标记；不要传入未经清理的用户内容。 */
  svg: { type: String, default: '' },
  svgViewBox: { type: String, default: '0 0 24 24' },
});
</script>

<style scoped lang="scss" src="./AuLoadingSpinner.scss"></style>
