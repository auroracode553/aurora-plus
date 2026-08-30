<template>
  <div
    class="au-menu-bar-panel au-component au-material-surface au-depth-overlay au-menu-surface"
    :class="{ 'has-leading-column': hasLeadingColumn }"
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
          <span
            v-if="hasLeadingColumn"
            class="au-menu-bar-panel__leading"
            aria-hidden="true"
          >
            <AuIcon v-if="item.icon" :icon="item.icon" />
          </span>
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
        :role="isCheckableItem(item) ? 'menuitemcheckbox' : 'menuitem'"
        :aria-checked="isCheckableItem(item) ? Boolean(item.checked) : undefined"
        :disabled="item.disabled"
        @mouseenter="activeSubmenuKey = ''"
        @click="emit('select', item)"
      >
        <span
          v-if="hasLeadingColumn"
          class="au-menu-bar-panel__leading"
          :class="{ 'is-checkable': isCheckableItem(item) }"
          aria-hidden="true"
        >
          <AuIcon v-if="resolveLeadingIcon(item)" :icon="resolveLeadingIcon(item)" />
        </span>
        <span class="au-menu-bar-panel__label">{{ item.label }}</span>
        <span v-if="item.accelerator" class="au-menu-bar-panel__shortcut">{{ item.accelerator }}</span>
      </button>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { IconCheck, IconChevronRight } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';

defineOptions({ name: 'AuMenuBarPanel' });

const props = defineProps({
  items: { type: Array, default: () => [] },
});

const emit = defineEmits(['select', 'close']);
const activeSubmenuKey = ref('');
const hasLeadingColumn = computed(() => props.items.some((item) => (
  item?.type !== 'separator' && Boolean(item?.icon || isCheckableItem(item))
)));

function isCheckableItem(item) {
  return item?.type === 'checkbox';
}

function resolveLeadingIcon(item) {
  if (isCheckableItem(item)) return item.checked ? IconCheck : null;
  return item.icon || null;
}

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
  width: max-content;
  min-width: min(190px, calc(100vw - 16px));
  max-width: calc(100vw - 16px);
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

.au-menu-bar-panel__leading,
.au-menu-bar-panel__arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 14px;
  aspect-ratio: 1;
  flex: none;
  color: var(--au-color-text-secondary);
}

.au-menu-bar-panel__leading.is-checkable {
  color: var(--au-color-primary);
}

.au-menu-bar-panel__leading :deep(svg),
.au-menu-bar-panel__arrow :deep(svg) {
  width: 100%;
  height: 100%;
}

.au-menu-bar-panel__label {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.au-menu-bar-panel__shortcut,
.au-menu-bar-panel__arrow {
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

@media (max-width: 480px) {
  .au-menu-bar-panel__nested {
    position: static;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    margin-top: 2px;
    box-shadow: none;
  }
}

@media (prefers-contrast: more) {
  .au-menu-bar-panel__separator {
    background: var(--au-color-text-secondary);
  }
}
</style>
