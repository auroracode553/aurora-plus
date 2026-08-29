<template>
  <div
    class="au-menu-bar-panel au-component au-material-surface au-depth-overlay au-menu-surface"
    role="menu"
    @mousedown.prevent
    @keydown.esc.stop="emit('close')"
  >
    <template v-for="(item, index) in items" :key="resolveItemKey(item, index)">
      <div v-if="item.type === 'separator'" class="au-menu-bar-panel__separator" role="separator"></div>

      <div
        v-else-if="item.children && item.children.length"
        class="au-menu-bar-panel__submenu"
        @mouseenter="activeSubmenuKey = resolveItemKey(item, index)"
        @mouseleave="activeSubmenuKey = ''"
      >
        <button
          class="au-menu-bar-panel__item au-menu-item"
          :class="{ 'is-active': activeSubmenuKey === resolveItemKey(item, index) }"
          type="button"
          role="menuitem"
          :disabled="item.disabled"
          aria-haspopup="menu"
          :aria-expanded="activeSubmenuKey === resolveItemKey(item, index)"
          @focus="activeSubmenuKey = resolveItemKey(item, index)"
          @keydown.right.prevent="activeSubmenuKey = resolveItemKey(item, index)"
        >
          <span class="au-menu-bar-panel__check" aria-hidden="true"></span>
          <span class="au-menu-bar-panel__label">{{ item.label }}</span>
          <span v-if="item.accelerator" class="au-menu-bar-panel__shortcut">{{ item.accelerator }}</span>
          <AuIcon class="au-menu-bar-panel__arrow" :icon="IconChevronRight" />
        </button>

        <AuMenuBarPanel
          v-if="activeSubmenuKey === resolveItemKey(item, index)"
          class="au-menu-bar-panel__nested"
          :items="item.children"
          @select="emit('select', $event)"
          @close="emit('close')"
        />
      </div>

      <button
        v-else
        class="au-menu-bar-panel__item au-menu-item"
        type="button"
        role="menuitem"
        :disabled="item.disabled"
        @mouseenter="activeSubmenuKey = ''"
        @click="emit('select', item)"
      >
        <span class="au-menu-bar-panel__check" aria-hidden="true">
          <AuIcon v-if="item.type === 'checkbox' && item.checked" :icon="IconCheck" />
        </span>
        <span class="au-menu-bar-panel__label">{{ item.label }}</span>
        <span v-if="item.accelerator" class="au-menu-bar-panel__shortcut">{{ item.accelerator }}</span>
      </button>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { IconCheck, IconChevronRight } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';

defineOptions({ name: 'AuMenuBarPanel' });

defineProps({
  items: { type: Array, default: () => [] },
});

const emit = defineEmits(['select', 'close']);
const activeSubmenuKey = ref('');

function resolveItemKey(item, index) {
  return item.id || item.command || `${item.type || 'item'}-${item.label || index}-${index}`;
}
</script>

<style scoped>
.au-menu-bar-panel {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  min-width: 190px;
  padding: 5px;
  border-radius: var(--au-radius-overlay);
  color: var(--au-color-text-primary);
  font-size: 13px;
  font-weight: var(--au-font-weight-medium);
}

.au-menu-bar-panel__item {
  min-height: 28px;
  padding: 0 8px;
  border-radius: var(--au-radius-control);
}

.au-menu-bar-panel__check,
.au-menu-bar-panel__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  flex: 0 0 14px;
  color: var(--au-color-primary);
}

.au-menu-bar-panel__check :deep(svg),
.au-menu-bar-panel__arrow :deep(svg) {
  width: 14px;
  height: 14px;
}

.au-menu-bar-panel__label {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.au-menu-bar-panel__shortcut,
.au-menu-bar-panel__arrow {
  margin-left: auto;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
  white-space: nowrap;
}

.au-menu-bar-panel__separator {
  height: 1px;
  margin: 5px 4px;
  background: var(--au-color-border-lighter);
}

.au-menu-bar-panel__submenu {
  position: relative;
}

.au-menu-bar-panel__nested {
  top: -5px;
  left: calc(100% + 3px);
}

@media (prefers-contrast: more) {
  .au-menu-bar-panel__separator {
    background: var(--au-color-text-secondary);
  }
}
</style>
