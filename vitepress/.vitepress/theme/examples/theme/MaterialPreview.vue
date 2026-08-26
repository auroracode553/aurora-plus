<template>
  <section class="material-preview" :data-au-material="material">
    <div class="material-preview__backdrop" aria-hidden="true">
      <span class="material-preview__swatch is-blue"></span>
      <span class="material-preview__swatch is-lilac"></span>
      <span class="material-preview__swatch is-sand"></span>
    </div>

    <div class="material-preview__toolbar">
      <div>
        <strong>材质预览</strong>
        <span>{{ currentOption.description }}</span>
      </div>

      <div class="material-preview__switch" role="radiogroup" aria-label="选择材质">
        <AuButton
          v-for="option in options"
          :key="option.value"
          size="small"
          :class="{ 'is-active': material === option.value }"
          :aria-checked="material === option.value"
          role="radio"
          @click="material = option.value"
        >
          {{ option.label }}
        </AuButton>
      </div>
    </div>

    <div class="material-preview__stage">
      <AuCard class="material-preview__card">
        <div class="material-preview__card-heading">
          <div>
            <strong>工作台面板</strong>
            <span>同一套组件切换不同材质</span>
          </div>
          <AuButton size="small" type="primary">保存</AuButton>
        </div>

        <div class="material-preview__card-footer">
          <span>按钮组、卡片和文字会同步响应</span>
          <AuButtonGroup variant="floating" icon-only aria-label="面板操作">
            <AuButton icon="minus" aria-label="收起面板" />
            <AuButton icon="panel" aria-label="切换视图" />
            <AuButton icon="code" aria-label="查看源码" />
          </AuButtonGroup>
        </div>
      </AuCard>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { AuButton, AuButtonGroup, AuCard } from 'aurora-ui';

const options = [
  { value: 'soft', label: '柔和', description: '低对比、轻模糊（默认）' },
  { value: 'clear', label: '清透', description: '更透明、背景层次更明显' },
  { value: 'solid', label: '实色', description: '不透明、边界清晰' },
];

const material = ref('soft');
const currentOption = computed(() => options.find((option) => option.value === material.value) || options[0]);
</script>

<style scoped>
.material-preview {
  position: relative;
  min-height: 246px;
  padding: 16px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: #cbd4df;
  isolation: isolate;
}

.material-preview__backdrop {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 12px;
  padding: 14px;
  pointer-events: none;
}

.material-preview__swatch {
  display: block;
  min-height: 94px;
  border-radius: 10px;
}

.material-preview__swatch.is-blue {
  background: #829bbd;
}

.material-preview__swatch.is-lilac {
  background: #a69ab8;
}

.material-preview__swatch.is-sand {
  grid-column: 1 / -1;
  min-height: 62px;
  background: #b6a383;
}

.material-preview__toolbar,
.material-preview__stage {
  position: relative;
  z-index: 1;
}

.material-preview__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.material-preview__toolbar > div:first-child {
  display: grid;
  gap: 2px;
}

.material-preview__toolbar strong {
  color: #1f2937;
  font-size: 14px;
}

.material-preview__toolbar span,
.material-preview__card-heading span,
.material-preview__card-footer > span {
  color: #39485b;
  font-size: 12px;
}

.material-preview__switch {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  border: 1px solid rgba(31, 41, 55, 0.24);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.34);
}

.material-preview__switch :deep(.au-button) {
  height: 26px;
  padding: 4px 8px;
  border: 0;
  border-radius: 5px;
  color: #334155;
  background: transparent;
  box-shadow: none;
  font-size: 12px;
  transform: none;
}

.material-preview__switch :deep(.au-button:hover:not(.is-disabled)),
.material-preview__switch :deep(.au-button:active:not(.is-disabled)) {
  color: #162033;
  background: rgba(255, 255, 255, 0.52);
  box-shadow: none;
  transform: none;
}

.material-preview__switch :deep(.au-button.is-active) {
  color: #162033;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: none;
}

.material-preview__switch :deep(.au-button:focus-visible) {
  outline: 2px solid #3478f6;
  outline-offset: -1px;
}

.material-preview__stage {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.material-preview__card {
  width: min(100%, 420px);
  padding: 16px;
}

.material-preview__card-heading,
.material-preview__card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.material-preview__card-heading > div {
  display: grid;
  gap: 2px;
}

.material-preview__card-heading strong {
  color: var(--au-color-text-primary);
  font-size: 15px;
}

.material-preview__card-footer {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--au-material-border-strong);
}

@media (max-width: 640px) {
  .material-preview {
    padding: 12px;
  }

  .material-preview__toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .material-preview__stage {
    margin-top: 12px;
  }
}
</style>
