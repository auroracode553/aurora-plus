<template>
  <div class="icon-demo">
    <div v-for="item in iconItems" :key="item.name" class="icon-demo__item">
      <AuIcon :icon="item.component" :size="item.size" :color="item.color" :stroke-width="strokeWidth" />
      <code>{{ item.name }}</code>
    </div>

    <div class="icon-demo__item icon-demo__item--filled">
      <IconHeartFilled :size="28" color="#e5484d" aria-hidden="true" />
      <code>IconHeartFilled</code>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  AuIcon,
  IconBell,
  IconBrandGithub,
  IconCheck,
  IconChevronRight,
  IconCode,
  IconHeartFilled,
  IconHome,
  IconLoader2,
  IconMenu2,
  IconSearch,
  IconSettings,
  IconStar,
  IconTrash,
  IconX,
} from 'aurora-ui';

const strokeWidth = ref(2);
const iconItems = [
  { name: 'IconHome', component: IconHome, color: '#2563eb', size: 26 },
  { name: 'IconSearch', component: IconSearch, color: '#0f766e', size: 24 },
  { name: 'IconSettings', component: IconSettings, color: '#7c3aed', size: 25 },
  { name: 'IconBell', component: IconBell, color: '#c2410c', size: 24 },
  { name: 'IconBrandGithub', component: IconBrandGithub, color: '#334155', size: 25 },
  { name: 'IconCheck', component: IconCheck, color: '#15803d', size: 24 },
  { name: 'IconX', component: IconX, color: '#dc2626', size: 24 },
  { name: 'IconChevronRight', component: IconChevronRight, color: '#475569', size: 24 },
  { name: 'IconCode', component: IconCode, color: '#0369a1', size: 24 },
  { name: 'IconMenu2', component: IconMenu2, color: '#64748b', size: 24 },
  { name: 'IconStar', component: IconStar, color: '#ca8a04', size: 24 },
  { name: 'IconTrash', component: IconTrash, color: '#be123c', size: 24 },
  { name: 'IconLoader2', component: IconLoader2, color: '#4f46e5', size: 24 },
];
</script>

<style scoped>
.icon-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
  gap: 10px;
}

.icon-demo__item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 82px;
  border: 1px solid var(--au-color-border-lighter);
  border-radius: 8px;
  color: var(--au-color-text-secondary);
  flex-direction: column;
  gap: 9px;
}

.icon-demo__item--filled {
  border-style: dashed;
}

.icon-demo__item code {
  color: var(--au-color-text-secondary);
  font-size: 11px;
}
</style>
