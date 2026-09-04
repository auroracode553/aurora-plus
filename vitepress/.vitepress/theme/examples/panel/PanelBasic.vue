<template>
  <AuPanel width="368px" depth="overlay" aria-label="工作区选项">
    <template #header>
      <div class="panel-demo__header">
        <span class="panel-demo__eyebrow">WORKSPACE</span>
        <h3>工作区设置</h3>
        <p>界面、通知与成员偏好</p>
      </div>
    </template>

    <AuMenuList :divided="false" :elevated="false" aria-label="工作区设置菜单">
      <AuMenuListItem
        title="界面偏好"
        description="调整主题与内容密度"
        :leading-icon="IconAdjustmentsHorizontal"
        leading-variant="tinted"
        accessory="chevron"
        clickable
        @click="lastAction = '界面偏好'"
      />
      <AuMenuListItem
        title="成员管理"
        description="查看成员与访问权限"
        :leading-icon="IconUsers"
        leading-variant="tinted"
        accessory="chevron"
        clickable
        @click="lastAction = '成员管理'"
      />
    </AuMenuList>

    <template #footer>
      <span class="panel-demo__result">最近操作：{{ lastAction || '尚未选择' }}</span>
    </template>
  </AuPanel>
</template>

<script setup>
import { ref } from 'vue';
import { AuMenuList, AuMenuListItem, AuPanel } from 'aurora-plus';
import { IconAdjustmentsHorizontal, IconUsers } from 'aurora-plus/icons';

const lastAction = ref('');
</script>

<style scoped>
.panel-demo__header {
  display: grid;
  gap: 5px;
}

.panel-demo__eyebrow {
  color: var(--au-color-primary);
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-semibold);
  letter-spacing: 0.09em;
}

.panel-demo__header h3,
.panel-demo__header p {
  margin: 0;
}

.panel-demo__header h3 {
  margin-top: 10px;
  font-size: 20px;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.panel-demo__header p,
.panel-demo__result {
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}
</style>
