<template>
  <div>
    <div class="au-doc-row">
      <AuButton
        v-for="action in confirmActions"
        :key="action.id"
        :type="action.buttonType"
        :plain="action.buttonType === 'danger'"
        @click="openConfirm(action)"
      >
        {{ action.label }}
      </AuButton>
    </div>
    <p class="message-box-demo__result">最近结果：{{ resultText }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuMessageBox } from 'aurora-ui';

const confirmActions = [
  {
    id: 'publish',
    label: '发布版本',
    buttonType: 'primary',
    title: '发布确认',
    message: '确定发布 Aurora UI 0.2.0 吗？',
    confirmButtonText: '立即发布',
    confirmButtonType: 'primary',
  },
  {
    id: 'delete',
    label: '删除项目',
    buttonType: 'danger',
    title: '危险操作',
    message: '删除后无法恢复，是否继续？',
    confirmButtonText: '确认删除',
    confirmButtonType: 'danger',
  },
];

const resultText = ref('尚未操作');

async function openConfirm(action) {
  const confirmed = await AuMessageBox.confirm({
    title: action.title,
    message: action.message,
    confirmButtonText: action.confirmButtonText,
    confirmButtonType: action.confirmButtonType,
    showCancelButton: true,
  });
  resultText.value = confirmed ? `${action.label}：已确认` : `${action.label}：已取消`;
}
</script>

<style scoped>
.message-box-demo__result {
  margin: 16px 0 0;
  color: var(--au-color-text-secondary);
  font-size: 13px;
}
</style>
