<script setup>
import { ref } from 'vue';
import { AuButton, AuPageHeader, AuTag } from 'aurora-plus';

const hint = ref('共 12 个条目');
</script>

<template>
  <div class="page-header-example">
    <AuPageHeader title="内容概览" description="查看和整理当前内容" back @back="hint = '已触发返回'">
      <template #extra>
        <AuButton size="small" @click="hint = '已刷新'">刷新</AuButton>
        <AuButton type="primary" size="small" @click="hint = '已触发新增'">新增</AuButton>
      </template>
      <AuTag>{{ hint }}</AuTag>
    </AuPageHeader>
  </div>
</template>

<style scoped>
.page-header-example { width: 100%; }
</style>
