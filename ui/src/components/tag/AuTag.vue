<script setup>
defineProps({
  type: { type: String, default: 'default', validator: (value) => ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(value) },
  size: { type: String, default: 'default', validator: (value) => ['small', 'default', 'large'].includes(value) },
  dot: { type: Boolean, default: false },
  closable: { type: Boolean, default: false },
});
const emit = defineEmits(['close']);
</script>

<template>
  <span class="au-tag au-component au-motion-state" :class="[`au-tag--${type}`, `au-tag--${size}`]">
    <span v-if="dot" class="au-tag__dot" />
    <span class="au-tag__label"><slot /></span>
    <button v-if="closable" type="button" class="au-tag__close au-motion-control" title="关闭" @click.stop="emit('close', $event)">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 6 12 12M6 18 18 6" /></svg>
    </button>
  </span>
</template>

<style scoped lang="scss" src="./AuTag.scss"></style>
