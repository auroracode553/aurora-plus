<script>
// 子项通过共享注入键读取分组接口，不直接修改分组状态。
export const COLLAPSE_CONTEXT = Symbol('aurora-collapse');
</script>

<script setup>
import { computed, provide, ref } from 'vue';

const props = defineProps({
  modelValue: { type: [Array, String, Number], default: undefined },
  defaultValue: { type: [Array, String, Number], default: () => [] },
  accordion: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'default', validator: (value) => ['small', 'default'].includes(value) },
});
const emit = defineEmits(['update:modelValue', 'change']);
const localValue = ref(props.defaultValue);
const activeNames = computed(() => {
  const value = props.modelValue === undefined ? localValue.value : props.modelValue;
  const names = value == null ? [] : Array.isArray(value) ? value : [value];
  return props.accordion ? names.slice(0, 1) : names;
});

function toggle(name) {
  if (props.disabled) return;
  const opened = activeNames.value.includes(name);
  const next = props.accordion
    ? (opened ? null : name)
    : (opened ? activeNames.value.filter((item) => item !== name) : [...activeNames.value, name]);
  if (props.modelValue === undefined) localValue.value = next;
  emit('update:modelValue', next);
  emit('change', next);
}

provide(COLLAPSE_CONTEXT, {
  isOpen: (name) => activeNames.value.includes(name),
  toggle,
  disabled: computed(() => props.disabled),
  size: computed(() => props.size),
});
</script>

<template>
  <div class="au-collapse au-component"><slot /></div>
</template>

<style scoped>
.au-collapse { display: grid; min-width: 0; gap: 6px; }
</style>
