<template>
  <AuDialog
    v-model="dialogVisible"
    :title="options.title"
    :width="options.width"
    :close-on-click-modal="options.closeOnClickModal && !pending"
    :close-on-press-escape="options.closeOnPressEscape && !pending"
    :show-close="options.showClose && !pending"
    :close-label="options.closeLabel"
    @close="handleDialogClose"
  >
    <div class="au-message-box__message">{{ options.message }}</div>

    <template #footer>
      <AuButton v-if="options.showCancelButton" :disabled="pending" @click="handleAction('cancel')">
        {{ options.cancelButtonText }}
      </AuButton>
      <AuButton :type="options.confirmButtonType" :loading="pending" autofocus @click="handleAction('confirm')">
        {{ options.confirmButtonText }}
      </AuButton>
    </template>
  </AuDialog>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import { AuButton } from '../../components/button/index.js';
import { AuDialog } from '../../components/dialog/index.js';

const props = defineProps({
  options: { type: Object, required: true },
});

const emit = defineEmits(['resolve', 'reject']);
const pending = ref(false);
const dialogVisible = ref(true);

function handleDialogClose(reason) {
  if (reason === 'api') return;
  handleAction('close');
}

async function handleAction(action) {
  if (pending.value) return;
  pending.value = true;
  try {
    if (props.options.beforeClose) {
      const allowed = await props.options.beforeClose(action, props.options);
      if (allowed === false) {
        if (action === 'close') {
          await nextTick();
          dialogVisible.value = true;
        }
        return;
      }
    }
    emit('resolve', action === 'confirm', action);
  } catch (error) {
    emit('reject', error);
  } finally {
    pending.value = false;
  }
}
</script>

<style scoped>
.au-message-box__message {
  color: var(--au-color-text-regular);
  font-size: var(--au-font-size-base);
  font-weight: 450;
  line-height: 1.65;
  letter-spacing: 0.002em;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
</style>
