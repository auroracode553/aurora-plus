<template>
  <div>
    <div class="context-menu-demo" @contextmenu.prevent="openMenu">
      <AuIcon :icon="IconMenu2" :size="28" />
      <strong>在这里点击右键</strong>
      <span>菜单坐标来自鼠标事件，并自动限制在浏览器视口内</span>
    </div>

    <AuContextMenu
      v-model="visible"
      :items="menuSections"
      :position="position"
      :before-select="beforeSelect"
      @select="handleSelect"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  AuContextMenu,
  AuIcon,
  AuMessage,
  AuMessageBox,
  IconCopy,
  IconMenu2,
  IconStar,
  IconTrash,
} from 'aurora-ui';

const visible = ref(false);
const position = ref({ x: 0, y: 0 });

const menuSections = [
  {
    id: 'quick-actions',
    type: 'icon-row',
    ariaLabel: '快捷操作',
    items: [
      { id: 'copy-link', label: '复制链接', icon: IconCopy },
      { id: 'favorite', label: '收藏项目', icon: IconStar },
    ],
  },
  { id: 'separator-1', type: 'separator' },
  {
    id: 'main-actions',
    type: 'button-group',
    items: [
      { id: 'copy', label: '复制', icon: IconCopy, shortcut: 'Ctrl+C' },
      { id: 'favorite-menu', label: '收藏', icon: IconStar },
    ],
  },
  {
    id: 'more',
    type: 'submenu',
    label: '更多操作',
    items: [
      { id: 'rename', label: '重命名' },
      { id: 'archive', label: '归档项目' },
      { id: 'submenu-separator', kind: 'separator' },
      { id: 'disabled', label: '不可用操作', disabled: true },
    ],
  },
  { id: 'separator-2', type: 'separator' },
  {
    id: 'delete-section',
    type: 'button',
    item: {
      id: 'delete',
      label: '删除',
      icon: IconTrash,
      danger: true,
      confirmMessage: '确定删除这个示例项目吗？',
    },
  },
];

function openMenu(event) {
  position.value = { x: event.clientX, y: event.clientY };
  visible.value = true;
}

async function beforeSelect(item) {
  if (!item.confirmMessage) return true;
  return AuMessageBox.confirm({
    title: '危险操作',
    message: item.confirmMessage,
    confirmButtonType: 'danger',
  });
}

function handleSelect(item) {
  AuMessage.success(`已执行：${item.label}`);
}

function handleCancel(item) {
  AuMessage.info(`已取消：${item.label}`);
}
</script>

<style scoped>
.context-menu-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  border: 1px dashed var(--au-color-border);
  border-radius: 10px;
  color: var(--au-color-text-secondary);
  background: var(--au-color-bg-soft);
  flex-direction: column;
  gap: 9px;
  user-select: none;
}

.context-menu-demo strong {
  color: var(--au-color-text-primary);
  font-size: 15px;
}

.context-menu-demo span {
  color: var(--au-color-text-secondary);
  font-size: 12px;
}
</style>
