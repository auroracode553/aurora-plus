<template>
  <div class="tooltip-demo">
    <AuTooltip
      v-for="item in tooltipItems"
      :key="item.placement"
      :content="item.content"
      :placement="item.placement"
      :show-after="item.showAfter"
    >
      <AuButton>{{ item.placement }}</AuButton>
    </AuTooltip>

    <AuTooltip placement="top">
      <AuButton type="primary">使用内容插槽</AuButton>
      <template #content>
        <strong>自定义内容</strong><br />支持任意可信模板
      </template>
    </AuTooltip>
  </div>
</template>

<script setup>
import { AuButton, AuTooltip } from 'aurora-ui';

const tooltipItems = [
  { placement: 'top', content: '显示在目标上方', showAfter: 100 },
  { placement: 'right', content: '显示在目标右侧', showAfter: 100 },
  { placement: 'bottom-start', content: '下方并与起点对齐', showAfter: 100 },
  { placement: 'left-end', content: '左侧并与终点对齐', showAfter: 100 },
];
</script>

<style scoped>
.tooltip-demo {
  display: flex;
  align-items: center;
  min-height: 120px;
  flex-wrap: wrap;
  gap: 14px;
}
</style>
