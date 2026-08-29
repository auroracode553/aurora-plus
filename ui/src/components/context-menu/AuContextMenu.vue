<template>
  <Teleport :to="appendTo" :disabled="!teleported">
    <div
      v-if="visible"
      ref="menuRef"
      class="au-context-menu au-component au-material-surface au-depth-overlay au-menu-surface"
      :style="menuStyle"
      role="menu"
      :aria-label="ariaLabel"
      tabindex="-1"
      @contextmenu.prevent
      @mousedown.stop
      @keydown="handleKeydown"
    >
      <template v-for="(section, sectionIndex) in items" :key="section.id || sectionIndex">
        <div
          v-if="section.type === 'icon-row' || section.type === 'icon-grid'"
          :class="section.type === 'icon-row' ? 'au-context-menu__icon-row' : 'au-context-menu__icon-grid'"
          role="group"
          :aria-label="section.ariaLabel"
        >
          <AuTooltip v-for="item in section.items" :key="item.id" :content="item.label" placement="top">
            <button
              class="au-context-menu__tool-button"
              :class="{ 'is-danger': item.danger }"
              type="button"
              role="menuitem"
              :disabled="item.disabled || selecting"
              :aria-label="item.label"
              @click="selectItem(item)"
            >
              <AuIcon class="au-context-menu__tool-icon" :icon="item.icon" :color="iconColor" />
            </button>
          </AuTooltip>
        </div>

        <template v-else-if="section.type === 'button-group' || section.type === 'group'">
          <button
            v-for="item in section.items"
            :key="item.id"
            class="au-context-menu__item au-menu-item"
            :class="{ 'is-danger': item.danger }"
            type="button"
            role="menuitem"
            :title="item.title"
            :disabled="item.disabled || selecting"
            @click="selectItem(item)"
          >
            <AuIcon v-if="item.icon" class="au-context-menu__item-icon" :icon="item.icon" />
            <span>{{ item.label }}</span>
            <span v-if="item.shortcut" class="au-context-menu__shortcut">{{ item.shortcut }}</span>
          </button>
        </template>

        <button
          v-else-if="section.type === 'button' || section.type === 'item'"
          class="au-context-menu__item au-menu-item"
          :class="{ 'is-danger': resolveSectionItem(section).danger }"
          type="button"
          role="menuitem"
          :disabled="resolveSectionItem(section).disabled || selecting"
          @click="selectItem(resolveSectionItem(section))"
        >
          <AuIcon v-if="resolveSectionItem(section).icon" class="au-context-menu__item-icon" :icon="resolveSectionItem(section).icon" />
          <span>{{ resolveSectionItem(section).label }}</span>
          <span v-if="resolveSectionItem(section).shortcut" class="au-context-menu__shortcut">{{ resolveSectionItem(section).shortcut }}</span>
        </button>

        <div
          v-else-if="section.type === 'submenu'"
          class="au-context-menu__submenu-wrapper"
          @mouseenter="showSubmenu(section.id)"
          @mouseleave="hideSubmenu"
        >
          <button
            class="au-context-menu__item au-menu-item has-submenu"
            :class="{ 'is-active': activeSubmenu === section.id }"
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            :aria-expanded="activeSubmenu === section.id"
            :disabled="section.disabled"
            @focus="showSubmenu(section.id)"
          >
            <AuIcon v-if="section.icon" class="au-context-menu__item-icon" :icon="section.icon" />
            <span>{{ section.label }}</span>
            <AuIcon class="au-context-menu__arrow" :icon="IconChevronRight" />
          </button>

          <div
            v-if="activeSubmenu === section.id"
            class="au-context-submenu au-component au-material-surface au-depth-overlay au-menu-surface"
            role="menu"
            @mouseenter="showSubmenu(section.id)"
            @mouseleave="hideSubmenu"
          >
            <template v-for="(item, itemIndex) in section.items" :key="item.id || itemIndex">
              <div v-if="item.kind === 'separator' || item.type === 'separator'" class="au-context-menu__separator"></div>
              <button
                v-else
                class="au-context-menu__item au-menu-item"
                :class="{ 'is-danger': item.danger }"
                type="button"
                role="menuitem"
                :disabled="item.disabled || selecting"
                @click="selectItem(item)"
              >
                <AuIcon v-if="item.icon" class="au-context-menu__item-icon" :icon="item.icon" />
                <span>{{ item.label }}</span>
                <span v-if="item.shortcut" class="au-context-menu__shortcut">{{ item.shortcut }}</span>
              </button>
            </template>
          </div>
        </div>

        <div v-else-if="section.type === 'separator'" class="au-context-menu__separator"></div>
      </template>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { IconChevronRight } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';
