<template>
  <div class="switch-demo">
    <div class="switch-demo__row">
      <AuSwitch v-model="enabled" active-text="已开启" inactive-text="已关闭" />
      <AuSwitch v-model="syncMode" active-value="sync" inactive-value="manual" active-text="自动同步" inactive-text="手动同步" />
      <AuSwitch disabled active-text="禁用状态" />
      <AuSwitch loading active-text="保存中" />
    </div>
    <p class="switch-demo__result">当前状态：{{ enabled ? '开启' : '关闭' }} · {{ syncMode === 'sync' ? '自动同步' : '手动同步' }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuSwitch } from 'aurora-ui';

const enabled = ref(true);
const syncMode = ref('sync');
</script>

<style scoped>
.switch-demo__row {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
}

.switch-demo__result {
  margin: 16px 0 0;
  color: var(--au-color-text-secondary);
  font-size: 13px;
}
</style>
