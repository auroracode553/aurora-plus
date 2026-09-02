<template>
  <div class="menu-bar-demo">
    <div class="menu-bar-demo__stage">
      <AuMenuBar :items="items" aria-label="文档应用菜单" @select="handleSelect" />
    </div>
    <p class="menu-bar-demo__result">最近执行：{{ lastAction || '尚未选择命令' }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuMenuBar } from 'aurora-plus';

const lastAction = ref('');
const items = ref([
  {
    label: '文件',
    children: [
      { label: '新建文档', command: 'new', accelerator: 'Ctrl+N' },
      { label: '打开文档', command: 'open', accelerator: 'Ctrl+O' },
      { type: 'separator' },
      { label: '保存', command: 'save', accelerator: 'Ctrl+S' },
    ],
  },
  {
    label: '编辑',
    children: [
      { label: '撤销', command: 'undo', accelerator: 'Ctrl+Z' },
      { label: '重做', command: 'redo', accelerator: 'Ctrl+Y' },
      { type: 'separator' },
      { label: '粘贴为纯文本', command: 'paste-plain', disabled: true },
    ],
  },
  {
    label: '视图',
    children: [
      {
        label: '外观',
        children: [
          { label: '显示行号', command: 'line-numbers', type: 'checkbox', checked: true },
          { label: '专注模式', command: 'focus-mode', type: 'checkbox', checked: false },
        ],
      },
      { label: '实际大小', command: 'actual-size', accelerator: 'Ctrl+0' },
    ],
  },
]);

function handleSelect(item) {
  if (item.type === 'checkbox') item.checked = !item.checked;
  lastAction.value = `${item.label}（${item.command}）`;
}
</script>

<style scoped>
.menu-bar-demo {
  width: 100%;
}

.menu-bar-demo__stage {
  min-height: 190px;
}

.menu-bar-demo__result {
  margin: 12px 8px 0;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}
</style>
