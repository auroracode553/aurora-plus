<script setup>
import { ref } from 'vue';
import { AuButton, AuTag, AuTransition } from 'aurora-plus';

const visible = ref(true);
</script>

<template>
  <div class="tag-example">
    <AuTag dot>默认</AuTag>
    <AuTag type="primary" dot>进行中</AuTag>
    <AuTag type="success" dot>已完成</AuTag>
    <AuTag type="warning">待确认</AuTag>
    <AuTag type="danger">失败</AuTag>
    <AuTag type="info" size="small">小标签</AuTag>
    <AuTransition preset="scale">
      <AuTag v-if="visible" closable @close="visible = false">可移除</AuTag>
    </AuTransition>
    <AuButton v-if="!visible" size="small" @click="visible = true">恢复标签</AuButton>
  </div>
</template>

<style scoped>
.tag-example { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
</style>
