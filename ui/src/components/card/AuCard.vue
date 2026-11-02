<template>
  <component
    :is="tag"
    v-glass="{ role: 'navigation', outline: type === 'default' }" class="au-card au-component au-surface au-surface--base au-motion-state"
    :class="[
      typeClass,
      `has-${padding}-padding`,
      { 'is-hoverable': hoverable },
    ]"
    :type="tag === 'button' ? 'button' : undefined"
    v-bind="$attrs"
  >
    <slot></slot>
  </component>
</template>

<script setup>
import { vGlass } from '../../utils/glass/directive.js';
import { computed } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  hoverable: { type: Boolean, default: false },
  tag: { type: [String, Object, Function], default: 'div' },
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'flat', 'subtle'].includes(value),
  },
  padding: {
    type: String,
    default: 'default',
    validator: (value) => ['none', 'compact', 'default', 'comfortable'].includes(value),
  },
});

// 默认 default 即基础样式，无需额外类型 class。
const typeClass = computed(() =>
  props.type === 'default' ? '' : `au-card--${props.type}`,
);
</script>

<style scoped lang="scss" src="./AuCard.scss"></style>
