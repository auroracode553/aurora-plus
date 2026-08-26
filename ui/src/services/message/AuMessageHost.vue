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
        class="au-message__close au-focus-ring"
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
import { IconX } from '@tabler/icons-vue';
import { AuIcon } from '../../components/icon/index.js';

const props = defineProps({
  items: { type: Array, required: true },
  offset: { type: Number, default: 20 },
});

defineEmits(['close', 'pause', 'resume']);

const hostStyle = computed(() => ({ top: `${props.offset}px` }));
</script>

<style scoped>
.au-message-host {
  position: fixed;
  left: 50%;
  z-index: var(--au-z-index-message);
  display: flex;
  align-items: center;
  width: min(560px, calc(100vw - 32px));
  transform: translateX(-50%);
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.au-message {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  max-width: 100%;
  min-height: 40px;
  padding: 10px 14px;
  border-radius: var(--au-border-radius-base);
  color: var(--au-color-text-primary);
  font-size: var(--au-font-size-base);
  font-weight: var(--au-font-weight-medium);
  line-height: 1.45;
  pointer-events: auto;
}

.au-message__indicator {
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--au-color-info);
  flex: none;
}

.au-message--success .au-message__indicator {
  background: var(--au-color-success);
}

.au-message--warning .au-message__indicator {
  background: var(--au-color-warning);
}

.au-message--error .au-message__indicator {
  background: var(--au-color-danger);
}

.au-message__content {
  min-width: 0;
}

.au-message__repeat {
  min-width: 20px;
  padding: 1px 6px;
  border-radius: 999px;
  color: var(--au-color-text-secondary);
  background: var(--au-material-bg-subtle);
  font-size: 11px;
  line-height: 1.5;
  flex: none;
}

.au-message__close {
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  margin: 0 0 0 2px;
  padding: 0;
  border: 0;
  color: var(--au-color-text-secondary);
  background: transparent;
  cursor: pointer;
  flex: none;
  border-radius: 7px;
  transition: var(--au-transition-control);
}

.au-message__close:hover {
  color: var(--au-color-text-primary);
  background: var(--au-color-bg-hover);
}

.au-message__close:active {
  transform: scale(0.9);
}

.au-message-list-enter-from,
.au-message-list-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.au-message-list-leave-active {
  position: absolute;
}

</style>
