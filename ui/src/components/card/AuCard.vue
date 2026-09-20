<template>
  <component
    :is="tag"
    class="au-card au-component au-material-surface au-material-surface--base"
    :class="[
      variantClass,
      `has-${padding}-padding`,
    ]"
    v-bind="$attrs"
  >
    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  tag: { type: [String, Object, Function], default: 'div' },
  variant: {
    type: String,
    default: 'outlined',
    validator: (value) => ['outlined', 'flat', 'elevated'].includes(value),
  },
  padding: {
    type: String,
    default: 'default',
    validator: (value) => ['none', 'compact', 'default', 'comfortable'].includes(value),
  },
});

// 默认 outlined 即基础样式，无需额外变体 class。
const variantClass = computed(() =>
  props.variant === 'outlined' ? '' : `au-card--${props.variant}`,
);
</script>

<style scoped lang="scss" src="./AuCard.scss"></style>
