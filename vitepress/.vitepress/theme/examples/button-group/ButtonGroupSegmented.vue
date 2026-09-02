<template>
  <div class="button-group-segmented-demo">
    <div class="button-group-segmented-demo__heading">
      <strong>透明度</strong>
      <span>{{ selectedOpacity }}%</span>
    </div>
    <AuButtonGroup variant="segmented" aria-label="透明度">
      <AuButtonGroupItem
        v-for="opacity in opacityOptions"
        :key="opacity"
        :aria-pressed="selectedOpacity === opacity"
        @click="selectedOpacity = opacity"
      >
        {{ opacity }}
      </AuButtonGroupItem>
    </AuButtonGroup>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButtonGroup, AuButtonGroupItem } from 'aurora-plus';

const opacityOptions = [50, 60, 70, 80, 90, 100];
const selectedOpacity = ref(100);
</script>

<style scoped>
.button-group-segmented-demo {
  width: min(460px, 100%);
}

.button-group-segmented-demo__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  color: var(--au-color-text-primary);
}

.button-group-segmented-demo__heading span {
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-semibold);
}
</style>
