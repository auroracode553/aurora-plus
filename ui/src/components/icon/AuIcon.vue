<template>
  <span
    class="au-icon"
    :style="iconStyle"
    :aria-hidden="ariaLabel ? undefined : 'true'"
    :aria-label="ariaLabel || undefined"
    role="img"
    v-bind="$attrs"
    v-html="svgContent"
  ></span>
</template>

<script setup>
import { computed } from 'vue';
import { getIconSource } from './icon-registry.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  name: { type: String, default: '' },
  source: { type: String, default: '' },
  color: { type: String, default: '' },
  size: { type: [String, Number], default: '' },
  ariaLabel: { type: String, default: '' },
});

const svgContent = computed(() => props.source || getIconSource(props.name));

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
  width: 1em;
  height: 1em;
  color: inherit;
  line-height: 1;
  vertical-align: middle;
}

.au-icon :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
