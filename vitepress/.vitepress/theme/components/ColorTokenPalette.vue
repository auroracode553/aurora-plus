<template>
  <div class="color-token-palette">
    <section
      v-for="group in colorGroups"
      :key="group.id"
      class="color-token-palette__group"
      :aria-labelledby="`color-token-group-${group.id}`"
    >
      <header class="color-token-palette__heading">
        <h2 :id="`color-token-group-${group.id}`">{{ group.title }}</h2>
        <p>{{ group.description }}</p>
      </header>

      <ul class="color-token-palette__grid">
        <li v-for="token in group.tokens" :key="token.name" class="color-token-palette__item">
          <span class="color-token-palette__swatch" aria-hidden="true">
            <span :style="{ backgroundColor: `var(${token.name})` }"></span>
          </span>

          <span class="color-token-palette__content">
            <strong>{{ token.label }}</strong>
            <code>{{ token.name }}</code>
            <small>{{ token.description }}</small>
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
const colorGroups = [
  {
    id: 'semantic',
    title: '品牌与状态',
    description: '表达主要操作以及成功、警告、危险和信息状态。',
    tokens: [
      { name: '--au-color-primary', label: 'Primary 主色', description: '主要操作、选中状态与焦点反馈' },
      { name: '--au-color-success', label: 'Success 成功', description: '成功、完成与正常状态' },
      { name: '--au-color-warning', label: 'Warning 警告', description: '需要注意或等待处理的状态' },
      { name: '--au-color-danger', label: 'Danger 危险', description: '错误、删除与高风险操作' },
      { name: '--au-color-info', label: 'Info 信息', description: '中性信息与辅助状态' },
    ],
  },
  {
    id: 'text',
    title: '文字层级',
    description: '用稳定的语义层级组织标题、正文、说明和不可用信息。',
    tokens: [
      { name: '--au-color-text-primary', label: 'Primary 主要文字', description: '标题与需要强调的正文' },
      { name: '--au-color-text-regular', label: 'Regular 常规文字', description: '默认正文与控件文字' },
      { name: '--au-color-text-secondary', label: 'Secondary 次要文字', description: '说明、辅助状态与次级信息' },
      { name: '--au-color-text-placeholder', label: 'Placeholder 占位文字', description: '输入提示和弱提示信息' },
      { name: '--au-color-text-disabled', label: 'Disabled 禁用文字', description: '不可操作或不可用状态' },
    ],
  },
  {
    id: 'surface',
    title: '背景与遮罩',
    description: '用于页面自有内容的弱背景、浮层底色、悬停反馈和模态遮罩。',
    tokens: [
      { name: '--au-color-bg-soft', label: 'Soft 柔和背景', description: '弱分区与低对比内容背景' },
      { name: '--au-color-bg-overlay', label: 'Overlay 浮层背景', description: '不透明浮层和高对比表面' },
      { name: '--au-color-bg-hover', label: 'Hover 悬停背景', description: '轻量悬停与选择反馈' },
      { name: '--au-color-mask', label: 'Mask 遮罩', description: '需要遮罩语义时的透明颜色' },
    ],
  },
  {
    id: 'border',
    title: '边框层级',
    description: '按信息层级选择常规、轻量和更轻量的分隔颜色。',
    tokens: [
      { name: '--au-color-border', label: 'Border 常规边框', description: '需要明确轮廓的边界' },
      { name: '--au-color-border-light', label: 'Border Light 轻边框', description: '控件与内容区域的柔和边界' },
      { name: '--au-color-border-lighter', label: 'Border Lighter 更轻边框', description: '列表分隔与低对比轮廓' },
    ],
  },
];
</script>

<style scoped>
.color-token-palette {
  display: grid;
  margin: 24px 0 32px;
  gap: 30px;
}

.color-token-palette__group {
  scroll-margin-top: 96px;
}

.color-token-palette__heading h2 {
  margin: 0;
  border: 0;
  color: var(--au-color-text-primary);
  font-size: var(--au-font-size-large);
  font-weight: var(--au-font-weight-semibold);
}

.color-token-palette__heading p {
  margin: 5px 0 0;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
  line-height: 1.6;
}

.color-token-palette__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 14px 0 0;
  padding: 0;
  gap: 10px;
  list-style: none;
}

.color-token-palette__item {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  align-items: stretch;
  min-width: 0;
  min-height: 86px;
  padding: 10px;
  border: 1px solid var(--au-color-border-lighter);
  border-radius: var(--au-radius-control);
  background: transparent;
  gap: 12px;
}

.color-token-palette__swatch {
  position: relative;
  display: block;
  min-height: 64px;
  overflow: hidden;
  border: 1px solid var(--au-color-border-light);
  border-radius: var(--au-radius-small);
  background: var(--au-color-bg-soft);
}

.color-token-palette__swatch > span {
  position: absolute;
  inset: 0;
}

.color-token-palette__content {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
}

.color-token-palette__content strong {
  color: var(--au-color-text-primary);
  font-size: var(--au-font-size-base);
  font-weight: var(--au-font-weight-medium);
  line-height: 1.4;
}

.color-token-palette__content code {
  display: block;
  margin-top: 2px;
  padding: 0;
  color: var(--au-color-primary);
  background: transparent;
  font-size: 11px;
  overflow-wrap: anywhere;
}

.color-token-palette__content small {
  margin-top: 4px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
  line-height: 1.45;
}

@media (max-width: 720px) {
  .color-token-palette__grid {
    grid-template-columns: 1fr;
  }
}
</style>
