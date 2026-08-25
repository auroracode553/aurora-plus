<template>
  <DemoBlock title="消息提示" description="支持类型、常驻、关闭按钮和重复消息合并">
    <div class="au-doc-row">
      <AuButton @click="AuMessage('这是一条普通消息')">普通消息</AuButton>
      <AuButton type="success" plain @click="AuMessage.success('操作成功')">成功消息</AuButton>
      <AuButton type="warning" plain @click="AuMessage.warning({ message: '请检查输入内容', showClose: true })">警告消息</AuButton>
      <AuButton type="danger" plain @click="AuMessage.error({ message: '常驻错误消息', duration: 0, showClose: true })">常驻消息</AuButton>
      <AuButton type="primary" @click="openConfirm">确认框</AuButton>
    </div>
  </DemoBlock>

  <DemoBlock title="对话框" description="支持 v-model、遮罩关闭、Escape、焦点恢复和滚动锁">
    <AuButton type="primary" @click="dialogVisible = true">打开对话框</AuButton>
    <AuDialog v-model="dialogVisible" title="编辑资料" width="520px" close-on-click-modal>
      <div class="feedback-form">
        <label>显示名称<input value="Aurora Editor" /></label>
        <label>项目说明<textarea rows="3">一个专注 Markdown 编辑体验的桌面应用。</textarea></label>
      </div>
      <template #footer>
        <AuButton @click="dialogVisible = false">取消</AuButton>
        <AuButton type="primary" @click="saveDialog">保存</AuButton>
      </template>
    </AuDialog>
  </DemoBlock>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuDialog, AuMessage, AuMessageBox } from 'aurora-ui';
import DemoBlock from './DemoBlock.vue';

const dialogVisible = ref(false);

async function openConfirm() {
  const confirmed = await AuMessageBox.confirm({
    title: '确认操作',
    message: '这是 Aurora UI 的命令式确认框。是否继续？',
  });
  AuMessage.info(confirmed ? '你点击了确定' : '你取消了操作');
}

function saveDialog() {
  dialogVisible.value = false;
  AuMessage.success('资料已保存');
}
</script>

<style scoped>
.feedback-form {
  display: grid;
  gap: 18px;
}

.feedback-form label {
  display: grid;
  gap: 7px;
  color: var(--au-color-text-regular);
  font-size: 13px;
}

.feedback-form input,
.feedback-form textarea {
  width: 100%;
  padding: 9px 11px;
  border: 1px solid var(--au-color-border);
  border-radius: var(--au-border-radius-base);
  color: var(--au-color-text-primary);
  background: var(--au-color-bg);
  outline: none;
  resize: vertical;
}

.feedback-form input:focus,
.feedback-form textarea:focus {
  border-color: var(--au-color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--au-color-primary) 15%, transparent);
}
</style>
