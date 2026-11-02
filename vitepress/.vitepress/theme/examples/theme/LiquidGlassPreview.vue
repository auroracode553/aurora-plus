<script setup>
import { ref } from 'vue';
import { AuButton, AuCard, AuDialog, AuInput, AuSegmented, AuSelect, AuSlider, AuSwitch } from 'aurora-plus';

const theme = ref('light');
const selected = ref('概览');
const enabled = ref(true);
const volume = ref(36);
const text = ref('');
const density = ref('default');
const dialog = ref(false);
</script>

<template>
  <div class="glass-preview">
    <div class="glass-preview__actions">
      <span>玻璃表面 · 弹性反馈</span>
      <AuButton size="small" @click="theme = theme === 'light' ? 'dark' : 'light'">{{ theme === 'light' ? '切换深色' : '切换浅色' }}</AuButton>
    </div>
    <div class="glass-preview__themed" :data-au-theme="theme">
      <section class="glass-preview__scene">
        <div class="glass-preview__backdrop">
          <i v-for="index in 12" :key="index" :style="{ left: `${(index - 1) / 11 * 100}%`, top: `${((index - 1) % 4 + .5) / 4 * 100}%` }" />
        </div>
        <div class="glass-preview__content">
          <div class="glass-preview__row">
            <AuButton>按住观察折射</AuButton>
            <AuButton type="primary">主要操作</AuButton>
            <AuButton loading>加载中</AuButton>
            <AuButton disabled>禁用</AuButton>
          </div>
          <AuSegmented v-model="selected" :items="['概览', '文档', '设置']" fill />
          <AuCard>
            <div class="glass-preview__row"><strong>流动的光，清晰的内容</strong><AuSwitch v-model="enabled" active-text="开启" inactive-text="关闭" /></div>
            <AuSlider v-model="volume" show-value />
            <div class="glass-preview__row">
              <AuInput v-model="text" class="glass-preview__input" placeholder="输入内容" clearable />
              <AuSelect v-model="density"><option value="default">默认</option><option value="compact">紧凑</option></AuSelect>
            </div>
            <div class="glass-preview__row"><span>开关支持按住、拖动与反向滑动</span><AuButton @click="dialog = true">打开对话框</AuButton></div>
          </AuCard>
        </div>
      </section>
      <AuDialog v-model="dialog" title="清晰的玻璃表面" :append-to-body="false" width="420px" close-on-overlay>
        <p>面板采样背后的内容，文字与图标保持清晰。全屏交互层透明。</p>
        <template #footer><AuButton @click="dialog = false">关闭</AuButton></template>
      </AuDialog>
    </div>
  </div>
</template>

<style scoped>
.glass-preview__themed { color: var(--au-color-text-primary); }
.glass-preview__actions, .glass-preview__row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.glass-preview__actions { margin-bottom: 16px; font-size: 13px; }
.glass-preview__scene { position: relative; overflow: hidden; border-radius: 12px; }
.glass-preview__backdrop { position: absolute; inset: 0; overflow: hidden; background: linear-gradient(140deg, color-mix(in srgb,var(--au-color-primary) 11%,var(--au-color-background-subtle)),var(--au-color-background-subtle) 52%,color-mix(in srgb,#9a82d7 11%,var(--au-color-background-subtle))); }
.glass-preview__backdrop i { position: absolute; width: 84px; height: 84px; transform: translate(-50%,-50%); border-radius: 50%; background: color-mix(in srgb,var(--au-color-primary) 30%,transparent); }
.glass-preview__content { position: relative; display: grid; gap: 20px; padding: 24px; }
.glass-preview__input { flex: 1; min-width: 100px; }
.glass-preview__row > span { font-size: 12px; }
</style>
