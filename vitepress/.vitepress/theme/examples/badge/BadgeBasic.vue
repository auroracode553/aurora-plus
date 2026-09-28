<template>
  <div class="badge-demo">
    <div class="badge-demo__row">
      <AuBadge :value="12">
        <AuButton>消息</AuButton>
      </AuBadge>
      <AuBadge :value="120" :max="99" type="primary">
        <AuButton>待办</AuButton>
      </AuBadge>
      <AuBadge value="新" type="success">
        <AuButton>功能</AuButton>
      </AuBadge>
      <AuBadge is-dot type="warning">
        <AuButton>更新</AuButton>
      </AuBadge>
      <AuBadge :value="0" :show-zero="false">
        <AuButton>无未读</AuButton>
      </AuBadge>
    </div>
    <div class="badge-demo__row">
      <AuBadge :value="12">
        <AuButton circle title="消息">消</AuButton>
      </AuBadge>
      <AuBadge :value="120" :max="99" type="primary">
        <AuButton circle title="待办">待</AuButton>
      </AuBadge>
      <AuBadge value="新" type="success">
        <AuButton circle title="功能">功</AuButton>
      </AuBadge>
      <AuBadge is-dot type="warning">
        <AuButton circle title="更新">更</AuButton>
      </AuBadge>
      <AuBadge :value="0" :show-zero="false">
        <AuButton circle title="无未读">无</AuButton>
      </AuBadge>
    </div>
  </div>
</template>

<script setup>
import { AuBadge, AuButton } from 'aurora-plus';
</script>

<style scoped>
.badge-demo {
  display: grid;
  gap: 24px;
  padding: 10px;
}

.badge-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;
}
</style>
