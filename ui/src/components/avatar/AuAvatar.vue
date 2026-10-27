<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  src: { type: String, default: '' },
  name: { type: String, default: '' },
  alt: { type: String, default: '' },
  size: { type: [String, Number], default: 'default' },
  shape: { type: String, default: 'circle', validator: (value) => ['circle', 'square'].includes(value) },
});
const emit = defineEmits(['error']);
const failed = ref(false);
watch(() => props.src, () => { failed.value = false; });
const dimension = computed(() => {
  if (typeof props.size === 'number') return Number.isFinite(props.size) && props.size > 0 ? props.size : 32;
  return { small: 24, default: 32, large: 40 }[props.size] || 32;
});
const initials = computed(() => {
  const name = props.name.trim();
  if (!name) return '?';
  if (!/^[\x00-\x7f]+$/.test(name)) return [...name].slice(-2).join('');
  const words = name.split(/\s+/);
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
});
const tint = computed(() => {
  const colors = ['primary', 'success', 'warning', 'danger', 'info'];
  const hash = [...props.name].reduce((value, character) => (value * 31 + character.codePointAt(0)) >>> 0, 0);
  return `var(--au-color-${colors[hash % colors.length]})`;
});
function handleError(event) { failed.value = true; emit('error', event); }
</script>

<template>
  <span class="au-avatar au-component au-motion-state" :class="`au-avatar--${shape}`" :style="{ width: `${dimension}px`, height: `${dimension}px`, fontSize: `${Math.round(dimension * 0.36)}px`, color: tint }">
    <Transition name="au-motion-fade" mode="out-in">
      <img v-if="src && !failed" :key="src" class="au-avatar__image" :src="src" :alt="alt || name" @error="handleError" />
      <span v-else key="fallback" class="au-avatar__fallback"><slot>{{ initials }}</slot></span>
    </Transition>
  </span>
</template>

<style scoped lang="scss" src="./AuAvatar.scss"></style>
