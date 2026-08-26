<template>
  <div class="checkbox-demo">
    <AuCheckbox v-model="accepted">我已阅读并同意服务条款</AuCheckbox>

    <AuCheckbox
      :model-value="allSelected"
      :indeterminate="partiallySelected"
      @update:model-value="toggleAll"
    >
      全选项目
    </AuCheckbox>

    <div class="checkbox-demo__options">
      <AuCheckbox
        v-for="option in options"
        :key="option.value"
        v-model="selected"
        :value="option.value"
      >
        {{ option.label }}
      </AuCheckbox>
    </div>

    <p class="checkbox-demo__result">已选择：{{ selectedLabels || '暂无' }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { AuCheckbox } from 'aurora-ui';

const accepted = ref(false);
const options = [
  { value: 'design', label: '设计' },
  { value: 'frontend', label: '前端' },
  { value: 'qa', label: '质量' },
];
const selected = ref(['design']);
const allSelected = computed(() => selected.value.length === options.length);
const partiallySelected = computed(() => selected.value.length > 0 && !allSelected.value);
const selectedLabels = computed(() => options.filter((option) => selected.value.includes(option.value)).map((option) => option.label).join('、'));

function toggleAll(checked) {
  selected.value = checked ? options.map((option) => option.value) : [];
}
</script>

<style scoped>
.checkbox-demo {
  display: grid;
  gap: 12px;
}

.checkbox-demo__options {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding-left: 25px;
}

.checkbox-demo__result {
  margin: 2px 0 0;
  color: var(--au-color-text-secondary);
  font-size: 13px;
}
</style>
