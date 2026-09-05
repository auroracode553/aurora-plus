<template>
  <li
    class="au-menu-list-item"
    :class="[
      `is-${density}`,
      {
        'has-divider': divided,
        'is-interactive': interactive,
        'is-disabled': disabled,
        'is-selected': selected,
        [`is-tone-${tone}`]: true,
        [`has-leading-${leadingVariant}`]: true,
      },
      $attrs.class,
    ]"
    :style="$attrs.style"
  >
    <component
      :is="rowTag"
      class="au-menu-list-item__row au-control-reset au-focus-ring au-forced-highlight au-motion-reduce au-motion-reduce-transform"
      v-bind="getRowAttrs()"
      :type="rowTag === 'button' ? 'button' : undefined"
      :href="rowTag === 'a' && !disabled ? href : undefined"
      :target="rowTag === 'a' ? target || undefined : undefined"
      :rel="rowTag === 'a' ? rel || undefined : undefined"
      :disabled="rowTag === 'button' ? disabled : undefined"
      :aria-disabled="disabled ? 'true' : undefined"
      :aria-current="selected ? ariaCurrent : undefined"
      @click="handleClick"
    >
      <span v-if="$slots.leading || leadingIcon" class="au-menu-list-item__leading au-inline-center" aria-hidden="true">
        <slot name="leading" :disabled="disabled" :selected="selected" :tone="tone">
          <AuIcon :icon="leadingIcon" />
        </slot>
      </span>

      <span class="au-menu-list-item__content">
        <span class="au-menu-list-item__title au-wrap-anywhere">
          <slot name="title"><slot>{{ title }}</slot></slot>
        </span>
        <span v-if="$slots.description || description" class="au-menu-list-item__description au-wrap-anywhere">
          <slot name="description">{{ description }}</slot>
        </span>
      </span>

      <span
        v-if="$slots.trailing || shortcut || accessory !== 'none'"
        class="au-menu-list-item__trailing"
      >
        <slot name="trailing" :disabled="disabled" :selected="selected" :tone="tone"></slot>
        <kbd v-if="shortcut" class="au-menu-list-item__shortcut">{{ shortcut }}</kbd>
        <AuIcon
          v-if="accessory === 'chevron'"
          class="au-menu-list-item__chevron"
          :icon="IconChevronRight"
        />
      </span>
    </component>
  </li>
</template>

<script setup>
import { computed, inject, useAttrs } from 'vue';
import { IconChevronRight } from '../../icons/internal.js';
import { AuIcon } from '../icon/index.js';
import { AU_MENU_LIST_CONTEXT_KEY } from './menu-list-context.js';

defineOptions({ inheritAttrs: false });

const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  leadingIcon: { type: [Object, Function], default: null },
  leadingVariant: {
    type: String,
    default: 'plain',
    validator: (value) => ['plain', 'tinted'].includes(value),
  },
  tone: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'warning', 'danger'].includes(value),
  },
  accessory: {
    type: String,
    default: 'none',
    validator: (value) => ['none', 'chevron'].includes(value),
  },
  clickable: { type: Boolean, default: false },
  href: { type: String, default: '' },
  target: { type: String, default: '' },
  rel: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
  ariaCurrent: { type: String, default: 'page' },
  shortcut: { type: String, default: '' },
});

const emit = defineEmits(['click']);
const attrs = useAttrs();
const menuList = inject(AU_MENU_LIST_CONTEXT_KEY, null);

const density = computed(() => menuList?.density.value || 'default');
const divided = computed(() => menuList?.divided.value ?? true);
const interactive = computed(() => props.clickable || Boolean(props.href));
const rowTag = computed(() => {
  if (props.href) return 'a';
  return props.clickable ? 'button' : 'div';
});

/** class/style 作用于列表项外壳，其余属性透传给内部内容行。 */
function getRowAttrs() {
  return Object.fromEntries(
    Object.entries(attrs).filter(([name]) => !['class', 'style'].includes(name)),
  );
}

function handleClick(event) {
  if (!interactive.value) return;
  if (props.disabled) {
    event.preventDefault();
    return;
  }
  emit('click', event);
}
</script>

<style scoped lang="scss">
@use '../../theme/config';

