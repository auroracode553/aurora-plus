<template>
  <div class="button-group-floating-demo">
    <AuButtonGroup
      data-au-theme="dark"
      variant="floating"
      icon-only
      aria-label="面板操作"
    >
      <AuButton
        v-for="action in panelActions"
        :key="action.label"
        :icon="action.icon"
        :aria-label="action.label"
        :title="action.label"
        @click="runAction(action.label)"
      />
    </AuButtonGroup>

    <p class="button-group-floating-demo__result">
      最近操作：{{ lastAction || '暂无' }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuButtonGroup } from 'aurora-ui';

const panelActions = [
  { label: '收起面板', icon: 'minus' },
  { label: '切换视图', icon: 'panel' },
  { label: '查看源码', icon: 'code' },
];
const lastAction = ref('');

function runAction(action) {
  lastAction.value = action;
}
</script>

<style scoped>
.button-group-floating-demo__result {
  margin: 16px 0 0;
  color: var(--au-color-text-secondary);
  font-size: 13px;
}
</style>
