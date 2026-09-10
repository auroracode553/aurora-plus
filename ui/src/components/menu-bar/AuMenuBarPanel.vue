<template>
  <div
    class="au-menu-bar-panel au-component au-material-surface au-depth-overlay au-overlay-surface au-menu-surface au-menu-panel"
    :class="{ 'has-leading-column': hasLeadingColumn }"
    @mousedown.prevent
    @keydown.esc.stop="emit('close')"
  >
    <template v-for="(item, index) in items" :key="resolveItemKey(item, index)">
      <div v-if="item.type === 'separator'" class="au-menu-bar-panel__separator au-menu-separator"></div>

      <div
        v-else-if="item.children && item.children.length"
        class="au-menu-bar-panel__submenu au-menu-submenu-host"
        @mouseenter="activeSubmenuKey = resolveItemKey(item, index)"
        @mouseleave="activeSubmenuKey = ''"
      >
        <button
          class="au-menu-bar-panel__item au-menu-action"
          :class="{ 'is-active': activeSubmenuKey === resolveItemKey(item, index) }"
          type="button"
          :disabled="item.disabled"
          @focus="activeSubmenuKey = resolveItemKey(item, index)"
          @keydown.right.prevent="activeSubmenuKey = resolveItemKey(item, index)"
        >
          <span
            v-if="hasLeadingColumn"
            class="au-menu-bar-panel__leading au-inline-center"
          >
            <AuIcon v-if="item.icon" class="au-menu-bar-panel__icon" :icon="item.icon" />
          </span>
          <span class="au-menu-bar-panel__label au-menu-label">{{ item.label }}</span>
          <span v-if="item.accelerator" class="au-menu-bar-panel__shortcut au-menu-shortcut au-meta-muted">{{ item.accelerator }}</span>
          <AuIcon class="au-menu-bar-panel__arrow au-inline-center" :icon="IconChevronRight" />
        </button>

        <AuMenuBarPanel
          v-if="activeSubmenuKey === resolveItemKey(item, index)"
          class="au-menu-bar-panel__nested au-menu-submenu-mobile"
          :items="item.children"
          @select="emit('select', $event)"
          @close="emit('close')"
        />
      </div>

      <button
        v-else
        class="au-menu-bar-panel__item au-menu-action"
        type="button"
        :disabled="item.disabled"
        @mouseenter="activeSubmenuKey = ''"
        @click="emit('select', item)"
      >
        <span
          v-if="hasLeadingColumn"
          class="au-menu-bar-panel__leading au-inline-center"
          :class="{ 'is-checkable': isCheckableItem(item) }"
        >
          <AuIcon v-if="resolveLeadingIcon(item)" class="au-menu-bar-panel__icon" :icon="resolveLeadingIcon(item)" />
        </span>
        <span class="au-menu-bar-panel__label au-menu-label">{{ item.label }}</span>
        <span v-if="item.accelerator" class="au-menu-bar-panel__shortcut au-menu-shortcut au-meta-muted">{{ item.accelerator }}</span>
      </button>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { IconCheck, IconChevronRight } from '../../icons/internal.js';
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

<style scoped lang="scss" src="./AuMenuBarPanel.scss"></style>
