<script setup>
import { ref } from 'vue';
import { AuButton, AuEmpty, AuTag, AuTransition } from 'aurora-plus';

const added = ref(false);
</script>

<template>
  <div class="empty-example">
    <AuTransition mode="out-in">
      <AuTag v-if="added" type="success" closable @close="added = false">示例条目</AuTag>
      <AuEmpty v-else title="还没有内容" description="添加第一个条目开始使用">
        <AuButton size="small" @click="added = true">添加条目</AuButton>
      </AuEmpty>
    </AuTransition>
  </div>
</template>

<style scoped>
.empty-example { width: 100%; }
</style>
