<template>
  <AuCard class="card-demo">
    <h3>工作区与显示</h3>
    <p>这是一个空卡片，内容完全由默认插槽提供。</p>
  </AuCard>
</template>

<script setup>
import { AuCard } from 'aurora-ui';
</script>

<style scoped>
.card-demo {
  width: min(420px, 100%);
  margin: 0 auto;
}

.card-demo h3 {
  margin: 0 0 8px;
}

.card-demo p {
  margin: 0;
  color: var(--au-color-text-secondary);
}
</style>
