<script setup>
import { ref } from 'vue';
import { AuCard } from 'aurora-plus';

const selected = ref(false);
</script>

<template>
  <AuCard tag="button" padding="compact" hoverable class="card-interactive-example" @click="selected = !selected">
    {{ selected ? '已选择，点击取消' : '悬停抬升，点击选择' }}
  </AuCard>
</template>

<style scoped>
.card-interactive-example { width: min(320px, 100%); font: inherit; text-align: left; cursor: pointer; }
</style>
