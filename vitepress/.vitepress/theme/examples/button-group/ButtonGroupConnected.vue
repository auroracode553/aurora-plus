<template>
  <div class="button-group-connected-demo">
    <AuButtonGroup variant="connected" aria-label="工作台工具">
      <AuButton
        v-for="action in actions"
        :key="action.key"
        :icon="action.icon"
        :aria-pressed="selectedAction === action.key"
        @click="selectedAction = action.key"
      >
        {{ action.label }}
      </AuButton>
    </AuButtonGroup>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuButtonGroup } from 'aurora-ui';

const actions = [
  { key: 'window', label: '窗口', icon: 'panel' },
  { key: 'preferences', label: '偏好', icon: 'sliders' },
  { key: 'notifications', label: '提醒', icon: 'bell' },
  { key: 'more', label: '更多', icon: 'more' },
];

const selectedAction = ref('window');
</script>
