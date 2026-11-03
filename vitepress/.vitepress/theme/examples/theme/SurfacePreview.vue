<script setup>
import { ref } from 'vue';
import { AuButton, AuCard, AuDialog, AuDropdown, AuInput, AuMenuBar, AuPopover, AuSelect, AuSlider, AuSwitch } from 'aurora-plus';

const theme = ref('light');
const themeRef = ref(null);
const enabled = ref(true);
const volume = ref(36);
const text = ref('');
const density = ref('default');
const dialog = ref(false);
const commands = [
  { label: '文件', children: [
    { label: '新建文档', command: 'new', accelerator: 'Ctrl+N' },
    { label: '打开文档', command: 'open', accelerator: 'Ctrl+O' },
    { type: 'separator' },
    { label: '保存文档', command: 'save', accelerator: 'Ctrl+S' },
    { label: '导出文档', command: 'export', children: [
      { label: '导出 HTML', command: 'html' },
      { label: '导出 PDF', command: 'pdf' },
    ] },
  ] },
  { label: '编辑', children: [{ label: '撤销', command: 'undo', accelerator: 'Ctrl+Z' }] },
];
const moreActions = [{ label: '复制链接', command: 'copy' }, { label: '另存为', command: 'save-as' }];
</script>

<template>
  <div class="glass-preview">
    <div class="glass-preview__actions">
      <span>清晰的磨砂表面 · 统一交互</span>
      <AuButton size="small" @click="theme = theme === 'light' ? 'dark' : 'light'">{{ theme === 'light' ? '切换深色' : '切换浅色' }}</AuButton>
    </div>
    <div ref="themeRef" class="glass-preview__themed" :data-au-theme="theme">
      <section class="glass-preview__scene">
        <div class="glass-preview__backdrop">
          <i v-for="index in 12" :key="index" :style="{ left: `${(index - 1) / 11 * 100}%`, top: `${((index - 1) % 4 + .5) / 4 * 100}%` }" />
        </div>
        <div class="glass-preview__content">
          <div class="glass-preview__row">
            <AuButton>按住观察反馈</AuButton>
            <AuButton type="primary">主要操作</AuButton>
            <AuButton loading>加载中</AuButton>
            <AuButton disabled>禁用</AuButton>
          </div>
          <section class="glass-preview__reading">
            <AuMenuBar :items="commands" />
            <div class="glass-preview__document">
              <p v-for="index in 5" :key="index">正文第 {{ index }} 行：文件、标题、快捷键和配置说明。展开上方菜单，正文不应干扰菜单中的文字。</p>
            </div>
          </section>
          <AuCard>
            <div class="glass-preview__row"><strong>统一表面，清晰内容</strong><AuSwitch v-model="enabled" active-text="开启" inactive-text="关闭" /></div>
            <AuSlider v-model="volume" show-value />
            <div class="glass-preview__row">
              <AuInput v-model="text" class="glass-preview__input" placeholder="输入内容" clearable />
              <AuSelect v-model="density" :append-to="themeRef || 'body'"><option value="default">默认</option><option value="compact">紧凑</option></AuSelect>
            </div>
            <div class="glass-preview__row"><span>开关支持按住、拖动与反向滑动</span><AuButton @click="dialog = true">打开对话框</AuButton></div>
            <div class="glass-preview__row">
              <AuDropdown :items="moreActions" :append-to="themeRef || 'body'"><template #trigger><AuButton>更多操作</AuButton></template></AuDropdown>
              <AuPopover :append-to="themeRef || 'body'"><template #trigger><AuButton>浮层详情</AuButton></template><p>文字面板与菜单使用同一个公共底面。</p></AuPopover>
            </div>
          </AuCard>
        </div>
      </section>
      <AuDialog v-model="dialog" title="清晰的玻璃表面" :append-to-body="false" width="420px" close-on-overlay>
        <p>面板以高覆盖率底色隔开后方文字，保留轻微磨砂质感。全屏交互层透明。</p>
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
.glass-preview__reading { position: relative; }
.glass-preview__document { padding: 4px 12px; font-size: 13px; line-height: 1.7; }
</style>
