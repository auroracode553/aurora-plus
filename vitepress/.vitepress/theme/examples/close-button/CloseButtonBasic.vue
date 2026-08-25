<template>
  <div>
    <div class="au-doc-row au-doc-icon-row">
      <AuCloseButton
        v-for="button in closeButtons"
        :key="button.tooltip"
        :icon="button.icon"
        :tooltip="button.tooltip"
        :disabled="button.disabled"
        @click="handleClose(button.tooltip)"
      />
    </div>
    <p class="close-button-demo__result">关闭事件：{{ closeCount }} 次；最近操作：{{ lastAction }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuCloseButton } from 'aurora-ui';

const closeButtons = [
  { icon: 'close', tooltip: '关闭当前标签页', disabled: false },
  { icon: 'close', tooltip: '关闭设置面板', disabled: false },
  { icon: 'close', tooltip: '当前不可关闭', disabled: true },
];

const closeCount = ref(0);
const lastAction = ref('暂无');

function handleClose(action) {
  closeCount.value += 1;
  lastAction.value = action;
}
</script>

<style scoped>
.close-button-demo__result {
  margin: 16px 0 0;
  color: var(--au-color-text-secondary);
  font-size: 13px;
}
</style>
