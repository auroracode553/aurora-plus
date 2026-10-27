<script setup>
import { computed, inject, ref, watch } from 'vue';
import { COLLAPSE_CONTEXT } from './AuCollapse.vue';
import { useCollapseTransition } from './use-collapse-transition.js';

const props = defineProps({
  name: { type: [String, Number], default: undefined },
  modelValue: { type: Boolean, default: undefined },
  defaultOpen: { type: Boolean, default: false },
  title: { type: String, default: '更多信息' },
  summary: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  lazy: { type: Boolean, default: false },
  destroyOnClose: { type: Boolean, default: false },
  fill: { type: Boolean, default: false },
  size: { type: String, default: undefined, validator: (value) => ['small', 'default'].includes(value) },
  variant: { type: String, default: 'panel', validator: (value) => ['panel', 'plain'].includes(value) },
});
const emit = defineEmits(['update:modelValue', 'change']);
const transition = useCollapseTransition(() => props.fill);
const group = inject(COLLAPSE_CONTEXT, null);
const grouped = computed(() => group != null && props.name != null);
const localOpen = ref(props.defaultOpen);
const expanded = computed(() => grouped.value
  ? group.isOpen(props.name)
  : props.modelValue === undefined ? localOpen.value : props.modelValue);
const disabled = computed(() => props.disabled || (grouped.value && group.disabled.value));
const size = computed(() => props.size || (grouped.value ? group.size.value : 'default'));
const visited = ref(false);
// lazy 首次展开才挂载；保留内容与关闭销毁分开，便于页面控制资源生命周期。
watch(expanded, (opened) => { if (opened) visited.value = true; }, { immediate: true, flush: 'sync' });
const renderContent = computed(() => props.destroyOnClose ? expanded.value : !props.lazy || visited.value);

function toggle() {
  if (disabled.value) return;
  const next = !expanded.value;
  if (grouped.value) group.toggle(props.name);
  else {
    if (props.modelValue === undefined) localOpen.value = next;
    emit('update:modelValue', next);
  }
  emit('change', next);
}
</script>

<template>
  <section
    class="au-collapse-item au-component au-motion-state"
    :class="[
      `au-collapse-item--${variant}`, `au-collapse-item--${size}`,
      { 'is-expanded': expanded, 'is-disabled': disabled, 'is-fill': fill },
      variant === 'panel' ? 'au-material-surface au-material-surface--base au-surface-frame' : '',
    ]"
  >
    <div class="au-collapse-item__header">
      <button class="au-collapse-item__trigger" type="button" :disabled="disabled" @click="toggle">
        <slot name="icon" :expanded="expanded" />
        <span class="au-collapse-item__heading">
          <span class="au-collapse-item__title"><slot name="title" :expanded="expanded">{{ title }}</slot></span>
          <span v-if="summary || $slots.summary" class="au-collapse-item__summary"><slot name="summary" :expanded="expanded">{{ summary }}</slot></span>
        </span>
        <svg class="au-collapse-item__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <div v-if="$slots.actions" class="au-collapse-item__actions"><slot name="actions" :expanded="expanded" /></div>
    </div>
    <Transition name="au-motion-collapse" :css="!fill" @before-enter="transition.beforeEnter" @enter="transition.enter" @before-leave="transition.beforeLeave" @leave="transition.leave" @after-enter="transition.restore" @after-leave="transition.restore" @enter-cancelled="transition.cancel" @leave-cancelled="transition.cancel">
      <div v-if="renderContent" v-show="expanded" class="au-collapse-item__content au-motion-collapse">
        <div class="au-collapse-item__body"><slot :expanded="expanded" /></div>
      </div>
    </Transition>
  </section>
</template>

<style scoped lang="scss" src="./AuCollapseItem.scss"></style>
