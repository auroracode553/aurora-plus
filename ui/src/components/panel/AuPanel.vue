<template>
  <component
    :is="tag"
    class="au-panel au-component au-material-surface"
    :class="[
      `has-${padding}-padding`,
      {
        'has-border': bordered,
        'au-surface-frame': bordered,
        'is-scrollable': scrollable,
        'au-depth-surface': depth === 'surface',
        'au-depth-overlay': depth === 'overlay',
      },
    ]"
    :style="panelStyle"
    :role="role || undefined"
    :aria-label="ariaLabel || undefined"
    :aria-labelledby="ariaLabelledby || undefined"
    :aria-describedby="ariaDescribedby || undefined"
    v-bind="$attrs"
  >
    <div v-if="$slots.header" class="au-panel__header"><slot name="header"></slot></div>
    <div
      class="au-panel__body"
      :class="{ 'au-scroll-region': scrollable, 'au-thin-scrollbar': scrollable }"
    ><slot></slot></div>
    <div v-if="$slots.footer" class="au-panel__footer"><slot name="footer"></slot></div>
  </component>
</template>

<script setup>
import { computed } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  tag: { type: [String, Object, Function], default: 'section' },
  padding: {
    type: String,
    default: 'default',
    validator: (value) => ['none', 'compact', 'default', 'comfortable'].includes(value),
  },
  depth: {
    type: String,
    default: 'surface',
    validator: (value) => ['none', 'surface', 'overlay'].includes(value),
  },
  bordered: { type: Boolean, default: true },
  scrollable: { type: Boolean, default: false },
  width: { type: [String, Number], default: '' },
  maxHeight: { type: [String, Number], default: '' },
  role: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  ariaLabelledby: { type: String, default: '' },
  ariaDescribedby: { type: String, default: '' },
});

const panelStyle = computed(() => ({
  width: formatSize(props.width),
  maxHeight: formatSize(props.maxHeight),
}));

function formatSize(value) {
  if (value === '' || value == null) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}
</script>

<style scoped lang="scss">
.au-panel {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--au-radius-overlay);
  color: var(--au-color-text-primary);
}

.au-panel__header,
.au-panel__body,
.au-panel__footer {
  min-width: 0;
}

.au-panel.has-compact-padding {
  padding: 12px;
  gap: 12px;
}

.au-panel.has-default-padding {
  padding: 16px;
  gap: 16px;
}

.au-panel.has-comfortable-padding {
  padding: 20px;
  gap: 20px;
}

.au-panel.has-none-padding {
  gap: 0;
}

@media (forced-colors: active) {
  .au-panel {
    background: Canvas;
  }
}
</style>
