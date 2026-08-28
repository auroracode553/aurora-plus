<template>
  <div class="textarea-demo">
    <AuTextarea
      v-model="content"
      rows="4"
      maxlength="120"
      show-word-limit
      placeholder="请输入提交说明"
    />

    <div class="textarea-demo__states">
      <AuTextarea model-value="只读内容" size="small" rows="2" readonly resize="none" />
      <AuTextarea
        model-value="需要修正的内容"
        rows="2"
        invalid
        resize="none"
        aria-describedby="textarea-demo-error"
      />
      <AuTextarea model-value="禁用状态" rows="2" disabled resize="none" />
    </div>

    <p id="textarea-demo-error" class="textarea-demo__error">错误示例：内容格式需要修正。</p>
    <p class="textarea-demo__message">当前输入：{{ content || '暂无内容' }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuTextarea } from 'aurora-ui';

const content = ref('这是一段可以继续编辑的说明。');
</script>

<style scoped>
.textarea-demo {
  display: grid;
  width: min(100%, 620px);
  gap: 14px;
}

.textarea-demo__states {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.textarea-demo__message {
  margin: 0;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.textarea-demo__error {
  margin: 0 0 -8px;
  color: var(--au-color-danger);
  font-size: var(--au-font-size-small);
}

@media (max-width: 720px) {
  .textarea-demo__states {
    grid-template-columns: 1fr;
  }
}
</style>
