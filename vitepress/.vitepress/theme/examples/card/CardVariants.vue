<template>
  <div class="card-demo">
    <div class="card-demo__group">
      <AuCard type="default">
        <h3>default</h3>
        <p>白卡 + 细边框 + 轻阴影，轮廓清晰。</p>
      </AuCard>

      <AuCard type="flat">
        <h3>flat</h3>
        <p>纯白表面，无边框无阴影。</p>
      </AuCard>

      <AuCard type="elevated">
        <h3>elevated</h3>
        <p>细边框配更明显的阴影，从背景中浮起。</p>
      </AuCard>

      <AuCard type="subtle">
        <h3>subtle</h3>
        <p>浅灰表面，无边框无阴影，适合次级分组。</p>
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