import { AuTooltip } from '../tooltip/index.js';

const VIEWPORT_GAP = 8;

const props = defineProps({
  modelValue: { type: Boolean, default: true },
  items: { type: Array, default: () => [] },
  position: { type: Object, default: () => ({ x: 0, y: 0 }) },
  iconColor: { type: String, default: '' },
  ariaLabel: { type: String, default: '上下文菜单' },
  beforeSelect: { type: Function, default: null },
  hideOnSelect: { type: Boolean, default: true },
  closeOnClickOutside: { type: Boolean, default: true },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
  zIndex: { type: Number, default: 2200 },
});

const emit = defineEmits(['update:modelValue', 'select', 'action', 'cancel', 'close']);
const menuRef = ref(null);
const visible = ref(props.modelValue);
const selecting = ref(false);
const activeSubmenu = ref('');
const adjustedPosition = ref({ x: props.position.x || 0, y: props.position.y || 0 });

let submenuCloseTimer = null;

const menuStyle = computed(() => ({
  left: `${adjustedPosition.value.x}px`,
  top: `${adjustedPosition.value.y}px`,
  zIndex: props.zIndex,
}));

function showSubmenu(name) {
  clearTimeout(submenuCloseTimer);
  activeSubmenu.value = name;
}

function hideSubmenu() {
  submenuCloseTimer = globalThis.setTimeout(() => {
    activeSubmenu.value = '';
  }, 180);
}

function resolveSectionItem(section) {
  return section.item || section;
}

async function selectItem(item) {
  if (!item || item.disabled || selecting.value) return;
  selecting.value = true;

  try {
    const allowed = props.beforeSelect ? await props.beforeSelect(item) : true;
    if (allowed === false) {
      emit('cancel', item);
      return;
    }
    emit('select', item);
    emit('action', item);
    if (props.hideOnSelect) close('select');
  } finally {
    selecting.value = false;
  }
}

function close(reason = 'api') {
  if (!visible.value) return;
  visible.value = false;
  activeSubmenu.value = '';
  emit('update:modelValue', false);
  emit('close', reason);
}

function handleOutsidePointer(event) {
  if (!visible.value || !props.closeOnClickOutside) return;
  if (menuRef.value && menuRef.value.contains(event.target)) return;
  close('outside');
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    close('escape');
    return;
  }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

  event.preventDefault();
  const buttons = getEnabledButtons();
  if (buttons.length === 0) return;
  const currentIndex = buttons.indexOf(document.activeElement);
  let nextIndex = 0;
  if (event.key === 'End') nextIndex = buttons.length - 1;
  else if (event.key === 'ArrowDown') nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % buttons.length;
  else if (event.key === 'ArrowUp') nextIndex = currentIndex < 0 ? buttons.length - 1 : (currentIndex - 1 + buttons.length) % buttons.length;
  buttons[nextIndex].focus();
}

function getEnabledButtons() {
  if (!menuRef.value) return [];
  return Array.from(menuRef.value.querySelectorAll('button:not(:disabled)'));
}