.au-menu-list-item {
  position: relative;
  display: block;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.au-menu-list-item.has-divider:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 16px;
  z-index: 2;
  height: 1px;
  background: var(--au-color-border-muted);
  transform: scaleY(0.5);
  transform-origin: bottom;
  pointer-events: none;
}

.au-menu-list-item__row {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  min-height: 52px;
  padding: 12px 16px;
  gap: 12px;
  text-align: left;
  text-decoration: none;
  transition:
    color var(--au-transition-duration) var(--au-transition-timing),
    background 100ms ease-out,
    transform 90ms ease-out;
}

.au-menu-list-item.is-interactive .au-menu-list-item__row {
  cursor: pointer;
}

.au-menu-list-item.is-interactive .au-menu-list-item__row:hover,
.au-menu-list-item.is-interactive .au-menu-list-item__row:focus-visible,
.au-menu-list-item.is-selected .au-menu-list-item__row {
  background: color-mix(in srgb, var(--au-color-primary) 7%, transparent);
}

.au-menu-list-item.is-interactive .au-menu-list-item__row:active {
  background: color-mix(in srgb, var(--au-color-primary) 12%, transparent);
  transform: scale(0.99);
}

.au-menu-list-item__row:focus-visible {
  z-index: 3;
  outline: var(--au-focus-ring-width) solid var(--au-focus-ring-color);
  outline-offset: -3px;
}

.au-menu-list-item.is-disabled {
  opacity: 0.48;
}

.au-menu-list-item.is-disabled .au-menu-list-item__row {
  cursor: not-allowed;
}

.au-menu-list-item__leading {
  width: auto;
  height: 30px;
  aspect-ratio: 1;
  flex: none;
  color: var(--au-color-primary);
  font-size: 20px;
}

.au-menu-list-item.has-leading-tinted .au-menu-list-item__leading {
  height: 32px;
  border-radius: var(--au-radius-control);
  color: var(--au-color-primary);
  background: color-mix(in srgb, var(--au-color-primary) 10%, transparent);
  font-size: 18px;
}

.au-menu-list-item__content {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.au-menu-list-item__title {
  color: var(--au-color-text-primary);
  font-size: var(--au-font-size-base);
  font-weight: var(--au-font-weight-medium);
  line-height: 1.35;
  letter-spacing: -0.005em;
}

.au-menu-list-item__description {
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
  font-weight: 400;
  line-height: 1.4;
}

.au-menu-list-item__trailing {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 0;
  max-width: 100%;
  gap: 8px;
  flex: 0 1 auto;
  overflow: hidden;
  color: var(--au-color-text-secondary);
}

.au-menu-list-item__chevron {
  color: var(--au-color-text-secondary);
  font-size: 20px;
}

.au-menu-list-item__shortcut {
  margin: 0;
  color: var(--au-color-text-secondary);
  background: transparent;
  font-family: inherit;
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-medium);
  line-height: 1;
  white-space: nowrap;
}

@each $tone, $color in config.$menu-tones {
  .au-menu-list-item.is-tone-#{$tone} {
    :is(.au-menu-list-item__title, .au-menu-list-item__leading) {
      color: $color;
    }

    @if $tone != primary {
      &.has-leading-tinted .au-menu-list-item__leading {
        background: color-mix(in srgb, $color 10%, transparent);
      }

      &.is-interactive .au-menu-list-item__row {
        &:hover,
        &:focus-visible {
          background: color-mix(in srgb, $color 8%, transparent);
        }

        &:active {
          background: color-mix(in srgb, $color 13%, transparent);
        }
      }

      &.is-selected .au-menu-list-item__row {
        background: color-mix(in srgb, $color 8%, transparent);
      }
    }
  }
}

.au-menu-list-item.is-compact .au-menu-list-item__row {
  min-height: 44px;
  padding-block: 10px;
}

.au-menu-list-item.is-relaxed .au-menu-list-item__row {
  min-height: 64px;
  padding: 14px 18px;
}

.au-menu-list-item.is-relaxed .au-menu-list-item__title {
  font-size: var(--au-font-size-large);
}

.au-menu-list-item.is-relaxed .au-menu-list-item__description {
  font-size: var(--au-font-size-base);
}

@media (forced-colors: active) {
  .au-menu-list-item.has-leading-tinted .au-menu-list-item__leading {
    border: 1px solid CanvasText;
    background: Canvas;
  }

}
</style>
