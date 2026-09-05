<template>
  <div>
    <button ref="anchorRef" class="floating-toolbar-demo__anchor" type="button" @click="showToolbar">
      点击此处显示浮动工具条
    </button>
    <AuFloatingToolbar
      :trigger-rect="toolbarRect"
      :refresh-target="anchorRef"
      :keep-visible-target="anchorRef"
      @hide="handleHide"
    >
      <AuButton
        v-for="action in toolbarActions"
        :key="action.id"
        :icon="action.icon"
        size="small"
        circle
        :title="action.label"
        :aria-label="action.label"
        @click="runAction(action)"
      />
      <AuButton
        :icon="deleteAction.icon"
        type="danger"
        size="small"
        circle
        title="删除"
        aria-label="删除"
        @click="runAction(deleteAction)"
      />
    </AuFloatingToolbar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuFloatingToolbar, AuMessage } from 'aurora-plus';
import {
  IconBold,
  IconItalic,
  IconTrash,
  IconUnderline,
} from 'aurora-plus/icons';

const toolbarActions = [
  { id: 'bold', label: '加粗', icon: IconBold },
  { id: 'italic', label: '斜体', icon: IconItalic },
  { id: 'underline', label: '下划线', icon: IconUnderline },
];

const deleteAction = { id: 'delete', label: '删除', icon: IconTrash };
const anchorRef = ref(null);
const toolbarRect = ref(null);

function showToolbar() {
  const rect = anchorRef.value?.getBoundingClientRect();
  if (!rect) return;
  toolbarRect.value = {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function runAction(action) {
  AuMessage.info(`已执行：${action.label}`);
}

function handleHide() {
  toolbarRect.value = null;
}
</script>

<style scoped>
.floating-toolbar-demo__anchor {
  display: grid;
  width: 100%;
  min-height: 128px;
  margin: 0;
  border: 1px dashed var(--au-color-primary);
  border-radius: 8px;
  color: var(--au-color-primary);
  background: color-mix(in srgb, var(--au-color-primary) 7%, transparent);
  cursor: pointer;
  place-items: center;
}

</style>
