<template>
  <div class="floating-toolbar-demo">
    <AuSegmented v-model="toolbarSize" :items="sizeOptions" />
    <button ref="anchorRef" class="floating-toolbar-demo__anchor" type="button" @click="showToolbar">
      点击此处显示浮动工具条
    </button>
    <AuFloatingToolbar
      :trigger-rect="toolbarRect"
      :size="toolbarSize"
      :refresh-target="anchorRef"
      :keep-visible-target="anchorRef"
      @hide="handleHide"
    >
      <AuTooltip content="放大预览">
        <AuButtonGroupItem :icon="IconZoomIn" title="放大预览" @click="runAction({ id: 'preview', label: '放大预览' })" />
      </AuTooltip>
      <AuDivider orientation="vertical" />
      <div class="floating-toolbar-demo__group">
        <AuTooltip v-for="action in alignmentActions" :key="action.id" :content="action.label">
          <AuButtonGroupItem :icon="action.icon" :selected="alignment === action.id" :title="action.label" @click="runAction(action)" />
        </AuTooltip>
      </div>
      <AuDivider orientation="vertical" />
      <div class="floating-toolbar-demo__group">
        <AuTooltip content="查看源码"><AuButtonGroupItem :icon="IconCode" title="查看源码" @click="runAction({ id: 'source', label: '查看源码' })" /></AuTooltip>
        <AuTooltip content="删除"><AuButtonGroupItem :icon="IconTrash" type="danger" title="删除" @click="runAction({ id: 'delete', label: '删除' })" /></AuTooltip>
      </div>
    </AuFloatingToolbar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButtonGroupItem, AuDivider, AuFloatingToolbar, AuMessage, AuSegmented, AuTooltip } from 'aurora-plus';
import {
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconCode,
  IconTrash,
  IconZoomIn,
} from 'aurora-plus/icons';

const alignmentActions = [
  { id: 'left', label: '左对齐', icon: IconAlignLeft },
  { id: 'center', label: '居中', icon: IconAlignCenter },
  { id: 'right', label: '右对齐', icon: IconAlignRight },
];
const alignment = ref('center');
const toolbarSize = ref('default');
const sizeOptions = [{ label: '小号', value: 'small' }, { label: '默认', value: 'default' }, { label: '大号', value: 'large' }];
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
  if (alignmentActions.some((item) => item.id === action.id)) alignment.value = action.id;
  AuMessage.info(`已执行：${action.label}`);
}

function handleHide() {
  toolbarRect.value = null;
}
</script>

<style scoped>
.floating-toolbar-demo { display: grid; gap: 12px; }
.floating-toolbar-demo__group { display: inline-flex; align-items: center; gap: 2px; }
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
