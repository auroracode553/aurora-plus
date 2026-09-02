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
  </div>
</template>

<script setup>
import { AuButton, AuMessageBox } from 'aurora-plus';

const confirmActions = [
  {
    id: 'publish',
    label: '发布版本',
    buttonType: 'primary',
    title: '发布确认',
    message: '确定发布 Aurora Plus 0.2.0 吗？',
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

async function openConfirm(action) {
  await AuMessageBox.confirm({
    title: action.title,
    message: action.message,
    confirmButtonText: action.confirmButtonText,
    confirmButtonType: action.confirmButtonType,
    showCancelButton: true,
  });
}
</script>
