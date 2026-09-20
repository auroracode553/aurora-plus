<template>
  <component
    :is="tag"
    class="au-card au-component au-material-surface au-material-surface--base"
    :class="[
      typeClass,
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
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'flat', 'elevated', 'subtle'].includes(value),
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
