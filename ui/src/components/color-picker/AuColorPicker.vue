<template>
  <AuPopover ref="popoverRef" :disabled="disabled" placement="bottom-start"
    @open="expanded = true" @close="expanded = false">
    <template #trigger>
      <button ref="inputRef" class="au-color-picker au-component au-motion-state"
        :class="[`is-${size}`, { 'is-disabled': disabled }, $attrs.class]" :style="$attrs.style"
        v-bind="getControlAttrs()" type="button" :disabled="disabled" aria-haspopup="dialog"
        :aria-expanded="expanded"
        @focus="emit('focus', $event)" @blur="emit('blur', $event)">
        <span class="au-color-picker__swatch" :style="{ backgroundColor: resolvedValue }"></span>
      </button>
    </template>
    <div class="au-color-picker__panel" role="dialog" :aria-label="attrs['aria-label'] || '选择颜色'">
      <AuColorPanel v-if="type === ''" :model-value="resolvedValue" :disabled="disabled"
        @input="publish" @change="commit" />
      <div v-else class="au-color-picker__presets" role="group" aria-label="预设颜色">
        <AuColorSwatch v-for="preset in resolvedColors" :key="preset.color" :color="preset.color" :disabled="disabled"
          :title="preset.name" :selected="preset.color === resolvedValue" :aria-label="preset.name"
          :aria-pressed="preset.color === resolvedValue" @click="selectSwatch(preset.color, $event)" />
      </div>
    </div>
  </AuPopover>
</template>

<script setup>
import { computed, ref, useAttrs } from 'vue';
import { AuPopover } from '../popover/index.js';
import AuColorPanel from './AuColorPanel.vue';
import AuColorSwatch from './AuColorSwatch.vue';
import { DEFAULT_COLOR_PRESETS, normalizeColor } from '../../utils/color.js';

defineOptions({ inheritAttrs: false });
const props = defineProps({
  modelValue: { type: String, default: '#000000' },
  fallback: { type: String, default: '#ffffff' },
  type: { type: String, default: '', validator: (value) => ['', 'fixed'].includes(value) },
  colors: { type: Array, default: () => [...DEFAULT_COLOR_PRESETS] },
  size: { type: String, default: 'default', validator: (value) => ['small', 'default', 'large'].includes(value) },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur']);
const attrs = useAttrs();
const inputRef = ref(null);
const popoverRef = ref(null);
const expanded = ref(false);
const resolvedValue = computed(() => normalizeColor(props.modelValue, props.fallback));
const resolvedColors = computed(() => props.colors.map((preset) => {
  const color = typeof preset === 'string' ? preset : preset?.color;
  return {
    color: normalizeColor(color, props.fallback),
    name: String((typeof preset === 'object' && preset?.name) || color || '选择颜色'),
  };
}));

function getControlAttrs() {
  return { 'aria-label': '选择颜色', ...Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style'].includes(name))) };
}
function publish(value, event) {
  if (props.disabled) return;
  emit('update:modelValue', value);
  emit('input', value, event);
}
function commit(value, event) {
  if (!props.disabled) emit('change', value, event);
}
function selectSwatch(value, event) {
  const color = normalizeColor(value, props.fallback);
  publish(color, event);
  commit(color, event);
  popoverRef.value.close('select', true);
}
function focus(options) {
  if (inputRef.value) inputRef.value.focus(options);
}
defineExpose({ focus, inputRef });
</script>

<style scoped lang="scss" src="./AuColorPicker.scss"></style>
