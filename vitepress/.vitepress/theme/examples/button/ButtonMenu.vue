<template>
  <template v-for="(action, index) in actions" :key="action.value">
    <AuButton
      :icon="action.icon"
      type="menu"
      :selected="activeAction === action.value"
      :selected-color="action.color"
      :aria-label="action.label"
      @click="activeAction = action.value"
    />
    <AuDivider
      v-if="index < actions.length - 1"
      orientation="vertical"
      aria-hidden="true"
    />
  </template>

  <p class="button-menu-demo__hint">
    每个选项直接通过 <code>selected-color</code> 设置强调色，选中背景由组件自动生成。
  </p>
</template>

<script setup>
import { ref } from 'vue';
import {
  AuButton,
  AuDivider,
  IconArrowUp,
  IconBrandGit,
  IconCode,
  IconLayoutSidebar,
} from 'aurora-ui';

const activeAction = ref('sidebar');

const actions = [
  { value: 'sidebar', label: '侧边栏', icon: IconLayoutSidebar, color: 'primary' },
  { value: 'source', label: '源码模式', icon: IconCode, color: 'info' },
  { value: 'git', label: '源代码管理', icon: IconBrandGit, color: 'warning' },
  { value: 'top', label: '回到顶部', icon: IconArrowUp, color: 'success' },
];
</script>

<style scoped>
.button-menu-demo__hint {
  margin: 8px 0 0;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
  line-height: 1.6;
}
</style>
