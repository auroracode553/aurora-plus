<template>
  <DemoBlock title="配置式菜单" description="在下方区域点击右键，危险操作会先进入注入的确认逻辑">
    <div class="context-menu-demo" @contextmenu.prevent="openMenu">
      <AuIcon name="menu" size="28" />
      <strong>在这里点击右键</strong>
      <span>菜单会自动限制在浏览器视口范围内</span>
    </div>
    <AuContextMenu
      v-model="visible"
      :items="sections"
      :position="position"
      :before-select="beforeSelect"
      @select="handleSelect"
    />
  </DemoBlock>
</template>

<script setup>
import { ref } from 'vue';
import { AuContextMenu, AuIcon, AuMessage, AuMessageBox } from 'aurora-ui';
import DemoBlock from './DemoBlock.vue';

const visible = ref(false);
const position = ref({ x: 0, y: 0 });

const sections = [
  {
    type: 'button-group',
    items: [
      { id: 'copy', label: '复制', icon: 'copy', shortcut: 'Ctrl+C' },
      { id: 'favorite', label: '收藏', icon: 'star' },
    ],
  },
  { type: 'separator' },
  {
    type: 'submenu',
    id: 'more',
    label: '更多操作',
    items: [
      { id: 'rename', label: '重命名' },
      { id: 'disabled', label: '不可用操作', disabled: true },
    ],
  },
  { type: 'separator' },
  {
    type: 'button',
    item: { id: 'delete', label: '删除', icon: 'trash', danger: true, confirmMessage: '确定删除这个示例项目吗？' },
  },
];

function openMenu(event) {
  position.value = { x: event.clientX, y: event.clientY };
  visible.value = true;
}

async function beforeSelect(item) {
  if (!item.confirmMessage) return true;
  return AuMessageBox.confirm({ title: '危险操作', message: item.confirmMessage, confirmButtonType: 'danger' });
}

function handleSelect(item) {
  AuMessage.success(`已执行：${item.label}`);
}
</script>

<style scoped>
.context-menu-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 210px;
  border: 1px dashed var(--au-color-border);
  border-radius: 12px;
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
  font-size: 12px;
}
</style>
