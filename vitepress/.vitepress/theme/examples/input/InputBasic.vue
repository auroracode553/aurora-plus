<template>
  <div class="input-demo">
    <AuInput
      v-model="keyword"
      type="search"
      placeholder="搜索文档"
      :prefix-icon="IconSearch"
      clearable
    />
    <AuInput v-model="account" placeholder="账号" :prefix-icon="IconUser" />
    <AuInput v-model="description" placeholder="最多输入 24 个字符" maxlength="24" show-word-limit />
    <AuInput model-value="不可编辑" readonly />
    <AuInput model-value="正在读取账户信息" loading aria-label="正在读取账户信息" />
    <AuInput model-value="输入内容有误" invalid aria-describedby="input-error" />
    <span id="input-error" class="input-demo__error">请检查输入内容</span>
    <AuInput model-value="禁用状态" disabled />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuInput, IconSearch, IconUser } from 'aurora-plus';

const keyword = ref('');
const account = ref('');
const description = ref('');
</script>

<style scoped>
.input-demo {
  display: grid;
  width: min(100%, 360px);
  gap: 12px;
}

.input-demo__error {
  margin-top: -6px;
  color: var(--au-color-danger);
  font-size: var(--au-font-size-small);
}
</style>
