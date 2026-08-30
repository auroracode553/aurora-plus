<template>
  <div class="menu-demo">
    <div class="menu-demo__box">
      <AuMenu v-model="activeItem" class="menu-demo__menu" aria-label="主导航">
        <AuMenuGroup label="分析工作台" />
        <AuMenuItem index="dashboard" label="总览" :icon="IconLayoutDashboard">总览</AuMenuItem>
        <AuMenuItem index="daily-review" label="每日复盘" :icon="IconCalendar">每日复盘</AuMenuItem>
        <AuMenuItem index="auction" label="竞价决策" :icon="IconBolt" badge="LIVE">竞价决策</AuMenuItem>
        <AuMenuItem index="screener" label="AI 选股" :icon="IconSparkles" badge="LIVE">AI 选股</AuMenuItem>
        <AuMenuItem index="strategy" label="策略中心" :icon="IconChartHistogram">策略中心</AuMenuItem>
        <AuMenuItem index="backtest" label="策略回测" :icon="IconChartLine">策略回测</AuMenuItem>

        <AuMenuGroup label="我的工作区" spaced />
        <AuMenuItem index="watchlist" label="自选观察" :icon="IconStar">自选观察</AuMenuItem>
        <AuMenuItem index="risk" label="风控中心" :icon="IconShieldCheck">风控中心</AuMenuItem>
        <AuMenuItem index="ai-settings" label="AI 模型设置" :icon="IconSettings" indicator>AI 模型设置</AuMenuItem>
        <AuMenuItem index="account" label="账户安全" :icon="IconLock">账户安全</AuMenuItem>

        <AuMenuGroup label="系统管理" spaced />
        <AuMenuItem index="admin" label="管理中心" :icon="IconAdjustmentsHorizontal">管理中心</AuMenuItem>
        <AuMenuItem index="content" label="复盘内容管理" :icon="IconCalendarStats">复盘内容管理</AuMenuItem>
      </AuMenu>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  AuMenu,
  AuMenuGroup,
  AuMenuItem,
  IconAdjustmentsHorizontal,
  IconBolt,
  IconCalendar,
  IconCalendarStats,
  IconChartHistogram,
  IconChartLine,
  IconLayoutDashboard,
  IconLock,
  IconShieldCheck,
  IconSparkles,
  IconStar,
  IconSettings,
} from 'aurora-ui';

const activeItem = ref('dashboard');
</script>

<style scoped>
.menu-demo {
  width: min(100%, 300px);
}

.menu-demo__box {
  box-sizing: border-box;
  width: 100%;
  padding: 18px 14px;
  border: 1px solid rgba(105, 123, 154, 0.13);
  border-radius: 12px;
}

.menu-demo__menu {
  width: 100%;
}
</style>
