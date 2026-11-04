<script setup>
import { AuHelpTooltip } from 'aurora-plus';

const instructions = [
  '悬浮圆形问号可查看说明，点击后保留内容。',
  '点击外部会关闭提示，较长内容可在提示内滚动。',
];
</script>

<template>
  <div class="help-tooltip-demo">
    <span>查看说明</span>
    <AuHelpTooltip title="图标提示" :lines="instructions" />
    <span>自定义正文</span>
    <AuHelpTooltip>
      <template #content>
        <strong>自定义内容</strong>
        <span>正文可以由内容插槽组织，图标和打开关闭行为保持一致。</span>
      </template>
    </AuHelpTooltip>
  </div>
</template>

<style scoped>
.help-tooltip-demo { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
</style>
