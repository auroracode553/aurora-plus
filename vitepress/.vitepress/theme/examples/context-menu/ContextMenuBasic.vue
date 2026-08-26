<template>
  <div>
    <div class="context-menu-demo" @contextmenu.prevent="openMenu">
      <AuIcon name="menu" size="28" />
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
  registerIcons,
} from 'aurora-ui';

// 示例需要的业务图标由应用显式注册。
registerIcons({
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M8 10h8M8 14h5"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 2 3.1 6.3 6.9 1-5 4.8 1.2 6.9-6.2-3.2L5.8 21 7 14.1 2 9.3l6.9-1Z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/></svg>',
});

const visible = ref(false);
const position = ref({ x: 0, y: 0 });

const menuSections = [
  {
    id: 'quick-actions',
    type: 'icon-row',
    ariaLabel: '快捷操作',
    items: [
      { id: 'copy-link', label: '复制链接', icon: 'copy' },
      { id: 'favorite', label: '收藏项目', icon: 'star' },
    ],
  },
  { id: 'separator-1', type: 'separator' },
  {
    id: 'main-actions',
    type: 'button-group',
    items: [
      { id: 'copy', label: '复制', icon: 'copy', shortcut: 'Ctrl+C' },
      { id: 'favorite-menu', label: '收藏', icon: 'star' },
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
      icon: 'trash',
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
