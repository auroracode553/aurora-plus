<template>
  <DemoBlock title="按钮类型" description="悬停、点击并切换文档暗色模式查看效果">
    <div class="au-doc-row">
      <AuButton>默认按钮</AuButton>
      <AuButton type="primary">主要按钮</AuButton>
      <AuButton type="success">成功按钮</AuButton>
      <AuButton type="warning">警告按钮</AuButton>
      <AuButton type="danger">危险按钮</AuButton>
      <AuButton type="info">信息按钮</AuButton>
    </div>
    <div class="au-doc-row">
      <AuButton type="primary" plain>朴素按钮</AuButton>
      <AuButton type="success" round>圆角按钮</AuButton>
      <AuButton type="primary" loading>处理中</AuButton>
      <AuButton disabled>禁用按钮</AuButton>
      <AuButton size="small">小型</AuButton>
      <AuButton size="large">大型</AuButton>
    </div>
  </DemoBlock>

  <DemoBlock title="图标与提示" description="图标来自内置集合或 registerIcons()">
    <div class="au-doc-row au-doc-icon-row">
      <AuTooltip content="关闭图标" placement="top"><AuIcon name="close" /></AuTooltip>
      <AuTooltip content="加载图标" placement="bottom"><AuIcon class="au-doc-spin" name="loading" /></AuTooltip>
      <AuTooltip content="右箭头" placement="right"><AuIcon name="chevron-right" /></AuTooltip>
      <AuTooltip content="文档主题注册的太阳图标" placement="left"><AuIcon name="sun" color="#e6a23c" /></AuTooltip>
      <AuCloseButton tooltip="点击关闭" @click="AuMessage('点击了关闭按钮')" />
    </div>
  </DemoBlock>
</template>

<script setup>
import { AuButton, AuCloseButton, AuIcon, AuMessage, AuTooltip } from 'aurora-ui';
import DemoBlock from './DemoBlock.vue';
</script>
