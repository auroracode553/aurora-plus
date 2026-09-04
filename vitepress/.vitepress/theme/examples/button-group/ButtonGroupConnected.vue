<template>
  <div class="button-group-connected-demo">
    <AuButtonGroup variant="connected" aria-label="工作台工具">
      <AuButtonGroupItem
        v-for="action in actions"
        :key="action.key"
        :icon="action.icon"
        :loading="action.loading"
        :aria-pressed="selectedAction === action.key"
        @click="selectedAction = action.key"
      >
        {{ action.label }}
      </AuButtonGroupItem>
    </AuButtonGroup>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButtonGroup, AuButtonGroupItem } from 'aurora-plus';
import {
  IconAdjustmentsHorizontal,
  IconBell,
  IconDots,
  IconLayoutSidebar,
} from 'aurora-plus/icons';

const actions = [
  { key: 'window', label: '窗口', icon: IconLayoutSidebar },
  { key: 'preferences', label: '偏好', icon: IconAdjustmentsHorizontal },
  { key: 'notifications', label: '同步中', icon: IconBell, loading: true },
  { key: 'more', label: '更多', icon: IconDots },
];

const selectedAction = ref('window');
</script>
