<template>
  <div>
    <AuButton type="primary" @click="dialogVisible = true">编辑项目资料</AuButton>
    <p class="dialog-demo__summary">
      已保存：{{ savedProfile.name }} · {{ savedProfile.description }}
    </p>

    <AuDialog
      v-model="dialogVisible"
      title="编辑项目资料"
      width="520px"
      close-on-click-modal
      @close="lastCloseReason = $event"
    >
      <form class="dialog-demo__form" @submit.prevent="saveProfile">
        <label>
          <span>项目名称</span>
          <input v-model.trim="draftProfile.name" autofocus />
        </label>
        <label>
          <span>项目说明</span>
          <textarea v-model.trim="draftProfile.description" rows="3"></textarea>
        </label>
      </form>

      <template #footer>
        <span class="dialog-demo__reason">上次关闭来源：{{ lastCloseReason }}</span>
        <AuButton @click="dialogVisible = false">取消</AuButton>
        <AuButton type="primary" :disabled="!draftProfile.name" @click="saveProfile">保存</AuButton>
      </template>
    </AuDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { AuButton, AuDialog } from 'aurora-ui';

const dialogVisible = ref(false);
const lastCloseReason = ref('暂无');

const draftProfile = reactive({
  name: 'Aurora Editor',
  description: '一个专注 Markdown 编辑体验的桌面应用。',
});

const savedProfile = reactive({ ...draftProfile });

function saveProfile() {
  if (!draftProfile.name) return;
  Object.assign(savedProfile, draftProfile);
  dialogVisible.value = false;
}
</script>

<style scoped>
.dialog-demo__summary {
  margin: 14px 0 0;
  color: var(--au-color-text-secondary);
  font-size: 13px;
}

.dialog-demo__form,
.dialog-demo__form label {
  display: grid;
  gap: 14px;
}

.dialog-demo__form label {
  gap: 7px;
  color: var(--au-color-text-regular);
  font-size: 13px;
}

.dialog-demo__form input,
.dialog-demo__form textarea {
  width: 100%;
  padding: 9px 11px;
  border: 1px solid var(--au-color-border);
  border-radius: var(--au-border-radius-base);
  color: var(--au-color-text-primary);
  background: var(--au-color-bg);
  outline: none;
  resize: vertical;
}

.dialog-demo__form input:focus,
.dialog-demo__form textarea:focus {
  border-color: var(--au-color-primary);
}

.dialog-demo__reason {
  margin-right: auto;
  color: var(--au-color-text-secondary);
  font-size: 12px;
}
</style>
