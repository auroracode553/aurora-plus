<template>
  <span
    class="au-divider au-component au-motion-state"
    :class="`is-${orientation}`"
  ></span>
</template>

<script setup>
defineProps({
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value),
  },
});
</script>

<style scoped lang="scss" src="./AuDivider.scss"></style>
