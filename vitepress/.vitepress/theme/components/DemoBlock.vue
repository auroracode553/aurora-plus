<template>
  <section class="au-doc-demo">
    <header v-if="title || description" class="au-doc-demo__header">
      <strong>{{ title }}</strong>
      <span v-if="description">{{ description }}</span>
    </header>
    <div class="au-doc-demo__body"><slot></slot></div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
});
</script>
