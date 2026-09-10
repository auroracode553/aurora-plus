<template>
  <AuPopover
    ref="popoverRef"
    v-model="visible"
    class="au-tree-select"
    :class="$attrs.class"
    :style="$attrs.style"
    :placement="placement"
    :offset="6"
    trigger="manual"
    :disabled="disabled"
    :surface="false"
    match-trigger-width
    :teleported="teleported"
    :append-to="appendTo"
    :z-index="zIndex"
    role="dialog"
    :aria-label="ariaLabel"
    @click="handleTriggerClick"
    @close="handlePopoverClose"
  >
    <template #trigger="{ triggerProps }">
      <AuInput
        ref="inputRef"
        :model-value="inputText"
        :size="size"
        :placeholder="visible && filterable ? filterPlaceholder : placeholder"
        :disabled="disabled"
        :readonly="!filterable"
        :clearable="clearable"
        clearable-when-readonly
        replace-suffix-on-clear
        :invalid="invalid"
        v-bind="inputAttrs"
        role="combobox"
        aria-haspopup="tree"
        :aria-expanded="triggerProps['aria-expanded']"
        :aria-controls="triggerProps['aria-controls']"
        :aria-autocomplete="filterable ? 'list' : undefined"
        :aria-label="ariaLabel"
        @update:model-value="handleInput"
        @clear="handleClear"
        @focus="handleFocus"
        @blur="emit('blur', $event)"
        @keydown="handleInputKeydown"
      >
        <template #suffix>
          <AuIcon
            class="au-tree-select__arrow au-motion-reduce-transform"
            :class="{ 'is-expanded': visible }"
            :icon="IconChevronDown"
          />
        </template>
      </AuInput>
      <input
        v-if="$attrs.name"
        type="hidden"
        :name="$attrs.name"
        :form="$attrs.form"
        :value="modelValue == null ? '' : String(modelValue)"
        :disabled="disabled"
      />
    </template>

    <section class="au-tree-select__popover au-component au-material-surface au-depth-overlay au-overlay-surface au-floating-viewport">
      <AuTree
        ref="treeRef"
        class="au-tree-select__tree"
        :items="visibleNodes"
        :selected-key="modelValue"
        :item-key="itemKey"
        :label-key="labelKey"
        disabled-key="__disabled"
        :item-height="itemHeight"
        :overscan="overscan"
        collapsible
        :empty-text="query ? noMatchText : emptyText"
        :aria-label="ariaLabel"
        @select="selectNode"
        @toggle="toggleNode"
      />
    </section>
  </AuPopover>
</template>

<script setup>
import { computed, nextTick, ref, useAttrs, watch } from 'vue';
import { IconChevronDown } from '../../icons/internal.js';
import { AuIcon } from '../icon/index.js';
import { AuInput } from '../input/index.js';
import { AuPopover } from '../popover/index.js';
import { AuTree } from '../tree/index.js';

function resolveChildren(node, childrenKey) {
  return Array.isArray(node?.[childrenKey]) ? node[childrenKey] : [];
}

function findTreeNode(nodes, key, itemKey = 'id', childrenKey = 'children') {
  for (const node of nodes || []) {
    if (Object.is(node?.[itemKey], key)) return node;
    const childMatch = findTreeNode(resolveChildren(node, childrenKey), key, itemKey, childrenKey);
    if (childMatch) return childMatch;
  }
  return null;
}

function collectParentKeys(nodes, itemKey = 'id', childrenKey = 'children') {
  const keys = [];
  function visit(items) {
    items.forEach((node) => {
      const children = resolveChildren(node, childrenKey);
      if (children.length > 0) {
        keys.push(node?.[itemKey]);
        visit(children);
      }
    });
  }
  visit(nodes || []);
  return keys;
}

function collectAncestorKeys(nodes, targetKey, itemKey = 'id', childrenKey = 'children') {
  function visit(items, ancestors) {
    for (const node of items) {
      if (Object.is(node?.[itemKey], targetKey)) return ancestors;
      const result = visit(
        resolveChildren(node, childrenKey),
        [...ancestors, node?.[itemKey]],
      );
      if (result) return result;
    }
    return null;
  }
  return visit(nodes || [], []) || [];
}

function flattenVisibleTree(nodes, options = {}) {
  const {
    itemKey = 'id',
    labelKey = 'label',
    childrenKey = 'children',
    disabledKey = 'disabled',
    expandedKeys = new Set(),
    query = '',
    leafOnly = false,
  } = options;
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const rows = [];

  function filterNode(node) {
    const children = resolveChildren(node, childrenKey);
    const filteredChildren = children.map(filterNode).filter(Boolean);
    const matches = String(node?.[labelKey] ?? '').toLocaleLowerCase().includes(normalizedQuery);
    return matches || filteredChildren.length > 0 ? { node, children: filteredChildren } : null;
  }

  function append(node, depth, filteredChildren = null) {
    const originalChildren = resolveChildren(node, childrenKey);
    const children = filteredChildren ?? originalChildren.map((child) => ({
      node: child,
      children: null,
    }));
    const hasChildren = originalChildren.length > 0;
    const expanded = normalizedQuery || expandedKeys.has(node?.[itemKey]);
    rows.push({
      ...node,
      displayDepth: depth,
      hasChildren,
      isCollapsed: hasChildren && !expanded,
      __disabled: Boolean(node?.[disabledKey]) || (leafOnly && hasChildren),
    });
    if (!hasChildren || !expanded) return;
    children.forEach((child) => append(child.node, depth + 1, child.children));
  }

  if (normalizedQuery) {
    (nodes || []).map(filterNode).filter(Boolean)
      .forEach((entry) => append(entry.node, 0, entry.children));
  } else {
    (nodes || []).forEach((node) => append(node, 0));
  }
  return rows;
}

