<template>
  <TransitionGroup name="au-message-list" tag="div" class="au-message-host" :style="hostStyle">
    <div
      v-for="item in items"
      :key="item.id"
      class="au-message"
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
        class="au-message__close"
        type="button"
        aria-label="关闭消息"
        @click="$emit('close', item.id)"
      >
        <AuIcon name="close" />
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { computed } from 'vue';
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
  display: flex;
  align-items: flex-start;
  gap: 9px;
  max-width: 100%;
  min-height: 40px;
  padding: 10px 14px;
  border: 1px solid var(--au-color-border-lighter);
  border-radius: 8px;
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-color-bg-overlay) 94%, transparent);
  box-shadow: var(--au-shadow-light);
  font-size: 13px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  pointer-events: auto;
  backdrop-filter: blur(20px) saturate(160%);
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
  padding: 0 5px;
  border-radius: 999px;
  color: var(--au-color-text-secondary);
  background: var(--au-color-bg-soft);
  font-size: 11px;
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
}

.au-message__close:hover {
  color: var(--au-color-text-primary);
}

.au-message-list-move,
.au-message-list-enter-active,
.au-message-list-leave-active {
  transition: all 0.22s ease;
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
