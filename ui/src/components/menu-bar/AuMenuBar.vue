<template>
  <nav
    ref="menuBarRef"
    class="au-menu-bar au-component"
    :class="{ 'is-draggable': draggable }"
    :aria-label="ariaLabel"
    @contextmenu.prevent
    @keydown="handleKeydown"
  >
    <div class="au-menu-bar__roots" role="menubar">
      <div
        v-for="(item, index) in items"
        :key="item.id || item.label || index"
        class="au-menu-bar__root"
      >
        <button
          class="au-menu-bar__trigger au-focus-ring"
          :class="{ 'is-open': openIndex === index }"
          type="button"
          role="menuitem"
          aria-haspopup="menu"
          :disabled="item.disabled"
          :aria-expanded="openIndex === index"
          :tabindex="index === focusableIndex ? 0 : -1"
          @click="toggleMenu(index)"
          @mouseenter="switchMenu(index)"
        >
          {{ item.label }}
        </button>

        <AuMenuBarPanel
          v-if="openIndex === index"
          :items="item.children || []"
          @select="selectItem"
          @close="closeMenu"
        />
      </div>
    </div>
    <div v-if="draggable" class="au-menu-bar__drag-fill" aria-hidden="true"></div>
  </nav>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import AuMenuBarPanel from './AuMenuBarPanel.vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  draggable: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '应用菜单' },
});

const emit = defineEmits(['select', 'open', 'close']);
const menuBarRef = ref(null);
const openIndex = ref(-1);
const focusableIndex = ref(0);

function toggleMenu(index) {
  if (openIndex.value === index) {
    closeMenu();
    return;
  }
  openMenu(index);
}

function openMenu(index) {
  if (!props.items[index] || props.items[index].disabled) return;
  openIndex.value = index;
  focusableIndex.value = index;
  emit('open', props.items[index], index);
}

function switchMenu(index) {
  if (openIndex.value !== -1) openMenu(index);
}

function closeMenu() {
  if (openIndex.value === -1) return;
  const previousIndex = openIndex.value;
  openIndex.value = -1;
  emit('close', props.items[previousIndex], previousIndex);
}

function selectItem(item) {
  emit('select', item);
  closeMenu();
}

function getRootButtons() {
  if (!menuBarRef.value) return [];
  return Array.from(menuBarRef.value.querySelectorAll('.au-menu-bar__trigger:not(:disabled)'));
}

async function focusPanelFirstItem() {
  await nextTick();
  const firstItem = menuBarRef.value?.querySelector('.au-menu-bar-panel [role^="menuitem"]:not(:disabled)');
  if (firstItem) firstItem.focus();
}

function focusRoot(index) {
  const buttons = getRootButtons();
  if (buttons.length === 0) return;
  const nextIndex = (index + buttons.length) % buttons.length;
  focusableIndex.value = Array.from(menuBarRef.value.querySelectorAll('.au-menu-bar__trigger')).indexOf(buttons[nextIndex]);
  buttons[nextIndex].focus();
  if (openIndex.value !== -1) openMenu(focusableIndex.value);
}

function handleKeydown(event) {
  const rootButton = event.target.closest?.('.au-menu-bar__trigger');
  if (event.key === 'Escape') {
    event.preventDefault();
    const previousIndex = openIndex.value;
    closeMenu();
    const buttons = menuBarRef.value?.querySelectorAll('.au-menu-bar__trigger');
    if (previousIndex >= 0 && buttons?.[previousIndex]) buttons[previousIndex].focus();
    return;
  }
  if (!rootButton) return;
  const buttons = getRootButtons();
  const currentIndex = buttons.indexOf(rootButton);
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    focusRoot(currentIndex + 1);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    focusRoot(currentIndex - 1);
  } else if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openMenu(Array.from(menuBarRef.value.querySelectorAll('.au-menu-bar__trigger')).indexOf(rootButton));
    focusPanelFirstItem();
  }
}

function handleOutsidePointer(event) {
  if (!menuBarRef.value?.contains(event.target)) closeMenu();
}

onMounted(() => {
  document.addEventListener('pointerdown', handleOutsidePointer, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleOutsidePointer, true);
});

defineExpose({ close: closeMenu, menuBarRef });
</script>

<style scoped>
.au-menu-bar {
  position: relative;
  z-index: 1800;
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  min-height: 30px;
  padding: 0 8px;
  border-bottom: 1px solid var(--au-color-border-muted);
  color: var(--au-color-text-default);
  background: transparent;
  font-size: 13px;
  user-select: none;
}

.au-menu-bar__roots {
  display: flex;
  align-items: center;
  min-width: 0;
  max-width: 100%;
  height: 100%;
  flex: 0 1 auto;
  gap: 2px;
  -webkit-app-region: no-drag;
}

.au-menu-bar__root {
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  height: 100%;
  flex: 0 1 auto;
}

.au-menu-bar__trigger {
  min-width: 0;
  max-width: 100%;
  height: 26px;
  padding: 0 clamp(4px, 2vw, 9px);
  overflow: hidden;
  border: 0;
  border-radius: var(--au-radius-compact);
  color: inherit;
  background: transparent;
  font: inherit;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  appearance: none;
  -webkit-app-region: no-drag;
  transition:
    color var(--au-transition-duration) var(--au-transition-timing),
    background var(--au-transition-duration) var(--au-transition-timing);
}

.au-menu-bar__trigger:hover:not(:disabled),
.au-menu-bar__trigger:focus-visible,
.au-menu-bar__trigger.is-open {
  color: var(--au-color-text-primary);
  background: var(--au-color-background-hover);
}

.au-menu-bar__trigger:active:not(:disabled) {
  background: color-mix(in srgb, var(--au-color-primary) 14%, transparent);
}

.au-menu-bar__trigger:disabled {
  color: var(--au-color-text-disabled);
  cursor: not-allowed;
}

.au-menu-bar__trigger:focus-visible {
  outline-offset: -2px;
}

.au-menu-bar__drag-fill {
  height: 100%;
  flex: 1;
  -webkit-app-region: drag;
}

@media (prefers-reduced-motion: reduce) {
  .au-menu-bar__trigger {
    transition: none;
  }
}
</style>
