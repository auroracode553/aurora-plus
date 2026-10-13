<script setup>
import { ref } from 'vue';
import { AuButton, AuNumber } from 'aurora-plus';

const value = ref(998.5);
function increase() { value.value = Math.round((value.value + 12.75) * 100) / 100; }
</script>

<template>
  <div class="number-example">
    <div class="number-example__values">
      <AuNumber :value="value" :precision="2" />
    </div>
    <div class="number-example__actions">
      <AuButton size="small" @click="increase">增加数值</AuButton>
      <AuButton size="small" @click="value = 998.5">重置</AuButton>
    </div>
  </div>
</template>

<style scoped>
.number-example { display: grid; width: 100%; gap: 16px; }
.number-example__values { display: flex; flex-wrap: wrap; align-items: baseline; gap: 20px; font-size: 28px; }
.number-example__actions { display: flex; flex-wrap: wrap; gap: 6px; }
</style>
