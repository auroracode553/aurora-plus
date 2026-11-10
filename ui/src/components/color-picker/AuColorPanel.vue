<template>
  <div class="au-color-panel">
    <div class="au-color-panel__plane" :style="{ backgroundColor: hueColor }"
      role="group" aria-label="饱和度与明度画板" :class="{ 'is-disabled': disabled }"
      @pointerdown="startDrag" @pointermove="moveDrag" @pointerup="finishDrag"
      @pointercancel="cancelDrag" @lostpointercapture="finishDrag">
      <span class="au-color-panel__thumb" :style="{ left: `${hsv.saturation * 100}%`, top: `${(1 - hsv.brightness) * 100}%`, backgroundColor: color }"></span>
      <input ref="saturationRef" class="au-color-panel__accessible" type="range" min="0" max="100" step="1"
        aria-label="饱和度" :value="hsv.saturation * 100" :disabled="disabled"
        @input="adjust('saturation', $event, 100)" @change="commit" />
      <input class="au-color-panel__accessible" type="range" min="0" max="100" step="1"
        aria-label="明度" :value="hsv.brightness * 100" :disabled="disabled"
        @input="adjust('brightness', $event, 100)" @change="commit" />
    </div>
    <div class="au-color-panel__hue-row">
      <span class="au-color-panel__preview" role="img" :aria-label="`当前颜色 ${color}`" :style="{ backgroundColor: color }"></span>
      <input class="au-color-panel__hue" type="range" min="0" max="360" step="1" aria-label="色相"
        :value="hsv.hue" :disabled="disabled" @input="adjust('hue', $event)" @change="commit" />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { colorToHsv, hsvToColor, normalizeColor } from '../../utils/color.js';

const props = defineProps({ modelValue: { type: String, required: true }, disabled: Boolean });
const emit = defineEmits(['input', 'change']);
const hsv = ref(colorToHsv(props.modelValue));
const color = computed(() => hsvToColor(hsv.value));
const hueColor = computed(() => hsvToColor({ hue: hsv.value.hue, saturation: 1, brightness: 1 }));
const saturationRef = ref(null);
let drag = null;

function syncColor(value) {
  // 同色回传不反算，避免选择黑白灰时丢失正在调整的色相。
  if (normalizeColor(value) !== color.value) hsv.value = colorToHsv(value);
}
watch(() => props.modelValue, syncColor);
watch(() => props.disabled, (disabled) => { if (disabled) drag = null; });

function publish(event) {
  emit('input', color.value, event);
  // 宿主拒绝更新时恢复受控值，不保留第二份业务颜色。
  nextTick(() => syncColor(props.modelValue));
}
function commit(event) {
  if (!props.disabled) emit('change', color.value, event);
}
function adjust(channel, event, divisor = 1) {
  if (props.disabled) return;
  hsv.value = { ...hsv.value, [channel]: Number(event.target.value) / divisor };
  publish(event);
}
function updateFromPointer(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const clamp = (value) => Math.max(0, Math.min(1, value));
  hsv.value = { ...hsv.value, saturation: clamp((event.clientX - rect.left) / rect.width), brightness: 1 - clamp((event.clientY - rect.top) / rect.height) };
  publish(event);
}
function startDrag(event) {
  if (props.disabled || event.button !== 0 || drag) return;
  event.preventDefault();
  saturationRef.value.focus({ preventScroll: true });
  drag = { pointerId: event.pointerId, hsv: { ...hsv.value } };
  event.currentTarget.setPointerCapture(event.pointerId);
  updateFromPointer(event);
}
function moveDrag(event) {
  if (drag && drag.pointerId === event.pointerId && !props.disabled) updateFromPointer(event);
}
function finishDrag(event) {
  if (!drag || drag.pointerId !== event.pointerId) return;
  drag = null;
  commit(event);
}
function cancelDrag(event) {
  if (!drag || drag.pointerId !== event.pointerId) return;
  hsv.value = drag.hsv;
  drag = null;
  if (!props.disabled) publish(event);
}
</script>

<style scoped lang="scss" src="./AuColorPanel.scss"></style>
