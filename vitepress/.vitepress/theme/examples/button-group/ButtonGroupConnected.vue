<template>
  <div class="button-group-connected-demo">
    <AuButtonGroup variant="connected" aria-label="内容对齐">
      <AuButton
        v-for="alignment in alignments"
        :key="alignment"
        @click="selectAlignment(alignment)"
      >
        {{ alignment }}
      </AuButton>
    </AuButtonGroup>

    <p class="button-group-connected-demo__result">
      当前对齐：{{ selectedAlignment || '未选择' }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuButton, AuButtonGroup } from 'aurora-ui';

const alignments = ['左对齐', '居中', '右对齐'];
const selectedAlignment = ref('');

function selectAlignment(alignment) {
  selectedAlignment.value = alignment;
}
</script>

<style scoped>
.button-group-connected-demo__result {
  margin: 16px 0 0;
  color: var(--au-color-text-secondary);
  font-size: 13px;
}
</style>
