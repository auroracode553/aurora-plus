<template>
  <section class="au-doc-demo">
    <header v-if="title || description" class="au-doc-demo__header">
      <div>
        <strong v-if="title">{{ title }}</strong>
        <p v-if="description">{{ description }}</p>
      </div>
    </header>

    <div class="au-doc-demo__preview">
      <slot></slot>
    </div>

    <div v-if="normalizedSource" class="au-doc-demo__source">
      <div class="au-doc-demo__source-actions">
        <span class="au-doc-demo__language">{{ language }}</span>
        <div class="au-doc-demo__source-actions-right">
          <button
            type="button"
            class="au-doc-demo__icon-action"
            :aria-label="copied ? '已复制代码' : '复制代码'"
            :title="copied ? '已复制' : '复制代码'"
            @click="copySource"
          >
            <AuIcon name="copy" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="au-doc-demo__icon-action"
            :aria-label="expanded ? '隐藏源代码' : '显示源代码'"
            :title="expanded ? '隐藏源代码' : '显示源代码'"
            :aria-expanded="expanded"
            :aria-controls="sourceId"
            @click="expanded = !expanded"
          >
            <AuIcon name="code" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div v-show="expanded" :id="sourceId" class="au-doc-demo__code-wrap">
        <!-- highlightedSource 仅来自构建阶段对仓库内示例源码的 Shiki 转换。 -->
        <div
          v-if="highlightedSource"
          class="au-doc-demo__highlighted"
          v-html="highlightedSource"
        ></div>
        <pre v-else class="au-doc-demo__code"><code>{{ normalizedSource }}</code></pre>
      </div>

      <button
        v-if="expanded"
        type="button"
        class="au-doc-demo__toggle"
        :aria-expanded="expanded"
        :aria-controls="sourceId"
        @click="expanded = false"
      >
        <span aria-hidden="true">⌃</span>
        隐藏源代码
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { AuIcon, AuMessage } from 'aurora-ui';

let demoSeed = 0;

const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  source: { type: [String, Object], default: '' },
  language: { type: String, default: 'vue' },
  defaultExpanded: { type: Boolean, default: false },
});

const expanded = ref(props.defaultExpanded);
const copied = ref(false);
const sourceId = `au-doc-demo-source-${++demoSeed}`;
const normalizedSource = computed(() => {
  const source = typeof props.source === 'string' ? props.source : props.source?.source;
  return String(source || '').trim();
});
const highlightedSource = computed(() => {
  if (!props.source || typeof props.source === 'string') return '';
  return String(props.source.highlighted || '');
});

let copiedTimer = null;

async function copySource() {
  if (!normalizedSource.value) return;

  try {
    await writeToClipboard(normalizedSource.value);
    copied.value = true;
    AuMessage.success('代码已复制');
    clearTimeout(copiedTimer);
    copiedTimer = globalThis.setTimeout(() => {
      copied.value = false;
    }, 1600);
  } catch {
    copied.value = false;
    AuMessage.error('复制失败，请手动复制');
  }
}

async function writeToClipboard(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === 'undefined') throw new Error('Clipboard API is unavailable.');
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  let copiedSuccessfully = false;
  try {
    copiedSuccessfully = document.execCommand('copy');
  } finally {
    textarea.remove();
  }
  if (!copiedSuccessfully) throw new Error('Copy command failed.');
}

onBeforeUnmount(() => clearTimeout(copiedTimer));
</script>
