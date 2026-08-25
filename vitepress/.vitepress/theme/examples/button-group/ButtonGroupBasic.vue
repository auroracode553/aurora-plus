<template>
  <div class="button-group-demo">
    <div class="au-doc-row">
      <AuButtonGroup aria-label="内容对齐">
        <AuButton
          v-for="alignment in alignments"
          :key="alignment"
          @click="runAction(alignment)"
        >
          {{ alignment }}
        </AuButton>
      </AuButtonGroup>
    </div>

    <div class="button-group-demo__floating-preview" data-au-theme="dark">
      <AuButtonGroup variant="floating" icon-only aria-label="面板操作">
        <AuButton
          v-for="action in panelActions"
          :key="action.label"
          :icon="action.icon"
          :aria-label="action.label"
          :title="action.label"
          @click="runAction(action.label)"
        />
      </AuButtonGroup>
    </div>

    <p class="button-group-demo__result">最近操作：{{ lastAction || '暂无' }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuButtonGroup } from 'aurora-ui';

const alignments = ['左对齐', '居中', '右对齐'];
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
.button-group-demo__floating-preview {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: 18px;
}

.button-group-demo__result {
  margin: 16px 0 0;
  color: var(--au-color-text-secondary);
  font-size: 13px;
}
</style>
