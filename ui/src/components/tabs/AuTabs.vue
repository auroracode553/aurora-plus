<template>
  <div
    ref="tabsRef"
    class="au-tabs au-component"
    :class="{ 'is-fill': fill }"
    role="tablist"
    :aria-label="ariaLabel"
    @keydown="handleKeydown"
  >
    <button
      v-for="item in items"
      :key="resolveValue(item)"
      class="au-tabs__tab au-focus-ring"
      :class="{ 'is-active': isActive(item) }"
      type="button"
      role="tab"
      :disabled="item.disabled"
      :aria-selected="isActive(item)"
      :tabindex="isActive(item) ? 0 : -1"
      :title="item.title || undefined"
      @click="selectItem(item)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  items: { type: Array, default: () => [] },
  valueKey: { type: String, default: 'value' },
  fill: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '标签页' },
});

const emit = defineEmits(['update:modelValue', 'change', 'select']);
const tabsRef = ref(null);

function resolveValue(item) {
  return item?.[props.valueKey];
}

function isActive(item) {
  return Object.is(resolveValue(item), props.modelValue);
}

function selectItem(item) {
  if (!item || item.disabled) return;
  const nextValue = resolveValue(item);
  const previousValue = props.modelValue;
  emit('select', nextValue, item);
  if (Object.is(nextValue, previousValue)) return;
  emit('update:modelValue', nextValue);
  emit('change', nextValue, previousValue, item);
}

function getEnabledTabs() {
  if (!tabsRef.value) return [];
  return Array.from(tabsRef.value.querySelectorAll('[role="tab"]:not(:disabled)'));
}

function handleKeydown(event) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const tabs = getEnabledTabs();
  if (tabs.length === 0) return;

  let nextIndex = -1;
  const currentIndex = tabs.indexOf(document.activeElement);
  if (event.key === 'Home') nextIndex = 0;
  else if (event.key === 'End') nextIndex = tabs.length - 1;
  else if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1 + tabs.length) % tabs.length;
  else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  else return;

  event.preventDefault();
  tabs[nextIndex].focus();
  tabs[nextIndex].click();
}
</script>

<style scoped>
.au-tabs {
  display: flex;
  align-items: stretch;
  min-width: 0;
  min-height: 36px;
  padding: 0 8px;
  gap: 4px;
  border-bottom: 1px solid var(--au-color-border-lighter);
  color: var(--au-color-text-secondary);
}

.au-tabs__tab {
  position: relative;
  min-width: 0;
  min-height: 36px;
  padding: 0 10px;
  border: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  font-size: 13px;
  font-weight: var(--au-font-weight-medium);
  white-space: nowrap;
  cursor: pointer;
  appearance: none;
  transition: color var(--au-transition-duration) var(--au-transition-ease);
}

.au-tabs.is-fill .au-tabs__tab {
  flex: 1;
}

.au-tabs__tab::after {
  content: '';
  position: absolute;
  right: 28%;
  bottom: -1px;
  left: 28%;
  height: 2px;
  border-radius: 999px;
  background: var(--au-color-primary);
  opacity: 0;
  transform: scaleX(0.5);
  transition:
    opacity var(--au-transition-duration) var(--au-transition-ease),
    transform var(--au-transition-duration) var(--au-transition-ease);
}

.au-tabs__tab:hover:not(:disabled),
.au-tabs__tab:focus-visible {
  color: var(--au-color-text-primary);
}

.au-tabs__tab.is-active {
  color: var(--au-color-primary);
  font-weight: var(--au-font-weight-semibold);
}

.au-tabs__tab.is-active::after {
  opacity: 1;
  transform: scaleX(1);
}

.au-tabs__tab:active:not(:disabled) {
  color: color-mix(in srgb, var(--au-color-primary) 78%, var(--au-color-text-primary));
}

.au-tabs__tab:disabled {
  color: var(--au-color-text-disabled);
  cursor: not-allowed;
}

.au-tabs__tab:focus-visible {
  outline-offset: -3px;
}

@media (prefers-reduced-motion: reduce) {
  .au-tabs__tab,
  .au-tabs__tab::after {
    transition: none;
  }
}

@media (prefers-contrast: more) {
  .au-tabs__tab.is-active::after {
    height: 3px;
  }
}
</style>
