<template>
  <div class="loading-control-demo">
    <div class="loading-control-demo__row">
      <AuButton loading>提交中</AuButton>
      <AuButton type="primary" loading>保存中</AuButton>

      <AuButtonGroup variant="connected" aria-label="同步操作">
        <AuButtonGroupItem :icon="IconRefresh" loading>同步</AuButtonGroupItem>
        <AuButtonGroupItem :icon="IconSettings">设置</AuButtonGroupItem>
      </AuButtonGroup>
    </div>

    <div class="loading-control-demo__fields">
      <AuInput model-value="正在读取账户信息" loading aria-label="账户信息" />
      <AuCheckbox :model-value="true" loading>正在保存选择</AuCheckbox>
      <AuSwitch :model-value="true" loading active-text="正在应用设置" />
    </div>

    <AuVirtualTable
      :columns="columns"
      :data="rows"
      :height="184"
      loading
      loading-text="正在刷新表格"
      aria-label="加载中的任务表格"
    />
  </div>
</template>

<script setup>
import {
  AuButton,
  AuButtonGroup,
  AuButtonGroupItem,
  AuCheckbox,
  AuInput,
  AuSwitch,
  AuVirtualTable,
} from 'aurora-plus';
import { IconRefresh, IconSettings } from 'aurora-plus/icons';

const columns = [
  { key: 'name', title: '任务', dataKey: 'name', flexGrow: 1, minWidth: 150 },
  { key: 'owner', title: '负责人', dataKey: 'owner', width: 100 },
];
const rows = [
  { id: 1, name: '同步设计资源', owner: '林晨' },
  { id: 2, name: '更新组件索引', owner: '周言' },
  { id: 3, name: '检查无障碍状态', owner: '陈夏' },
];
</script>

<style scoped>
.loading-control-demo,
.loading-control-demo__fields {
  display: grid;
  gap: 14px;
}

.loading-control-demo__row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.loading-control-demo__fields {
  width: min(100%, 380px);
}
</style>
