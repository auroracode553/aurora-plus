<template>
  <div class="popconfirm-demo">
    <AuPopconfirm title="删除后无法恢复，仍要继续吗？" confirm-button-type="danger" @confirm="handleConfirm">
      <template #reference>
        <AuButton type="danger" plain>删除记录</AuButton>
      </template>
    </AuPopconfirm>
    <span aria-live="polite">{{ result }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuPopconfirm } from 'aurora-ui';

const result = ref('尚未操作');

function handleConfirm() {
  result.value = '已确认删除';
}
</script>

<style scoped>
.popconfirm-demo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}
</style>
