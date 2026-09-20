<template>
  <div class="card-demo">
    <div class="card-demo__group">
      <AuCard variant="outlined">
        <h3>outlined</h3>
        <p>默认变体：细边框 + 轻阴影，在浅色背景上轮廓清晰。</p>
      </AuCard>

      <AuCard variant="flat">
        <h3>flat</h3>
        <p>无边框无阴影的极简表面，适合已有明确边界的容器。</p>
      </AuCard>

      <AuCard variant="elevated">
        <h3>elevated</h3>
        <p>细边框配更明显的阴影，让卡片从页面背景中浮起。</p>
      </AuCard>
    </div>
  </div>
</template>

<script setup>
import { AuCard } from 'aurora-plus';
</script>

<style scoped>
.card-demo {
  width: min(560px, 100%);
  margin: 0 auto;
}

.card-demo__group {
  display: grid;
  gap: 12px;
}

.card-demo h3 {
  margin: 0 0 6px;
  font-size: var(--au-font-size-base);
}

.card-demo p {
  margin: 0;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
  line-height: 1.6;
}
</style>
