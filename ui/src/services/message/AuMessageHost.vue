<template>
  <TransitionGroup name="au-message-list" tag="div" class="au-message-host" :style="hostStyle">
    <div
      v-for="item in items"
      :key="item.id"
      class="au-message au-component au-material-surface au-depth-overlay au-motion-popover au-wrap-anywhere"
      :class="`au-message--${item.type}`"
      role="status"
      @mouseenter="$emit('pause', item.id)"
      @mouseleave="$emit('resume', item.id)"
    >
      <span class="au-message__indicator" aria-hidden="true"></span>
      <span class="au-message__content">{{ item.message }}</span>
      <span v-if="item.repeat > 1" class="au-message__repeat">×{{ item.repeat }}</span>
      <button
        v-if="item.showClose"
        class="au-message__close au-action-control au-focus-ring"
        type="button"
        aria-label="关闭消息"
        @click="$emit('close', item.id)"
      >
        <AuIcon :icon="IconX" />
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { computed } from 'vue';
import { IconX } from '../../icons/internal.js';
import { AuIcon } from '../../components/icon/index.js';

const props = defineProps({
  items: { type: Array, required: true },
  offset: { type: Number, default: 20 },
});

defineEmits(['close', 'pause', 'resume']);

const hostStyle = computed(() => ({ top: `${props.offset}px` }));
</script>

<style scoped lang="scss" src="./AuMessageHost.scss"></style>
