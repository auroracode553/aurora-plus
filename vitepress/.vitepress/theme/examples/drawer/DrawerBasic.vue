<template>
  <div class="drawer-demo">
    <div class="drawer-demo__actions">
      <AuButton type="primary" @click="openDrawer('rtl')">从右侧打开</AuButton>
      <AuButton @click="openDrawer('btt')">从底部打开</AuButton>
    </div>

    <AuDrawer
      v-model="drawerVisible"
      title="项目设置"
      :direction="drawerDirection"
      size="min(420px, calc(100vw - 16px))"
      close-on-click-modal
    >
      <form class="drawer-demo__form" @submit.prevent="saveSettings">
        <label>
          <span>项目名称</span>
          <input v-model.trim="settings.name" autofocus />
        </label>
        <label>
          <span>项目说明</span>
          <textarea v-model.trim="settings.description" rows="4"></textarea>
        </label>
      </form>

      <template #footer>
        <AuButton @click="drawerVisible = false">取消</AuButton>
        <AuButton type="primary" :disabled="!settings.name" @click="saveSettings">保存</AuButton>
      </template>
    </AuDrawer>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { AuButton, AuDrawer } from 'aurora-plus';

const drawerVisible = ref(false);
const drawerDirection = ref('rtl');
const settings = reactive({
  name: 'Aurora Editor',
  description: '一个专注 Markdown 编辑体验的桌面应用。',
});

function saveSettings() {
  if (!settings.name) return;
  drawerVisible.value = false;
}

function openDrawer(direction) {
  drawerDirection.value = direction;
  drawerVisible.value = true;
}
</script>

<style scoped>
.drawer-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.drawer-demo__form,
.drawer-demo__form label {
  display: grid;
  gap: 14px;
}

.drawer-demo__form label {
  gap: 7px;
  color: var(--au-color-text-secondary);
  font-size: 13px;
}

.drawer-demo__form input,
.drawer-demo__form textarea {
  width: 100%;
  padding: 9px 11px;
  border: 1px solid var(--au-color-border-default);
  border-radius: var(--au-radius-control);
  color: var(--au-color-text-primary);
  background: transparent;
  outline: none;
  resize: vertical;
}

.drawer-demo__form input:focus,
.drawer-demo__form textarea:focus {
  border-color: var(--au-color-primary);
}
</style>
