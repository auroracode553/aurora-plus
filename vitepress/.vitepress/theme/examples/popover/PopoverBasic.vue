<template>
  <div class="popover-demo">
    <AuPopover
      v-model="visible"
      placement="bottom-end"
      :surface="false"
      aria-label="快速设置"
    >
      <template #trigger="{ triggerProps }">
        <AuButton v-bind="triggerProps" :icon="IconAdjustmentsHorizontal">应用控制</AuButton>
      </template>

      <template #default="{ close }">
        <AuPanel width="320px" depth="overlay" aria-label="快速设置">
          <template #header>
            <div class="popover-demo__heading">
              <strong>快速设置</strong>
              <span>常用的显示与启动选项</span>
            </div>
          </template>

          <AuMenuList :elevated="false" aria-label="快速设置菜单">
            <AuMenuListItem
              title="启动时最小化"
              description="应用启动后保持在后台"
              :leading-icon="IconWindowMinimize"
              leading-variant="tinted"
            >
              <template #trailing>
                <AuSwitch v-model="startMinimized" aria-label="启动时最小化" />
              </template>
            </AuMenuListItem>
            <AuMenuListItem
              title="打开完整设置"
              :leading-icon="IconSettings"
              leading-variant="tinted"
              accessory="chevron"
              clickable
              @click="selectSettings(close)"
            />
          </AuMenuList>
        </AuPanel>
      </template>
    </AuPopover>

    <span class="popover-demo__state">{{ result }}</span>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import {
  AuButton,
  AuMenuList,
  AuMenuListItem,
  AuPanel,
  AuPopover,
  AuSwitch,
} from 'aurora-plus';
import {
  IconAdjustmentsHorizontal,
  IconSettings,
  IconWindowMinimize,
} from 'aurora-plus/icons';

const visible = ref(false);
const startMinimized = ref(false);
const selectedSettings = ref(false);
const result = computed(() => {
  if (selectedSettings.value) return '已选择：打开完整设置';
  return startMinimized.value ? '启动时最小化：开启' : '启动时最小化：关闭';
});

function selectSettings(close) {
  selectedSettings.value = true;
  close('select', true);
}
</script>

<style scoped>
.popover-demo {
  display: flex;
  min-height: 360px;
  align-items: flex-start;
  gap: 12px;
}

.popover-demo__heading {
  display: grid;
  gap: 3px;
}

.popover-demo__heading strong {
  font-size: var(--au-font-size-large);
  font-weight: var(--au-font-weight-semibold);
}

.popover-demo__heading span,
.popover-demo__state {
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.popover-demo__state {
  padding-top: 8px;
}
</style>
