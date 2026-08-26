<template>
  <div>
    <button ref="anchorRef" class="floating-toolbar-demo__anchor" type="button" @click="showToolbar">
      点击此处显示浮动工具条
    </button>
    <AuFloatingToolbar
      ref="toolbarRef"
      :trigger-rect="toolbarRect"
      :refresh-target="anchorRef"
      :keep-visible-target="anchorRef"
      @hide="handleHide"
    >
      <div class="au-floating-toolbar__group">
        <button
          v-for="action in toolbarActions"
          :key="action.id"
          class="au-floating-toolbar__button"
          :class="action.className"
          type="button"
          :title="action.label"
          @click="runAction(action)"
        >
          {{ action.text }}
        </button>
      </div>
      <span class="au-floating-toolbar__separator"></span>
      <button
        class="au-floating-toolbar__button is-danger"
        type="button"
        title="删除"
        @click="runAction(deleteAction)"
      >
        ×
      </button>
    </AuFloatingToolbar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuFloatingToolbar, AuMessage } from 'aurora-ui';

const toolbarActions = [
  { id: 'bold', label: '加粗', text: 'B', className: 'is-primary' },
  { id: 'italic', label: '斜体', text: 'I', className: '' },
  { id: 'underline', label: '下划线', text: 'U', className: '' },
];

const deleteAction = { id: 'delete', label: '删除', text: '×' };
const anchorRef = ref(null);
const toolbarRef = ref(null);
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
  min-height: 220px;
  margin: 0;
  border: 1px dashed var(--au-color-primary);
  border-radius: 10px;
  color: var(--au-color-primary);
  background: color-mix(in srgb, var(--au-color-primary) 7%, var(--au-color-bg));
  cursor: pointer;
  place-items: center;
}

</style>
