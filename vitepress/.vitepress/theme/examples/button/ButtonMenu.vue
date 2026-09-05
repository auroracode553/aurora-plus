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
    每个选项通过 <code>selected-color</code> 传入 <code>rgb()</code>、<code>rgba()</code> 等颜色值，选中背景由组件自动生成。
  </p>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuDivider } from 'aurora-plus';
import {
  IconArrowUp,
  IconBrandGit,
  IconCode,
  IconLayoutSidebar,
} from 'aurora-plus/icons';

const activeAction = ref('sidebar');

const actions = [
  { value: 'sidebar', label: '侧边栏', icon: IconLayoutSidebar, color: 'rgb(52, 120, 246)' },
  { value: 'source', label: '源码模式', icon: IconCode, color: 'rgba(113, 128, 150, 0.95)' },
  { value: 'git', label: '源代码管理', icon: IconBrandGit, color: 'rgb(217, 138, 36)' },
  { value: 'top', label: '回到顶部', icon: IconArrowUp, color: '#2f9e72' },
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
