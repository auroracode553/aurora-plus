<template>
  <div class="button-group-floating-demo">
    <AuButtonGroup
      variant="floating"
      icon-only
      aria-label="面板操作"
    >
      <AuButtonGroupItem
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
import { AuButtonGroup, AuButtonGroupItem } from 'aurora-plus';
import { IconCode, IconLayoutSidebar, IconMinus } from 'aurora-plus/icons';

const panelActions = [
  { label: '收起面板', icon: IconMinus },
  { label: '切换视图', icon: IconLayoutSidebar },
  { label: '查看源码', icon: IconCode },
];
</script>
