<template>
  <div class="tree-demo">
    <div class="tree-demo__controls">
      <AuSwitch
        v-model="collapsible"
        active-text="开启折叠"
        inactive-text="关闭折叠"
        aria-label="切换树形导航折叠模式"
      />
    </div>
    <AuTree
      class="tree-demo__tree"
      :items="visibleItems"
      :selected-key="selectedKey"
      item-key="id"
      label-key="title"
      :collapsible="collapsible"
      aria-label="文档目录"
      @select="selectedKey = $event.id"
      @toggle="toggleItem"
    />
    <p class="tree-demo__result">当前选择：{{ selectedItem?.title ?? '未选择' }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { AuSwitch, AuTree } from 'aurora-ui';

const selectedKey = ref('introduction');
const collapsedKeys = ref(new Set());
const collapsible = ref(true);

const treeItems = [
  {
    id: 'getting-started',
    title: '开始使用',
    children: [
      { id: 'introduction', title: '介绍' },
      { id: 'installation', title: '安装' },
      { id: 'quick-start', title: '快速开始' },
    ],
  },
  {
    id: 'components',
    title: '组件',
    children: [
      { id: 'button', title: 'Button 按钮' },
      {
        id: 'navigation',
        title: '导航组件',
        children: [
          { id: 'tree', title: 'Tree 树形导航' },
          { id: 'virtual-list', title: 'VirtualList 虚拟列表' },
        ],
      },
    ],
  },
  { id: 'changelog', title: '更新日志' },
];

const visibleItems = computed(() => flattenVisibleItems(treeItems));
const selectedItem = computed(() =>
  visibleItems.value.find((item) => item.id === selectedKey.value)
);

function flattenVisibleItems(items, displayDepth = 0) {
  return items.flatMap((item) => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;
    const isCollapsed = collapsible.value && collapsedKeys.value.has(item.id);
    const row = {
      id: item.id,
      title: item.title,
      displayDepth,
      hasChildren,
      isCollapsed,
    };

    if (!hasChildren || isCollapsed) return [row];
    return [row, ...flattenVisibleItems(item.children, displayDepth + 1)];
  });
}

function toggleItem(item) {
  const nextCollapsedKeys = new Set(collapsedKeys.value);
  if (nextCollapsedKeys.has(item.id)) {
    nextCollapsedKeys.delete(item.id);
  } else {
    nextCollapsedKeys.add(item.id);
  }
  collapsedKeys.value = nextCollapsedKeys;
}
</script>

<style scoped>
.tree-demo__controls {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.tree-demo__tree {
  height: 252px;
  border: 1px solid var(--au-color-border-lighter);
  border-radius: 8px;
}

.tree-demo__result {
  margin: 10px 0 0;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}
</style>
