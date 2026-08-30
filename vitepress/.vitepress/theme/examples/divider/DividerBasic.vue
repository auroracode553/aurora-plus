<template>
  <p class="divider-demo__text">上方内容</p>
  <AuDivider />
  <p class="divider-demo__text">下方内容</p>

  <span>概览</span>
  <AuDivider orientation="vertical" />
  <span>详情</span>
</template>

<script setup>
import { AuDivider } from 'aurora-ui';
</script>

<style scoped>
.divider-demo__text {
  margin: 0;
}
</style>
