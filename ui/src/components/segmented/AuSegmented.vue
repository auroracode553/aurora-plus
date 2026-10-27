<script setup>
import { computed, ref } from 'vue';
import AuIcon from '../icon/AuIcon.vue';
import { useSlidingIndicator } from '../../utils/use-sliding-indicator.js';

const props = defineProps({
  modelValue: { type: [String, Number], default: undefined },
  items: { type: Array, default: () => [] },
  valueKey: { type: String, default: 'value' },
  size: { type: String, default: 'default', validator: (value) => ['small', 'default', 'large'].includes(value) },
  disabled: { type: Boolean, default: false },
  fill: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue', 'change']);
const root = ref(null);
const items = computed(() => props.items.map((item) => typeof item === 'object' && item !== null
  ? { ...item, value: item[props.valueKey] }
  : { label: String(item), value: item }));
const { style: indicatorStyle, animated } = useSlidingIndicator(root, {
  target: () => root.value?.querySelector('.au-segmented__item.is-selected'),
  dependencies: [() => props.modelValue, items, () => props.fill, () => props.size],
});

function select(item) {
  if (props.disabled || item.disabled || Object.is(item.value, props.modelValue)) return;
  emit('update:modelValue', item.value);
  emit('change', item.value, props.modelValue, item);
}

function handleKeydown(event) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const buttons = [...root.value.querySelectorAll('button:not(:disabled)')];
  if (!buttons.length) return;
  const current = buttons.indexOf(document.activeElement);
  const indices = { Home: 0, End: buttons.length - 1, ArrowRight: (current + 1) % buttons.length, ArrowLeft: (current - 1 + buttons.length) % buttons.length };
  if (!(event.key in indices)) return;
  event.preventDefault();
  const button = buttons[indices[event.key]];
  button.focus();
  button.click();
}
</script>

<template>
  <div ref="root" class="au-segmented au-component au-material-surface au-material-surface--base au-motion-state" :class="[`au-segmented--${size}`, { 'is-fill': fill, 'is-disabled': disabled }]" @keydown="handleKeydown">
    <span class="au-segmented__indicator" :class="{ 'is-animated': animated }" :style="indicatorStyle" />
    <button v-for="item in items" :key="item.value" type="button" class="au-segmented__item au-motion-control" :class="{ 'is-selected': Object.is(item.value, modelValue) }" :disabled="disabled || item.disabled" @click="select(item)">
      <slot name="item" :item="item" :selected="Object.is(item.value, modelValue)">
        <AuIcon v-if="item.icon" :icon="item.icon" :size="14" />
        <span class="au-truncate">{{ item.label }}</span>
      </slot>
    </button>
  </div>
</template>

<style scoped lang="scss" src="./AuSegmented.scss"></style>
