<template>
  <div class="update-check-demo">
    <AuButton type="primary" @click="open('idle')">检查更新</AuButton>
    <AuButton @click="open('latest')">已是最新</AuButton>
    <AuButton @click="open('error')">检查失败</AuButton>
    <AuUpdateDialog
      v-model="visible"
      v-model:auto-check="autoCheck"
      :status="status"
      app-name="示例应用"
      current-version="1.8.0"
      show-auto-check
      error-message="暂时无法连接更新服务，请检查网络连接后重试。"
      @check="check"
      @retry="check"
      @close="clearCheck"
    />
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import { AuButton, AuUpdateDialog } from 'aurora-plus';

const visible = ref(false);
const status = ref('idle');
const autoCheck = ref(true);
let checkTimer;

function clearCheck() {
  clearTimeout(checkTimer);
}

function open(nextStatus) {
  clearCheck();
  status.value = nextStatus;
  visible.value = true;
}

function check() {
  clearCheck();
  status.value = 'checking';
  // 示例模拟检查结果；实际应用在请求返回后设置状态。
  checkTimer = setTimeout(() => { status.value = 'latest'; }, 1500);
}

onBeforeUnmount(clearCheck);
</script>

<style scoped>
.update-check-demo { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
