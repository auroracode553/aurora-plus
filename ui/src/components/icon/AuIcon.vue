<template>
  <span
    class="au-icon au-component au-inline-center"
    :style="iconStyle"
    v-bind="$attrs"
  >
    <component
      :is="icon"
      v-if="icon"
      class="au-icon__graphic"
      :color="color || undefined"
      :stroke-width="strokeWidth || undefined"
    />
  </span>
</template>

<script setup>
import { computed } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  /** Tabler Icons Vue 组件，例如 IconHome、IconSearch。 */
  icon: { type: [Object, Function], default: null },
  color: { type: String, default: '' },
  size: { type: [String, Number], default: '' },
  strokeWidth: { type: Number, default: 2 },
});

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

<style scoped lang="scss" src="./AuIcon.scss"></style>
