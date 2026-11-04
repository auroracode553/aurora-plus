<script setup>
import { ref } from 'vue';
import { AuInput } from 'aurora-plus';
import { IconSearch } from 'aurora-plus/icons';

const sizes = [
  { value: 'small', label: '小号' },
  { value: 'default', label: '默认' },
  { value: 'large', label: '大号' },
];
const values = ref({ small: '', default: '', large: '' });
</script>

<template>
  <div class="input-sizes-demo">
    <label v-for="size in sizes" :key="size.value" class="input-sizes-demo__field">
      <span>{{ size.label }}</span>
      <AuInput
        v-model="values[size.value]"
        :size="size.value"
        :placeholder="`${size.label}输入框`"
        :prefix-icon="IconSearch"
        clearable
      />
    </label>
  </div>
</template>

<style scoped>
.input-sizes-demo {
  display: grid;
  width: min(100%, 360px);
  gap: 14px;
}

.input-sizes-demo__field {
  display: grid;
  gap: 6px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}
</style>
