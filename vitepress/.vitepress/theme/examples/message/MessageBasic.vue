<template>
  <div>
    <div class="au-doc-row">
      <AuButton
        v-for="example in messageExamples"
        :key="example.label"
        :type="example.buttonType"
        :plain="example.buttonType !== 'default'"
        @click="showMessage(example)"
      >
        {{ example.label }}
      </AuButton>
      <AuButton type="primary" @click="showGroupedMessage">连续发送 3 次</AuButton>
      <AuButton @click="AuMessage.closeAll()">关闭全部</AuButton>
    </div>
  </div>
</template>

<script setup>
import { AuButton, AuMessage } from 'aurora-plus';

const messageExamples = [
  {
    label: '普通消息',
    method: 'info',
    buttonType: 'default',
    options: { message: '新的同步任务已经开始', duration: 2200 },
  },
  {
    label: '成功消息',
    method: 'success',
    buttonType: 'success',
    options: { message: '项目设置保存成功', duration: 2200 },
  },
  {
    label: '警告消息',
    method: 'warning',
    buttonType: 'warning',
    options: { message: '磁盘剩余空间不足 10%', showClose: true },
  },
  {
    label: '错误消息',
    method: 'error',
    buttonType: 'danger',
    options: { message: '无法连接到远程仓库', duration: 3000, showClose: true },
  },
];

function showMessage(example) {
  AuMessage[example.method](example.options);
}

function showGroupedMessage() {
  const options = { message: '发现可用更新', grouping: true, showClose: true };
  AuMessage.info(options);
  AuMessage.info(options);
  AuMessage.info(options);
}
</script>
