<template>
  <div
    ref="tabsRef"
    class="au-tabs au-component"
    :class="{ 'is-fill': fill }"
    @keydown="handleKeydown"
  >
    <button
      v-for="item in items"
      :key="resolveValue(item)"
      class="au-tabs__tab au-control-reset au-disabled-text"
      :class="{ 'is-active': isActive(item) }"
      type="button"
      :disabled="item.disabled"
      :tabindex="isActive(item) ? 0 : -1"
      :title="item.title || undefined"
      @click="selectItem(item)"
    >
      <span class="au-tabs__label">
        <span class="au-truncate">{{ item.label }}</span>
      </span>
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
  return Array.from(tabsRef.value.querySelectorAll('.au-tabs__tab:not(:disabled)'));
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

<style scoped lang="scss" src="./AuTabs.scss"></style>
