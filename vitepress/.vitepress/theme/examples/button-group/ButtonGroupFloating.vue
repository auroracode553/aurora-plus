<template>
  <div class="button-group-floating-demo">
    <AuButtonGroup
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
      />
    </AuButtonGroup>
  </div>
</template>

<script setup>
import { AuButton, AuButtonGroup, IconCode, IconLayoutSidebar, IconMinus } from 'aurora-ui';

const panelActions = [
  { label: '收起面板', icon: IconMinus },
  { label: '切换视图', icon: IconLayoutSidebar },
  { label: '查看源码', icon: IconCode },
];
</script>
