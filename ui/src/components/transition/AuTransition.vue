<script setup>
import { Transition } from 'vue';
import { transitionProps, useTransitionHooks } from './transition-hooks.js';

const props = defineProps({
  ...transitionProps,
  mode: { type: String, default: undefined, validator: (value) => ['out-in', 'in-out'].includes(value) },
});
const emit = defineEmits(['after-enter', 'after-leave']);
const { name, hooks } = useTransitionHooks(props, emit);
</script>

<template>
  <Transition :name="name" :css="animated" :appear="appear" :mode="mode" v-bind="hooks"><slot /></Transition>
</template>
