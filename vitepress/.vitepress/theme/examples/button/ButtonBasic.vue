<template>
  <div class="button-demo">
    <div class="au-doc-row">
      <AuButton
        v-for="button in buttonTypes"
        :key="button.type"
        :type="button.type"
      >
        {{ button.label }}
      </AuButton>
    </div>

    <div class="au-doc-row">
      <AuButton type="primary" plain>朴素按钮</AuButton>
      <AuButton type="success" round>圆角按钮</AuButton>
      <AuButton :icon="IconX">带图标</AuButton>
      <AuButton :icon="IconX" circle />
      <AuButton disabled>禁用按钮</AuButton>
      <AuButton type="primary" :loading="saving" @click="saving = !saving">
        {{ saving ? '处理中' : '开始处理' }}
      </AuButton>
      <AuButton v-if="saving" @click="saving = false">重置加载状态</AuButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton } from 'aurora-plus';
import { IconX } from 'aurora-plus/icons';

const buttonTypes = [
  { type: 'default', label: '默认按钮' },
  { type: 'primary', label: '主要按钮' },
  { type: 'success', label: '成功按钮' },
  { type: 'warning', label: '警告按钮' },
  { type: 'danger', label: '危险按钮' },
  { type: 'info', label: '信息按钮' },
];

const saving = ref(false);
</script>
