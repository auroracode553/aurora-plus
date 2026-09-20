<template>
  <div class="rail-demo">
    <div class="rail-demo__box">
      <div class="rail-demo__menu">
        <AuMenu v-model="activeItem" mode="rail">
          <AuMenuGroup spaced />
          <AuMenuItem index="dashboard" label="总览" :icon="IconLayoutDashboard">总览</AuMenuItem>
          <AuMenuItem index="market" label="行情" :icon="IconChartLine">行情</AuMenuItem>
          <AuMenuItem index="watchlist" label="自选" :icon="IconStar" badge="3">自选</AuMenuItem>
          <AuMenuGroup spaced />
          <AuMenuItem index="analysis" label="分析" :icon="IconChartHistogram">分析</AuMenuItem>
          <AuMenuItem index="account" label="账户" :icon="IconUserCircle">账户</AuMenuItem>

          <template #bottom>
            <button type="button" class="rail-demo__action" title="通知">
              <AuIcon :icon="IconBell" :size="20" />
              <span class="rail-demo__dot">5</span>
            </button>
            <button type="button" class="rail-demo__action" title="设置">
              <AuIcon :icon="IconSettings" :size="20" />
            </button>
          </template>
        </AuMenu>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuMenu, AuMenuGroup, AuMenuItem, AuIcon } from 'aurora-plus';
import {
  IconBell,
  IconChartHistogram,
  IconChartLine,
  IconLayoutDashboard,
  IconSettings,
  IconStar,
  IconUserCircle,
} from 'aurora-plus/icons';

const activeItem = ref('dashboard');
</script>

<style scoped>
.rail-demo {
  width: min(100%, 300px);
}

.rail-demo__box {
  box-sizing: border-box;
  width: 100%;
  height: 420px;
  padding: 10px;
  border: 1px solid rgba(105, 123, 154, 0.13);
  border-radius: 12px;
}

.rail-demo__menu {
  height: 100%;
}

.rail-demo__action {
  position: relative;
  display: grid;
  width: 40px;
  height: 38px;
  place-items: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--au-color-text-secondary);
  cursor: pointer;
}

.rail-demo__action:hover {
  background: var(--au-color-background-hover);
  color: var(--au-color-text-primary);
}

.rail-demo__dot {
  position: absolute;
  top: 4px;
  right: 4px;
  display: grid;
  min-width: 16px;
  height: 16px;
  place-items: center;
  border: 2px solid var(--au-color-background-overlay);
  border-radius: 999px;
  background: var(--au-color-danger);
  color: #ffffff;
  font-size: 10px;
  font-weight: var(--au-font-weight-semibold);
  line-height: 1;
}
</style>
