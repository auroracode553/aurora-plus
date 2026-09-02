<template>
  <div class="menu-list-demo">
    <AuMenuList aria-label="视频工具">
      <AuMenuListItem
        v-for="item in menuItems"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        accessory="chevron"
        clickable
        @click="selectedItem = item.title"
      />
    </AuMenuList>
    <p class="menu-list-demo__result">当前选择：{{ selectedItem || '尚未选择' }}</p>

    <AuMenuList aria-label="播放设置">
      <AuMenuListItem title="自动播放" description="打开视频后立即开始播放">
        <template #trailing>
          <AuSwitch v-model="autoplay" aria-label="自动播放" />
        </template>
      </AuMenuListItem>
      <AuMenuListItem title="循环播放" description="播放结束后从头继续">
        <template #trailing>
          <AuSwitch v-model="loopPlayback" aria-label="循环播放" />
        </template>
      </AuMenuListItem>
    </AuMenuList>

    <AuMenuList :divided="false" aria-label="单项操作">
      <AuMenuListItem
        title="清除最近记录"
        description="移除当前设备保存的历史记录"
        :leading-icon="IconTrash"
        leading-variant="tinted"
        tone="danger"
        shortcut="Shift Del"
        clickable
        @click="selectedItem = '清除最近记录'"
      />
    </AuMenuList>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AuMenuList, AuMenuListItem, AuSwitch, IconTrash } from 'aurora-plus';

const selectedItem = ref('');
const autoplay = ref(true);
const loopPlayback = ref(false);
const menuItems = [
  { id: 'trim', title: '视频剪切', description: '截取片段，快速无损导出' },
  { id: 'subtitle', title: '添加字幕', description: '导入 SRT / ASS / SSA 并开关字幕轨' },
  { id: 'watermark', title: '视频去水印', description: '框选区域，强模糊覆盖水印' },
  { id: 'convert', title: '格式转换', description: 'MP4、MKV、MOV 快速转换' },
];
</script>

<style scoped>
.menu-list-demo {
  display: grid;
  width: min(100%, 520px);
  gap: 18px;
}

.menu-list-demo__result {
  margin: -8px 4px 0;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}
</style>
