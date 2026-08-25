<template>
  <DemoBlock title="锚点工具条" description="点击锚点；工具条会根据视口空间自动选择上方或下方">
    <button class="floating-toolbar-demo__anchor" type="button" @click="showToolbar">
      点击此处显示浮动工具条
    </button>
    <AuFloatingToolbar
      :trigger-rect="toolbarRect"
      keep-visible-selector=".floating-toolbar-demo__anchor"
      refresh-selector=".floating-toolbar-demo__anchor"
      @hide="toolbarRect = null"
    >
      <div class="au-floating-toolbar__group">
        <button class="au-floating-toolbar__button is-primary" type="button" title="收藏" @click="AuMessage('已收藏')">
          <AuIcon name="star" />
        </button>
        <button class="au-floating-toolbar__button" type="button" title="复制" @click="AuMessage('已复制')">
          <AuIcon name="copy" />
        </button>
      </div>
      <span class="au-floating-toolbar__separator"></span>
      <button class="au-floating-toolbar__button is-danger" type="button" title="删除" @click="AuMessage.warning('删除操作')">
        <AuIcon name="trash" />
      </button>
    </AuFloatingToolbar>
  </DemoBlock>
</template>

<script setup>
import { ref } from 'vue';
import { AuFloatingToolbar, AuIcon, AuMessage } from 'aurora-ui';
import DemoBlock from './DemoBlock.vue';

const toolbarRect = ref(null);

function showToolbar(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  toolbarRect.value = {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}
</script>

<style scoped>
.floating-toolbar-demo__anchor {
  display: grid;
  width: 100%;
  min-height: 210px;
  border: 1px dashed var(--au-color-primary);
  border-radius: 12px;
  color: var(--au-color-primary);
  background: color-mix(in srgb, var(--au-color-primary) 7%, var(--au-color-bg));
  cursor: pointer;
  place-items: center;
}
</style>
