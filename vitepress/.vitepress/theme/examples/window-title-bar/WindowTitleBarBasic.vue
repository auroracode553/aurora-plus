<template>
  <div class="window-title-bar-demo">
    <AuWindowTitleBar
      title="Aurora Notes"
      :maximized="maximized"
      @minimize="lastAction = '请求最小化窗口'"
      @toggle-maximize="toggleMaximize"
      @close="lastAction = '请求关闭窗口'"
    >
      <template #icon>
        <AuIcon :icon="IconSparkles" size="18" color="var(--au-color-primary)" />
      </template>
    </AuWindowTitleBar>

    <p class="window-title-bar-demo__status">{{ lastAction }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuIcon, AuWindowTitleBar, IconSparkles } from 'aurora-ui';

const maximized = ref(false);
const lastAction = ref('等待窗口操作');

function toggleMaximize() {
  maximized.value = !maximized.value;
  lastAction.value = maximized.value ? '请求最大化窗口' : '请求还原窗口';
}
</script>

<style scoped>
.window-title-bar-demo {
  overflow: hidden;
  border: 1px solid var(--au-color-border-light);
  border-radius: var(--au-border-radius-base);
  isolation: isolate;
}

.window-title-bar-demo__status {
  min-height: 72px;
  margin: 0;
  padding: 24px 16px;
  color: var(--au-color-text-secondary);
  text-align: center;
}
</style>
