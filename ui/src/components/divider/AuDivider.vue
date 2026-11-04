<template>
  <span
    class="au-divider au-component au-motion-state"
    :class="[`is-${orientation}`, group ? `is-group-${group.size.value}` : '']"
  ></span>
</template>

<script setup>
import { useButtonGroup } from '../../utils/button-group-context.js';

const group = useButtonGroup();
defineProps({
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value),
  },
});
</script>

<style scoped lang="scss" src="./AuDivider.scss"></style>
