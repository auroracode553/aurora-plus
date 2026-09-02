<template>
  <AuForm :model="form" label-width="76" @submit.prevent="validateForm">
    <AuFormItem
      ref="nameItemRef"
      v-slot="{ invalid }"
      label="名称"
      prop="name"
      :rules="nameRules"
    >
      <AuInput v-model="form.name" placeholder="输入日程名称" :invalid="invalid" />
    </AuFormItem>

    <AuFormItem
      ref="dateItemRef"
      v-slot="{ invalid }"
      label="日期"
      prop="date"
      :rules="dateRules"
    >
      <AuDatePicker v-model="form.date" :invalid="invalid" />
    </AuFormItem>

    <AuFormItem>
      <div class="form-demo__actions">
        <AuButton native-type="submit" type="primary">保存并校验</AuButton>
        <AuButton @click="resetForm">重置</AuButton>
      </div>
    </AuFormItem>

    <p v-if="result" class="form-demo__result" role="status" aria-live="polite">
      {{ result }}
    </p>
  </AuForm>
</template>

<script setup>
import { reactive, ref } from 'vue';
import {
  AuButton,
  AuDatePicker,
  AuForm,
  AuFormItem,
  AuInput,
} from 'aurora-plus';

const nameItemRef = ref(null);
const dateItemRef = ref(null);
const result = ref('');
const form = reactive({ name: '', date: '' });

const nameRules = [
  { required: true, message: '请输入名称', trigger: 'blur' },
  { min: 2, max: 24, message: '名称长度应为 2–24 个字符', trigger: 'change' },
];
const dateRules = [
  { required: true, message: '请选择日期', trigger: 'change' },
];

async function validateForm() {
  const [nameValid, dateValid] = await Promise.all([
    nameItemRef.value.validate(),
    dateItemRef.value.validate(),
  ]);

  if (nameValid && dateValid) {
    result.value = '校验通过。';
    return;
  }

  const messages = [];
  if (!nameValid) messages.push(readError(nameItemRef.value, '请输入名称'));
  if (!dateValid) messages.push(readError(dateItemRef.value, '请选择日期'));
  result.value = messages.join('；');
}

function readError(field, fallback) {
  const message = field?.errorMessage;
  return (typeof message === 'string' ? message : message?.value) || fallback;
}

function resetForm() {
  nameItemRef.value.resetField();
  dateItemRef.value.resetField();
  result.value = '';
}
</script>

<style scoped>
.au-form {
  width: min(100%, 480px);
}

.form-demo__actions {
  display: flex;
  gap: 8px;
}

.form-demo__result {
  margin: 0 0 0 76px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}
</style>
