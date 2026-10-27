<script setup>
import AuButton from '../button/AuButton.vue';

defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  back: { type: Boolean, default: false },
  titleTag: { type: String, default: 'h2', validator: (value) => ['h1', 'h2', 'h3'].includes(value) },
});
const emit = defineEmits(['back']);
</script>

<template>
  <header class="au-page-header au-component au-motion-state au-motion-reveal">
    <div class="au-page-header__main">
      <AuButton v-if="back" type="menu" size="small" circle title="返回" @click="emit('back', $event)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 5-7 7 7 7M5 12h14" /></svg>
      </AuButton>
      <div class="au-page-header__heading">
        <component :is="titleTag" class="au-page-header__title"><slot name="title">{{ title }}</slot></component>
        <p v-if="description || $slots.description" class="au-page-header__description"><slot name="description">{{ description }}</slot></p>
      </div>
    </div>
    <div v-if="$slots.extra" class="au-page-header__extra"><slot name="extra" /></div>
    <div v-if="$slots.default" class="au-page-header__content"><slot /></div>
  </header>
</template>

<style scoped lang="scss" src="./AuPageHeader.scss"></style>
