<template>
  <div class="menu-demo">
    <AuMenu v-model="activeItem" class="menu-demo__menu" aria-label="设置分类">
      <AuMenuItem index="general" label="通用" :icon="IconSettings">通用</AuMenuItem>
      <AuMenuItem index="documents" label="文档" :icon="IconFileText">文档</AuMenuItem>
      <AuMenuItem index="assets" label="资源" :icon="IconPhoto">
        资源
        <template #suffix>3</template>
      </AuMenuItem>
      <AuMenuItem index="security" label="安全" :icon="IconLock" disabled>安全</AuMenuItem>
    </AuMenu>
    <p class="menu-demo__result">当前选中：{{ activeItem }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  AuMenu,
  AuMenuItem,
  IconFileText,
  IconLock,
  IconPhoto,
  IconSettings,
} from 'aurora-ui';

const activeItem = ref('general');
</script>

<style scoped>
.menu-demo {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}

.menu-demo__menu {
  width: 220px;
  border: 1px solid var(--au-color-border-lighter);
  border-radius: var(--au-border-radius-large);
}

.menu-demo__result {
  margin: 8px 0 0;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}
</style>
