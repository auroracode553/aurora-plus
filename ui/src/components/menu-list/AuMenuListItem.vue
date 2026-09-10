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
      class="au-menu-list-item__row au-control-reset"
      v-bind="getRowAttrs()"
      :type="rowTag === 'button' ? 'button' : undefined"
      :href="rowTag === 'a' && !disabled ? href : undefined"
      :target="rowTag === 'a' ? target || undefined : undefined"
      :rel="rowTag === 'a' ? rel || undefined : undefined"
      :disabled="rowTag === 'button' ? disabled : undefined"
      @click="handleClick"
    >
      <span v-if="$slots.leading || leadingIcon" class="au-menu-list-item__leading au-inline-center">
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

defineOptions({ inheritAttrs: false });

const AU_MENU_LIST_CONTEXT_KEY = Symbol.for('aurora-plus.menu-list-context');

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

<style scoped lang="scss" src="./AuMenuListItem.scss"></style>
