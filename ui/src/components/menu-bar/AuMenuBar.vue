<template>
  <nav
    ref="menuBarRef"
    class="au-menu-bar au-component"
    :class="{ 'is-draggable': draggable }"
    @contextmenu.prevent
    @keydown="handleKeydown"
  >
    <div class="au-menu-bar__roots">
      <div
        v-for="(item, index) in items"
        :key="item.id || item.label || index"
        class="au-menu-bar__root"
      >
        <button
          class="au-menu-bar__trigger au-action-control au-truncate"
          :class="{ 'is-open': openIndex === index }"
          type="button"
          :disabled="item.disabled"
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
    <div v-if="draggable" class="au-menu-bar__drag-fill"></div>
  </nav>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import AuMenuBarPanel from './AuMenuBarPanel.vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  draggable: { type: Boolean, default: false },
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
  const firstItem = menuBarRef.value?.querySelector('.au-menu-bar-panel .au-menu-bar-panel__item:not(:disabled)');
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

<style scoped lang="scss" src="./AuMenuBar.scss"></style>
