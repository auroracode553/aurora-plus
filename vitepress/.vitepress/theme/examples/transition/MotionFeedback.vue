<script setup>
import { onBeforeUnmount, ref } from 'vue';
import {
  AuBadge, AuButton, AuCard, AuCheckbox, AuCollapseItem, AuDialog,
  AuDrawer, AuInput, AuMessage, AuProgress, AuSegmented, AuSelect,
  AuSlider, AuSwitch, AuTag, AuTooltip, AuTransitionGroup,
} from 'aurora-plus';

const checked = ref(false);
const enabled = ref(true);
const text = ref('点击或输入，观察状态反馈');
const format = ref('text');
const view = ref('列表');
const percentage = ref(42);
const dialogVisible = ref(false);
const drawerVisible = ref(false);
const saving = ref(false);
const rows = ref([{ id: 1, label: '内容一' }, { id: 2, label: '内容二' }, { id: 3, label: '内容三' }]);
let timer;

function save() {
  if (saving.value) return;
  saving.value = true;
  timer = setTimeout(() => {
    saving.value = false;
    AuMessage.success('操作已完成');
  }, 700);
}
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div class="motion-feedback">
    <div class="motion-feedback__row">
      <AuButton type="primary" :loading="saving" @click="save">保存反馈</AuButton>
      <AuButton @click="dialogVisible = true">打开对话框</AuButton>
      <AuButton @click="drawerVisible = true">打开抽屉</AuButton>
      <AuButton disabled>禁用状态</AuButton>
      <AuTooltip content="浮层使用统一进入和退出节奏">
        <AuBadge :value="rows.length"><AuTag type="primary">悬停提示</AuTag></AuBadge>
      </AuTooltip>
    </div>
    <div class="motion-feedback__row">
      <AuCheckbox v-model="checked">选择内容</AuCheckbox>
      <AuSwitch v-model="enabled" />
      <span>当前{{ enabled ? '开启' : '关闭' }}</span>
      <button class="au-motion-control motion-feedback__native" type="button" @click="checked = !checked">通用 CSS 按压反馈</button>
    </div>
    <div class="motion-feedback__fields">
      <AuInput v-model="text" clearable placeholder="输入内容" />
      <AuSelect v-model="format">
        <option value="text">文本</option>
        <option value="image">图片</option>
        <option value="locked" disabled>不可选</option>
      </AuSelect>
    </div>
    <AuSlider v-model="percentage" show-value />
    <AuProgress :percentage="percentage" />
    <AuSegmented v-model="view" :items="['列表', '网格', '摘要']" fill />
    <AuCollapseItem title="展开内容" summary="高度过渡可以反向中断">
      <p>{{ text }}</p>
    </AuCollapseItem>
    <div class="motion-feedback__row">
      <AuButton size="small" @click="rows = [...rows].reverse()">调整顺序</AuButton>
      <span>悬停卡片可观察轻微抬升</span>
    </div>
    <AuTransitionGroup class="motion-feedback__list">
      <AuCard v-for="row in rows" :key="row.id" padding="compact" hoverable>{{ row.label }}</AuCard>
    </AuTransitionGroup>
    <AuDialog v-model="dialogVisible" title="内容确认" width="360px">
      <AuInput v-model="text" />
      <template #footer><AuButton @click="dialogVisible = false">关闭</AuButton></template>
    </AuDialog>
    <AuDrawer v-model="drawerVisible" title="内容详情" size="320px">
      <p>{{ text }}</p>
      <template #footer><AuButton @click="drawerVisible = false">关闭</AuButton></template>
    </AuDrawer>
  </div>
</template>

<style scoped>
.motion-feedback { display: grid; min-width: 0; width: 100%; gap: 14px; }
.motion-feedback__row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 12px; color: var(--au-color-text-secondary); }
.motion-feedback__fields { display: grid; min-width: 0; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 8px; }
.motion-feedback__list { display: grid; gap: 6px; }
.motion-feedback__native { height: 28px; padding: 0 9px; border: 1px solid var(--au-material-border); border-radius: var(--au-radius-compact); color: var(--au-color-text-default); background: transparent; font: inherit; cursor: pointer; }
.motion-feedback__native:hover { color: var(--au-color-primary); border-color: var(--au-color-primary); }
.motion-feedback p { margin: 0; font-size: 13px; line-height: 1.5; }
@media (max-width: 440px) { .motion-feedback__fields { grid-template-columns: minmax(0, 1fr); } }
</style>
