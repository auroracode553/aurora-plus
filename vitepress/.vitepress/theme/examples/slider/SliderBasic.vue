<template>
  <div class="slider-demo">
    <div class="slider-demo__factor-grid">
      <label v-for="factor in factors" :key="factor.label" class="slider-demo__factor">
        <span class="slider-demo__heading">
          <span>{{ factor.label }}</span>
          <strong>{{ factor.value }}%</strong>
        </span>
        <AuSlider
          v-model="factor.value"
          :min="0"
          :max="100"
          :step="1"
          :aria-label="`${factor.label}权重`"
        />
        <small>拖动调整当前因子权重</small>
      </label>
    </div>

    <label class="slider-demo__temperature">
      <span class="slider-demo__heading">
        <span>分析创造性</span>
        <strong>{{ temperature.toFixed(2) }}</strong>
      </span>
      <AuSlider
        v-model="temperature"
        :min="0"
        :max="1"
        :step="0.05"
        aria-label="分析创造性"
      />
      <span class="slider-demo__range-labels">
        <span>更稳定</span>
        <span>更灵活</span>
      </span>
    </label>

    <div class="slider-demo__states" aria-label="滑块尺寸和状态示例">
      <AuSlider v-model="compactValue" size="small" show-value aria-label="小号滑块" />
      <AuSlider v-model="defaultValue" :format-value="formatPercent" show-value aria-label="默认滑块" />
      <AuSlider :model-value="68" size="large" disabled show-value aria-label="禁用滑块" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { AuSlider } from 'aurora-ui';

const factors = reactive([
  { label: '主力资金', value: 38 },
  { label: '位置风险', value: 12 },
  { label: '情绪周期', value: 16 },
]);
const temperature = ref(0.35);
const compactValue = ref(24);
const defaultValue = ref(48);
const formatPercent = (value) => `${value}%`;
</script>

<style scoped>
.slider-demo {
  display: grid;
  width: 100%;
  gap: 24px;
}

.slider-demo__factor-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(150px, 1fr));
  border: 1px solid var(--au-color-border-lighter);
  border-radius: var(--au-radius-control);
}

.slider-demo__factor {
  display: grid;
  min-width: 0;
  gap: 5px;
  padding: 14px;
}

.slider-demo__factor + .slider-demo__factor {
  border-inline-start: 1px solid var(--au-color-border-lighter);
}

.slider-demo__heading,
.slider-demo__range-labels {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.slider-demo__heading {
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-medium);
}

.slider-demo__heading strong {
  color: var(--au-color-primary);
  font-variant-numeric: tabular-nums;
  font-weight: var(--au-font-weight-semibold);
}

.slider-demo__factor small,
.slider-demo__range-labels {
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.slider-demo__temperature {
  display: grid;
  gap: 3px;
}

.slider-demo__states {
  display: grid;
  width: min(100%, 420px);
  gap: 10px;
}

@media (max-width: 720px) {
  .slider-demo__factor-grid {
    grid-template-columns: 1fr;
  }

  .slider-demo__factor + .slider-demo__factor {
    border-block-start: 1px solid var(--au-color-border-lighter);
    border-inline-start: 0;
  }
}
</style>
