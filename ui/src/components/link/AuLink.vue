<template>
  <a
    class="au-link au-component au-focus-ring"
    :class="linkClasses"
    v-bind="$attrs"
    :href="disabled || !href ? undefined : href"
    :target="disabled || !href ? undefined : target"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="handleClick"
  >
    <slot name="icon">
      <AuIcon v-if="icon" class="au-link__icon" :icon="icon" />
    </slot>
    <span v-if="$slots.default" class="au-link__inner"><slot></slot></span>
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

<style scoped>
.au-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: 100%;
  gap: 4px;
  padding: 0;
  color: var(--au-color-text-default);
  background: transparent;
  font-size: var(--au-font-size-base);
  font-weight: var(--au-font-weight-medium);
  line-height: 1.35;
  text-decoration: none;
  vertical-align: middle;
  white-space: normal;
  cursor: pointer;
  transition: color var(--au-transition-duration) var(--au-transition-timing);
}

.au-link__inner {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  overflow-wrap: anywhere;
  text-decoration-color: currentcolor;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.au-link.is-underline-always .au-link__inner,
.au-link.is-underline-hover:not(.is-disabled):hover .au-link__inner {
  text-decoration-line: underline;
}

.au-link--primary {
  color: var(--au-color-primary);
}

.au-link--success {
  color: var(--au-color-success);
}

.au-link--warning {
  color: var(--au-color-warning);
}

.au-link--danger {
  color: var(--au-color-danger);
}

.au-link--info {
  color: var(--au-color-info);
}

.au-link--default:hover:not(.is-disabled),
.au-link--default:active:not(.is-disabled) {
  color: var(--au-color-primary);
}

.au-link--primary:hover:not(.is-disabled),
.au-link--primary:active:not(.is-disabled) {
  color: color-mix(in srgb, var(--au-color-primary) 76%, var(--au-color-text-primary));
}

.au-link--success:hover:not(.is-disabled),
.au-link--success:active:not(.is-disabled) {
  color: color-mix(in srgb, var(--au-color-success) 76%, var(--au-color-text-primary));
}

.au-link--warning:hover:not(.is-disabled),
.au-link--warning:active:not(.is-disabled) {
  color: color-mix(in srgb, var(--au-color-warning) 76%, var(--au-color-text-primary));
}

.au-link--danger:hover:not(.is-disabled),
.au-link--danger:active:not(.is-disabled) {
  color: color-mix(in srgb, var(--au-color-danger) 76%, var(--au-color-text-primary));
}

.au-link--info:hover:not(.is-disabled),
.au-link--info:active:not(.is-disabled) {
  color: color-mix(in srgb, var(--au-color-info) 76%, var(--au-color-text-primary));
}

.au-link.is-disabled {
  color: var(--au-color-text-disabled);
  cursor: not-allowed;
}

.au-link__icon {
  font-size: 1em;
}

@media (forced-colors: active) {
  .au-link {
    color: LinkText;
  }

  .au-link.is-disabled {
    color: GrayText;
  }

  .au-link:focus-visible {
    outline-color: Highlight;
  }
}
</style>
