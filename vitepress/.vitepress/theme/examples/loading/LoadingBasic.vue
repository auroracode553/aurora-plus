<template>
  <div class="loading-basic-demo">
    <div class="au-doc-row">
      <AuButton type="primary" @click="loading = !loading">
        {{ loading ? '结束加载' : '重新加载' }}
      </AuButton>
      <AuButton @click="custom = !custom">
        {{ custom ? '使用默认图标' : '使用自定义 SVG' }}
      </AuButton>
    </div>

    <section
      v-loading="loadingOptions"
      class="loading-basic-demo__region"
      aria-label="同步任务列表"
    >
      <div v-for="task in tasks" :key="task.name" class="loading-basic-demo__row">
        <span>{{ task.name }}</span>
        <span>{{ task.status }}</span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { AuButton } from 'aurora-plus';

const loading = ref(true);
const custom = ref(false);
const customSvg = `
  <path d="M12 3a9 9 0 1 0 9 9" stroke-width="2.2" />
  <path d="M18.4 5.6 21 3v5h-5l2.4-2.4Z" fill="currentColor" stroke="none" />
`;
const loadingOptions = computed(() => ({
  loading: loading.value,
  text: custom.value ? '正在同步更改…' : '加载中…',
  svg: custom.value ? customSvg : '',
  svgViewBox: '0 0 24 24',
  delay: 120,
}));
const tasks = [
  { name: '工作区索引', status: '已完成' },
  { name: '远程分支', status: '同步中' },
  { name: '扩展状态', status: '等待中' },
];
</script>

<style scoped>
.loading-basic-demo {
  display: grid;
  gap: 14px;
}

.loading-basic-demo__region {
  min-height: 168px;
  border: 1px solid var(--au-color-border-subtle);
  border-radius: var(--au-radius-surface);
  overflow: hidden;
}

.loading-basic-demo__row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--au-color-border-muted);
  color: var(--au-color-text-default);
}

.loading-basic-demo__row:last-child {
  border-bottom: 0;
}
</style>
