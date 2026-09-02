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
      <AuButton :icon="IconX" circle aria-label="关闭" />
      <AuButton disabled>禁用按钮</AuButton>
      <AuButton type="primary" :loading="saving" @click="saving = !saving">
        {{ saving ? '处理中' : '开始处理' }}
      </AuButton>
      <AuButton v-if="saving" @click="saving = false">重置加载状态</AuButton>
    </div>

    <div class="au-doc-row">
      <AuButton v-for="size in buttonSizes" :key="size.value" :size="size.value">
        {{ size.label }}
      </AuButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, IconX } from 'aurora-plus';

const buttonTypes = [
  { type: 'default', label: '默认按钮' },
  { type: 'primary', label: '主要按钮' },
  { type: 'success', label: '成功按钮' },
  { type: 'warning', label: '警告按钮' },
  { type: 'danger', label: '危险按钮' },
  { type: 'info', label: '信息按钮' },
];

const buttonSizes = [
  { value: 'small', label: '小型按钮' },
  { value: 'default', label: '默认尺寸' },
  { value: 'large', label: '大型按钮' },
];

const saving = ref(false);
</script>
