<template>
  <AuForm ref="formRef" :model="form" :rules="rules" label-width="76" @submit.prevent="submit">
    <AuFormItem v-slot="{ invalid }" label="名称" prop="name">
      <AuInput v-model="form.name" placeholder="输入日程名称" :invalid="invalid" />
    </AuFormItem>
    <AuFormItem v-slot="{ invalid }" label="日期" prop="date">
      <AuDatePicker v-model="form.date" :invalid="invalid" />
    </AuFormItem>
    <AuFormItem v-slot="{ invalid }" label="说明" prop="description">
      <AuTextarea v-model="form.description" :rows="2" placeholder="可选" :invalid="invalid" />
    </AuFormItem>
    <AuFormItem>
      <div class="form-demo__actions">
        <AuButton native-type="submit" type="primary">保存</AuButton>
        <AuButton @click="formRef?.resetFields()">重置</AuButton>
      </div>
    </AuFormItem>
    <p class="form-demo__result">{{ result }}</p>
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
  AuTextarea,
} from 'aurora-ui';

const formRef = ref(null);
const result = ref('');
const form = reactive({ name: '', date: '', description: '' });
const rules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 24, message: '名称长度应为 2–24 个字符', trigger: 'change' },
  ],
  date: { required: true, message: '请选择日期', trigger: 'change' },
};

async function submit() {
  result.value = await formRef.value.validate() ? '表单有效，可以提交。' : '请修正标出的字段。';
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
