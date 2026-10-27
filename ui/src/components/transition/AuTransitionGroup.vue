<script setup>
import { TransitionGroup } from 'vue';
import { transitionProps, useTransitionHooks } from './transition-hooks.js';

const props = defineProps({
  ...transitionProps,
  tag: { type: String, default: 'div' },
  stagger: { type: Number, default: 30, validator: (value) => Number.isFinite(value) && value >= 0 },
});
const emit = defineEmits(['after-enter', 'after-leave']);
const { name, hooks } = useTransitionHooks(props, emit, true);
</script>

<template>
  <TransitionGroup class="au-motion-list" :tag="tag" :name="name" :css="animated" :move-class="animated ? 'au-motion-list-move' : 'au-motion-list-static'" :appear="appear" v-bind="hooks"><slot /></TransitionGroup>
</template>
