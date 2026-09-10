<template>
  <a
    class="au-link au-component au-inline-center au-disabled-text"
    :class="linkClasses"
    v-bind="$attrs"
    :href="disabled || !href ? undefined : href"
    :target="disabled || !href ? undefined : target"
    @click="handleClick"
  >
    <slot name="icon">
      <AuIcon v-if="icon" class="au-link__icon" :icon="icon" />
    </slot>
    <span v-if="$slots.default" class="au-link__inner au-wrap-anywhere"><slot></slot></span>
  </a>
</template>

<script setup>
import { computed } from 'vue';
import { AuIcon } from '../icon/index.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(value),
  },
  underline: {
    type: String,
    default: 'hover',
    validator: (value) => ['always', 'hover', 'never'].includes(value),
  },
  disabled: { type: Boolean, default: false },
  href: { type: String, default: '' },
  target: {
    type: String,
    default: '_self',
  },
  /** Tabler Icons Vue 组件，传入组件本身而不是字符串名称。 */
  icon: { type: [Object, Function], default: null },
});

const emit = defineEmits(['click']);

const linkClasses = computed(() => [
  `au-link--${props.type}`,
  `is-underline-${props.underline}`,
  { 'is-disabled': props.disabled },
]);

function handleClick(event) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }

  emit('click', event);
}
</script>

<style scoped lang="scss" src="./AuLink.scss"></style>
