<template>
  <AuVirtualTable
    :columns="columns"
    :data="rows"
    auto-height
    :row-height="48"
    :header-height="36"
    row-key="id"
    border
  />
</template>

<script setup>
import { AuVirtualTable } from 'aurora-plus';

const columns = [
  { key: 'id', title: '编号', dataKey: 'id', width: 90, fixed: 'left' },
  { key: 'name', title: '名称', dataKey: 'name', width: 220 },
  { key: 'owner', title: '负责人', dataKey: 'owner', width: 160 },
  { key: 'status', title: '状态', dataKey: 'status', width: 150 },
  { key: 'progress', title: '进度', dataKey: 'progress', width: 150 },
  { key: 'updatedAt', title: '更新时间', dataKey: 'updatedAt', width: 220 },
  { key: 'note', title: '备注', dataKey: 'note', width: 280 },
];

const rows = [
  { id: 1, name: '设计规范整理', owner: '林晨', status: '已完成', progress: '100%', updatedAt: '2026-09-10 09:30', note: '已同步最新组件规范' },
  { id: 2, name: '数据接口联调', owner: '周言', status: '进行中', progress: '72%', updatedAt: '2026-09-11 14:20', note: '等待服务端补充异常响应' },
  { id: 3, name: '桌面布局检查', owner: '陈夏', status: '进行中', progress: '58%', updatedAt: '2026-09-12 10:15', note: '宽屏布局已完成' },
  { id: 4, name: '移动端布局检查', owner: '林晨', status: '待处理', progress: '20%', updatedAt: '2026-09-12 16:45', note: '需要验证横向滚动体验' },
  { id: 5, name: '版本发布说明', owner: '周言', status: '待处理', progress: '0%', updatedAt: '2026-09-13 08:40', note: '汇总本次组件属性变化' },
];
</script>
