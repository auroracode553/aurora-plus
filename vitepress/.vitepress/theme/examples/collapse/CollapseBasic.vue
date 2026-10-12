<script setup>
import { ref } from 'vue';
import { AuButton, AuCollapse, AuCollapseItem } from 'aurora-plus';

const opened = ref(false);
const activeNames = ref(['source']);
const accordionName = ref('basis');
const refreshCount = ref(0);
</script>

<template>
  <div class="collapse-demo">
    <AuCollapseItem v-model="opened" title="分析依据" summary="来源与更新时间" lazy>
      <template #actions><AuButton size="small" @click="refreshCount += 1">刷新</AuButton></template>
      <p>操作按钮独立于展开按钮。已刷新 {{ refreshCount }} 次。</p>
      <p>内容完整换行；首次展开后保留状态。</p>
    </AuCollapseItem>

    <AuCollapse v-model="activeNames" size="small">
      <AuCollapseItem name="source" title="数据来源"><p>多个面板可以同时展开。</p></AuCollapseItem>
      <AuCollapseItem name="history" title="历史明细" lazy destroy-on-close><p>关闭后销毁内容，适合按需读取的明细。</p></AuCollapseItem>
      <AuCollapseItem name="disabled" title="暂不可用" disabled><p>禁用项无法切换。</p></AuCollapseItem>
    </AuCollapse>

    <AuCollapse v-model="accordionName" accordion>
      <AuCollapseItem name="basis" title="判断依据" variant="plain"><p>手风琴模式同一时间只展开一个面板。</p></AuCollapseItem>
      <AuCollapseItem name="risk" title="风险说明" variant="plain"><p>展开风险说明会收起判断依据。</p></AuCollapseItem>
    </AuCollapse>
  </div>
</template>

<style scoped>
.collapse-demo { display: grid; min-width: 0; gap: 12px; }
</style>
