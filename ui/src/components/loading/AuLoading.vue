<template>
  <div
    ref="rootRef"
    class="au-loading-host au-component"
    :class="{ 'is-positioned': !fullscreen }"
    :aria-busy="loading ? 'true' : undefined"
    v-bind="$attrs"
  >
    <slot></slot>

    <Teleport to="body" :disabled="!fullscreen">
      <AuLoadingOverlay
        :loading="loading"
        :text="text"
        :size="size"
        :spinner="spinner"
        :svg="svg"
        :svg-view-box="svgViewBox"
        :color="color"
        :fullscreen="fullscreen"
        :lock="lock"
        :background="background"
        :custom-class="customClass"
        :z-index="zIndex"
        :aria-label="ariaLabel"
        :delay="delay"
        @opened="emit('opened')"
        @closed="emit('closed')"
      >
        <template v-if="$slots.spinner" #spinner="slotProps">
          <slot name="spinner" v-bind="slotProps"></slot>
        </template>
      </AuLoadingOverlay>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AuLoadingOverlay from './AuLoadingOverlay.vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  /** 是否显示加载覆盖层。 */
  loading: { type: Boolean, default: false },
  text: { type: [String, Number, Array, Object], default: '' },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  spinner: { type: [Object, Function], default: null },
  /** 可信的 SVG 内部标记；不要传入未经清理的用户内容。 */
  svg: { type: String, default: '' },
  svgViewBox: { type: String, default: '0 0 24 24' },
  color: { type: String, default: '' },
  fullscreen: { type: Boolean, default: false },
  lock: { type: Boolean, default: false },
  background: { type: String, default: '' },
  customClass: { type: [String, Array, Object], default: '' },
  zIndex: { type: Number, default: 1000 },
  ariaLabel: { type: String, default: '加载中' },
  /** 延迟显示，避免极短请求造成闪烁。 */
  delay: { type: Number, default: 0, validator: (value) => value >= 0 },
});

const emit = defineEmits(['opened', 'closed']);
const rootRef = ref(null);

defineExpose({ rootRef });
</script>

<style scoped lang="scss">
.au-loading-host {
  min-width: 0;
  max-width: 100%;
}

.au-loading-host.is-positioned {
  position: relative;
}
</style>
