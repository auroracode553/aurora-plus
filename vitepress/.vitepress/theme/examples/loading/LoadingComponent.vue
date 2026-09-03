<template>
  <div class="loading-component-demo">
    <div class="au-doc-row">
      <AuButton type="primary" @click="loading = !loading">
        {{ loading ? '隐藏容器加载层' : '显示容器加载层' }}
      </AuButton>
    </div>

    <AuLoading :loading="loading" text="正在载入项目…">
      <section class="loading-component-demo__content" aria-label="最近项目">
        <div v-for="project in projects" :key="project.name" class="loading-component-demo__row">
          <span>{{ project.name }}</span>
          <span>{{ project.updatedAt }}</span>
        </div>
      </section>
    </AuLoading>

    <div class="loading-component-demo__spinners" aria-label="加载图标尺寸">
      <AuLoadingSpinner size="small" text="小型" />
      <AuLoadingSpinner text="默认" />
      <AuLoadingSpinner size="large" text="大型" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuLoading, AuLoadingSpinner } from 'aurora-plus';

const loading = ref(true);
const projects = [
  { name: 'Aurora Editor', updatedAt: '刚刚更新' },
  { name: 'Design Tokens', updatedAt: '5 分钟前' },
  { name: 'Component Lab', updatedAt: '昨天' },
];
</script>

<style scoped>
.loading-component-demo {
  display: grid;
  gap: 14px;
}

.loading-component-demo__content {
  min-height: 156px;
  border: 1px solid var(--au-color-border-subtle);
  border-radius: var(--au-radius-surface);
  overflow: hidden;
}

.loading-component-demo__row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--au-color-border-muted);
  color: var(--au-color-text-default);
}

.loading-component-demo__row:last-child {
  border-bottom: 0;
}

.loading-component-demo__row span:last-child {
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.loading-component-demo__spinners {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
  padding: 12px 0;
}
</style>
