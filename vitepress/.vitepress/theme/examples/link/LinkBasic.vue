<template>
  <div class="link-demo">
    <section>
      <h3>语义类型</h3>
      <div class="au-doc-row">
        <AuLink
          v-for="linkType in linkTypes"
          :key="linkType.type"
          :type="linkType.type"
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ linkType.label }}
        </AuLink>
      </div>
    </section>

    <section>
      <h3>下划线与状态</h3>
      <div class="au-doc-row">
        <AuLink href="https://example.com" underline="always">始终显示</AuLink>
        <AuLink href="https://example.com" underline="hover">悬停显示</AuLink>
        <AuLink href="https://example.com" underline="never">不显示</AuLink>
        <AuLink href="https://example.com" disabled>禁用链接</AuLink>
      </div>
    </section>

    <section>
      <h3>图标</h3>
      <div class="au-doc-row">
        <AuLink
          type="primary"
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          :icon="IconExternalLink"
        >
          打开外部页面
        </AuLink>
        <AuLink type="success" href="https://example.com">
          <template #icon><AuIcon :icon="IconCircleCheck" /></template>
          自定义图标插槽
        </AuLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { AuIcon, AuLink, IconCircleCheck, IconExternalLink } from 'aurora-plus';

const linkTypes = [
  { type: 'default', label: '默认链接' },
  { type: 'primary', label: '主要链接' },
  { type: 'success', label: '成功链接' },
  { type: 'warning', label: '警告链接' },
  { type: 'danger', label: '危险链接' },
  { type: 'info', label: '信息链接' },
];
</script>

<style scoped>
.link-demo {
  display: grid;
  gap: 18px;
}

.link-demo h3 {
  margin: 0 0 10px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-semibold);
}
</style>