defineOptions({ inheritAttrs: false });

const props = defineProps({
  modelValue: { type: [String, Number], default: null },
  data: { type: Array, default: () => [] },
  itemKey: { type: String, default: 'id' },
  labelKey: { type: String, default: 'label' },
  childrenKey: { type: String, default: 'children' },
  disabledKey: { type: String, default: 'disabled' },
  expandedKeys: { type: Array, default: null },
  defaultExpandedKeys: { type: Array, default: () => [] },
  defaultExpandAll: { type: Boolean, default: false },
  leafOnly: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
  filterPlaceholder: { type: String, default: '搜索节点' },
  placeholder: { type: String, default: '选择节点' },
  emptyText: { type: String, default: '暂无数据' },
  noMatchText: { type: String, default: '无匹配节点' },
  clearable: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  itemHeight: { type: Number, default: 28 },
  overscan: { type: Number, default: 8 },
  placement: { type: String, default: 'bottom-start' },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
  zIndex: { type: Number, default: 1200 },
  ariaLabel: { type: String, default: '树形选择' },
});

const emit = defineEmits([
  'update:modelValue',
  'update:expandedKeys',
  'change',
  'select',
  'clear',
  'focus',
  'blur',
  'visible-change',
  'expand-change',
]);
const attrs = useAttrs();
const popoverRef = ref(null);
const inputRef = ref(null);
const treeRef = ref(null);
const visible = ref(false);
const query = ref('');
const internalExpandedKeys = ref(createInitialExpandedKeys());

const inputAttrs = computed(() => Object.fromEntries(
  Object.entries(attrs).filter(([name]) => !['class', 'style', 'name'].includes(name)),
));
const selectedNode = computed(() => findTreeNode(
  props.data,
  props.modelValue,
  props.itemKey,
  props.childrenKey,
));
const selectedLabel = computed(() => String(selectedNode.value?.[props.labelKey] ?? ''));
const inputText = computed(() => (visible.value && props.filterable ? query.value : selectedLabel.value));
const effectiveExpandedKeys = computed(() => new Set(
  props.expandedKeys == null ? internalExpandedKeys.value : props.expandedKeys,
));
const visibleNodes = computed(() => flattenVisibleTree(props.data, {
  itemKey: props.itemKey,
  labelKey: props.labelKey,
  childrenKey: props.childrenKey,
  disabledKey: props.disabledKey,
  expandedKeys: effectiveExpandedKeys.value,
  query: query.value,
  leafOnly: props.leafOnly,
}));

function createInitialExpandedKeys() {
  const keys = props.defaultExpandAll
    ? collectParentKeys(props.data, props.itemKey, props.childrenKey)
    : [...props.defaultExpandedKeys];
  if (props.modelValue != null) {
    keys.push(...collectAncestorKeys(props.data, props.modelValue, props.itemKey, props.childrenKey));
  }
  return [...new Set(keys)];
}

function open() {
  if (props.disabled) return;
  query.value = '';
  popoverRef.value?.open();
}

function close(reason = 'api') {
  popoverRef.value?.close(reason);
}

function handlePopoverClose() {
  query.value = '';
}

function handleFocus(event) {
  emit('focus', event);
}

function handleTriggerClick(event) {
  if (event.target?.closest?.('.au-input__clear')) return;
  open();
}

function handleInput(value) {
  if (props.filterable && visible.value) query.value = value;
}

function handleClear(event) {
  if (visible.value && props.filterable) {
    query.value = '';
    return;
  }
  emit('update:modelValue', null);
  emit('change', null, null, event);
  emit('clear', event);
}

function handleInputKeydown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    open();
    nextTick(() => (
      popoverRef.value?.contentRef?.querySelector('[data-tree-index]:not(:disabled)')?.focus()
    ));
  } else if (event.key === 'Escape' && visible.value) {
    event.preventDefault();
    close('escape');
  } else if (event.key === 'Tab') {
    close('tab');
  }
}

function selectNode(node) {
  if (node.__disabled) return;
  const value = node?.[props.itemKey];
  emit('update:modelValue', value);
  emit('change', value, node);
  emit('select', node);
  close('select');
  nextTick(() => inputRef.value?.focus({ preventScroll: true }));
}

function toggleNode(node) {
  const key = node?.[props.itemKey];
  const nextKeys = new Set(effectiveExpandedKeys.value);
  if (nextKeys.has(key)) nextKeys.delete(key);
  else nextKeys.add(key);
  const values = [...nextKeys];
  if (props.expandedKeys == null) internalExpandedKeys.value = values;
  emit('update:expandedKeys', values);
  emit('expand-change', values, node);
}

function focus(options) {
  inputRef.value?.focus(options);
}

function blur() {
  inputRef.value?.blur();
}

watch(
  () => props.data,
  () => {
    if (props.expandedKeys == null) internalExpandedKeys.value = createInitialExpandedKeys();
  },
  { deep: true },
);

watch(
  () => props.modelValue,
  (value) => {
    if (props.expandedKeys != null || value == null) return;
    internalExpandedKeys.value = [...new Set([
      ...internalExpandedKeys.value,
      ...collectAncestorKeys(props.data, value, props.itemKey, props.childrenKey),
    ])];
  },
);

watch(visible, (value) => emit('visible-change', value));

defineExpose({ focus, blur, open, close, inputRef, treeRef, popoverRef });
</script>

<style scoped lang="scss" src="./AuTreeSelect.scss"></style>
