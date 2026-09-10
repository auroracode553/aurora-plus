<template>
  <div class="skeleton-template-demo">
    <div class="au-doc-row">
      <AuButton :aria-pressed="loading" @click="loading = !loading">{{ loading ? '显示内容' : '显示骨架屏' }}</AuButton>
    </div>
    <AuSkeleton :loading="loading" :count="members.length" animated>
      <template #template="{ index }">
        <div class="skeleton-template-demo__row">
          <AuSkeletonItem variant="circle" :width="32" :height="32" />
          <div class="skeleton-template-demo__details">
            <AuSkeletonItem :width="index === 0 ? '42%' : '55%'" />
            <AuSkeletonItem variant="caption" width="76%" />
          </div>
        </div>
      </template>
      <template #default>
        <div class="skeleton-template-demo__list">
          <div v-for="member in members" :key="member.name" class="skeleton-template-demo__row">
            <span class="skeleton-template-demo__avatar" aria-hidden="true">{{ member.name.slice(0, 1) }}</span>
            <div class="skeleton-template-demo__details">
              <span class="skeleton-template-demo__name">{{ member.name }}</span>
              <span class="skeleton-template-demo__description">{{ member.description }}</span>
            </div>
          </div>
        </div>
      </template>
    </AuSkeleton>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuSkeleton, AuSkeletonItem } from 'aurora-plus';

const loading = ref(true);
const members = [
  { name: '林晓', description: '负责组件交互设计' },
  { name: '陈远', description: '负责主题与无障碍体验' },
  { name: '苏宁', description: '负责使用指南与示例' },
];
</script>

<style scoped>
.skeleton-template-demo { display: grid; gap: 16px; width: 100%; }
.skeleton-template-demo__list { display: grid; gap: 16px; }
.skeleton-template-demo__row { display: flex; align-items: center; gap: 12px; min-height: 34px; }
.skeleton-template-demo__details { display: grid; gap: 8px; flex: 1; min-width: 0; }
.skeleton-template-demo__avatar { display: grid; place-items: center; width: 32px; height: 32px; flex-shrink: 0; border: 1px solid var(--au-color-border-default); border-radius: 50%; font-size: 14px; }
.skeleton-template-demo__name { font-size: 14px; line-height: 14px; }
.skeleton-template-demo__description { font-size: 12px; line-height: 12px; color: var(--au-color-text-secondary); }
</style>
