<template>
  <li
    class="au-menu-item au-component au-list-reset"
    :class="[`is-${menuMode}`, { 'is-collapsed': collapsed }]"
    role="none"
  >
    <button
      ref="buttonRef"
      class="au-menu-item__content au-control-reset au-focus-ring au-contrast-current"
      :class="{ 'is-active': active, 'au-disabled': itemDisabled }"
      type="button"
      role="menuitem"
      data-au-menu-item
      :disabled="itemDisabled"
      :tabindex="tabIndex"
      :aria-current="active ? ariaCurrent : undefined"
      :aria-disabled="itemDisabled ? 'true' : undefined"
      :aria-label="collapsed && label ? label : undefined"
      :title="resolvedTitle"
      v-bind="$attrs"
      @click="handleClick"
    >
      <span v-if="$slots.icon || icon" class="au-menu-item__icon au-inline-center" aria-hidden="true">
        <slot name="icon" :active="active" :disabled="itemDisabled">
          <AuIcon class="au-menu-item__graphic" :icon="icon" :color="iconColor" />
        </slot>
      </span>
      <span
        class="au-menu-item__label au-flex-truncate"
        :class="{ 'au-visually-hidden': collapsed }"
      ><slot>{{ label }}</slot></span>
      <span v-if="hasMeta" class="au-menu-item__meta au-inline-center au-meta-muted">
        <slot name="suffix" :active="active" :disabled="itemDisabled">
          <span v-if="hasBadge" class="au-menu-item__badge au-inline-center">{{ badge }}</span>
          <span v-if="indicator" class="au-menu-item__indicator" aria-hidden="true"></span>
        </slot>
      </span>
    </button>
  </li>
</template>

<script setup>
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, ref, useSlots } from 'vue';
import { AuIcon } from '../icon/index.js';

defineOptions({ inheritAttrs: false });

const AU_MENU_CONTEXT_KEY = Symbol.for('aurora-plus.menu-context');

const props = defineProps({
  index: { type: [String, Number], required: true },
  label: { type: String, default: '' },
  icon: { type: [Object, Function], default: null },
  iconColor: { type: String, default: '' },
  badge: { type: [String, Number], default: '' },
  indicator: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  title: { type: String, default: '' },
  ariaCurrent: { type: String, default: 'page' },
});

const menu = inject(AU_MENU_CONTEXT_KEY, null);
const instance = getCurrentInstance();
const slots = useSlots();
const buttonRef = ref(null);
const indexRef = computed(() => props.index);
const ownDisabled = computed(() => props.disabled);
const menuMode = computed(() => menu?.mode.value || 'vertical');
const collapsed = computed(() => Boolean(menu?.collapsed.value));
const itemDisabled = computed(() => props.disabled || Boolean(menu?.disabled.value));
const active = computed(() => Boolean(menu?.isActive(props.index)));
const hasBadge = computed(() => props.badge !== '');
const hasMeta = computed(() => hasBadge.value || props.indicator || Boolean(slots.suffix));
const tabIndex = computed(() => {
  if (itemDisabled.value) return -1;
  return menu ? menu.getItemTabIndex(instance.uid) : 0;
});
const resolvedTitle = computed(() => props.title || (collapsed.value ? props.label : '') || undefined);

function handleClick(event) {
  if (itemDisabled.value || !menu) return;
  menu.selectItem(props.index, event);
}

onMounted(() => {
  if (!menu) return;
  menu.registerItem({
    uid: instance.uid,
    index: indexRef,
    disabled: ownDisabled,
    element: buttonRef,
  });
});

onBeforeUnmount(() => {
  if (menu) menu.unregisterItem(instance.uid);
});
</script>

<style scoped lang="scss" src="./AuMenuItem.scss"></style>