async function updatePosition() {
  adjustedPosition.value = { x: Number(props.position.x) || 0, y: Number(props.position.y) || 0 };
  await nextTick();
  const menu = menuRef.value;
  if (!menu || typeof window === 'undefined') return;
  const rect = menu.getBoundingClientRect();
  adjustedPosition.value = {
    x: clamp(adjustedPosition.value.x, VIEWPORT_GAP, window.innerWidth - rect.width - VIEWPORT_GAP),
    y: clamp(adjustedPosition.value.y, VIEWPORT_GAP, window.innerHeight - rect.height - VIEWPORT_GAP),
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, Math.max(min, max)));
}

watch(
  () => props.modelValue,
  (value) => {
    visible.value = value;
    if (value) {
      updatePosition();
      nextTick(() => {
        if (menuRef.value) menuRef.value.focus();
      });
    }
  }
);

watch(
  () => [props.position.x, props.position.y, props.items],
  updatePosition,
  { deep: true }
);

onMounted(() => {
  if (typeof document !== 'undefined') document.addEventListener('pointerdown', handleOutsidePointer, true);
  if (visible.value) {
    updatePosition();
    nextTick(() => {
      if (menuRef.value) menuRef.value.focus();
    });
  }
});

onBeforeUnmount(() => {
  clearTimeout(submenuCloseTimer);
  if (typeof document !== 'undefined') document.removeEventListener('pointerdown', handleOutsidePointer, true);
});

defineExpose({ close, menuRef, updatePosition });
</script>

<style scoped>
.au-context-menu,
.au-context-submenu {
  position: fixed;
  min-width: 190px;
  padding: 5px;
  border-radius: var(--au-radius-overlay);
  font-size: 13px;
  font-weight: var(--au-font-weight-medium);
}

.au-context-menu__icon-row,
.au-context-menu__icon-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
  padding: 2px 8px 8px;
}

.au-context-menu__tool-button {
  display: grid;
  place-items: center;
  width: 100%;
  height: 28px;
  padding: 0;
  border: 1px solid var(--au-material-border-strong);
  border-radius: var(--au-radius-small);
  color: var(--au-color-text-primary);
  background: var(--au-material-bg-subtle);
  cursor: pointer;
  transition:
    color var(--au-transition-duration) var(--au-transition-ease),
    background var(--au-transition-duration) var(--au-transition-ease),
    border-color var(--au-transition-duration) var(--au-transition-ease),
    transform var(--au-transition-duration) var(--au-transition-ease);
}

.au-context-menu__tool-button:hover:not(:disabled),
.au-context-menu__tool-button:focus-visible {
  border-color: color-mix(in srgb, var(--au-color-primary) 55%, var(--au-material-border-strong));
  background: color-mix(in srgb, var(--au-color-primary) 12%, var(--au-material-bg-subtle));
  outline: none;
}

.au-context-menu__tool-button:active:not(:disabled) {
  transform: scale(0.94);
}

.au-context-menu__tool-button:disabled {
  color: var(--au-color-text-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.au-context-menu__tool-button.is-danger:not(:disabled) {
  color: var(--au-color-danger);
}

.au-context-menu__tool-icon {
  font-size: 16px;
}

.au-context-menu__item {
  height: 32px;
  padding: 0 13px;
}

.au-context-menu__item-icon,
.au-context-menu__arrow {
  flex: none;
  font-size: 14px;
}

.au-context-menu__item.has-submenu .au-context-menu__arrow,
.au-context-menu__shortcut {
  margin-left: auto;
  color: var(--au-color-text-secondary);
  font-size: 12px;
}

.au-context-menu__separator {
  height: 1px;
  margin: 5px 4px;
  background: var(--au-material-border-strong);
}

.au-context-menu__submenu-wrapper {
  position: relative;
}

.au-context-submenu {
  position: absolute;
  top: -5px;
  left: calc(100% + 6px);
  min-width: 200px;
}

</style>
