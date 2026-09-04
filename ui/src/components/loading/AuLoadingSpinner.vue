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
        aria-hidden="true"
        v-html="svg"
      ></svg>
      <AuIcon
        v-else
        class="au-loading-spinner__icon au-spin"
        :icon="spinner || IconLoader2"
        aria-hidden="true"
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

<style scoped lang="scss">
.au-loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  gap: 7px;
  color: var(--au-color-primary);
  line-height: 1;
}

.au-loading-spinner__icon {
  width: 20px;
  height: 20px;
  flex: none;
}

.au-loading-spinner__svg {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.au-loading-spinner.is-small .au-loading-spinner__icon {
  width: 16px;
  height: 16px;
}

.au-loading-spinner.is-large .au-loading-spinner__icon {
  width: 28px;
  height: 28px;
}

.au-loading-spinner.is-compact .au-loading-spinner__icon {
  width: 12px;
  height: 12px;
}

.au-loading-spinner.is-compact.is-small .au-loading-spinner__icon {
  width: 10px;
  height: 10px;
}

.au-loading-spinner.is-compact.is-large .au-loading-spinner__icon {
  width: 14px;
  height: 14px;
}

.au-loading-spinner__text {
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-base);
  line-height: 1.35;
}

.au-loading-spinner.is-small .au-loading-spinner__text {
  font-size: var(--au-font-size-small);
}

.au-loading-spinner.is-large .au-loading-spinner__text {
  font-size: var(--au-font-size-large);
}
</style>
