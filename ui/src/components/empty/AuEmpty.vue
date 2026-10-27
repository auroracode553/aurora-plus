<script setup>
import AuIcon from '../icon/AuIcon.vue';

defineProps({
  title: { type: String, default: '暂无数据' },
  description: { type: String, default: '' },
  icon: { type: [Object, Function], default: null },
  size: { type: String, default: 'default', validator: (value) => ['small', 'default'].includes(value) },
});
</script>

<template>
  <div class="au-empty au-component au-motion-state au-motion-reveal" :class="`au-empty--${size}`">
    <div class="au-empty__image">
      <slot name="image">
        <AuIcon v-if="icon" :icon="icon" :size="24" />
        <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h20l3 13v6H3v-6L6 7ZM3 20h8l2 3h6l2-3h8M11 12h10M13 16h6" /></svg>
      </slot>
    </div>
    <div v-if="title || $slots.title" class="au-empty__title"><slot name="title">{{ title }}</slot></div>
    <div v-if="description || $slots.description" class="au-empty__description"><slot name="description">{{ description }}</slot></div>
    <div v-if="$slots.default" class="au-empty__actions"><slot /></div>
  </div>
</template>

<style scoped lang="scss" src="./AuEmpty.scss"></style>
