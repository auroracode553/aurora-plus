<template>
  <span
    ref="rootRef"
    class="au-select au-component"
    :class="[
      `is-${size}`,
      {
        'is-disabled': disabled,
        'is-invalid': invalid,
        'is-open': visible,
      },
      $attrs.class,
    ]"
    :style="$attrs.style"
  >
    <button
      ref="selectRef"
      class="au-select__control"
      v-bind="getControlAttrs()"
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      :aria-expanded="visible ? 'true' : 'false'"
      :aria-activedescendant="activeDescendantId"
      :aria-disabled="disabled ? 'true' : undefined"
      :aria-invalid="invalid ? 'true' : $attrs['aria-invalid']"
      :aria-required="ariaRequired"
      :disabled="disabled"
      @click="toggle"
      @keydown="handleControlKeydown"
      @focus="emit('focus', $event)"
      @blur="handleControlBlur"
    >
      <span class="au-select__value">{{ selectedLabel }}</span>
      <AuIcon class="au-select__icon" :icon="IconChevronDown" aria-hidden="true" />
    </button>

    <input
      v-if="$attrs.name"
      type="hidden"
      :name="$attrs.name"
      :form="$attrs.form"
      :value="formValue"
      :disabled="disabled"
    />
  </span>

  <Teleport :to="appendTo" :disabled="!teleported">
    <Transition name="au-select-popover">
      <div
        v-if="visible"
        :id="listboxId"
        ref="listboxRef"
        class="au-select__listbox au-component au-material-surface au-depth-surface au-motion-popover au-menu-surface"
        :class="[`is-${size}`, `is-${activePlacement}`]"
        :style="listboxStyle"
        role="listbox"
        :aria-label="listboxAriaLabel"
        @pointerdown.stop
      >
        <template v-for="group in visibleOptionGroups" :key="group.key">
          <div
            class="au-select__group"
            :role="group.label ? 'group' : 'presentation'"
            :aria-label="group.label || undefined"
          >
            <div v-if="group.label" class="au-select__group-label" aria-hidden="true">
              {{ group.label }}
            </div>
            <div
              v-for="option in group.options"
              :id="optionId(option.index)"
              :key="option.key"
              class="au-select__option"
              :class="{
                'is-selected': isOptionSelected(option),
                'is-highlighted': highlightedIndex === option.index,
                'is-disabled': option.disabled,
              }"
              :data-option-index="option.index"
              role="option"
              :aria-selected="isOptionSelected(option) ? 'true' : 'false'"
              :aria-disabled="option.disabled ? 'true' : undefined"
              :title="option.title"
              @pointerdown.prevent="highlightOption(option)"
              @pointerenter="highlightOption(option)"
              @click="selectOption(option, $event)"
            >
              <span class="au-select__option-label">{{ option.label }}</span>
              <span class="au-select__option-marker" aria-hidden="true">
                <AuIcon v-if="isOptionSelected(option)" :icon="IconCheck" />
              </span>
            </div>
          </div>
        </template>
        <div v-if="flatOptions.length === 0" class="au-select__empty">暂无选项</div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue';
import { IconCheck, IconChevronDown } from '@tabler/icons-vue';
import { AuIcon } from '../icon/index.js';
import {
  findAdjacentEnabledOption,
  isSameSelectValue,
  normalizeSelectOptionNodes,
  toSelectValue,
} from './select-options.js';

defineOptions({ inheritAttrs: false });

const VIEWPORT_GAP = 8;
const LISTBOX_OFFSET = 5;
const MAX_LISTBOX_HEIGHT = 240;
const TYPEAHEAD_RESET_DELAY = 650;
const SELECT_ID_PREFIX = 'au-select-';
let selectSeed = 0;

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: '' },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  disabled: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
  teleported: { type: Boolean, default: true },
  appendTo: { type: [String, Object], default: 'body' },
  zIndex: { type: Number, default: 1200 },
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);
const attrs = useAttrs();
const slots = useSlots();
const rootRef = ref(null);
const selectRef = ref(null);
const listboxRef = ref(null);
const visible = ref(false);
const highlightedIndex = ref(-1);
const activePlacement = ref('bottom');
const listboxPosition = ref({ x: 0, y: 0 });
const listboxWidth = ref(0);
const listboxMaxHeight = ref(MAX_LISTBOX_HEIGHT);
const selectId = `${SELECT_ID_PREFIX}${++selectSeed}`;
const listboxId = `${selectId}-listbox`;

let updateFrame = null;
let typeaheadTimer = null;
let typeaheadQuery = '';
let eventsBound = false;

const optionGroups = computed(() => {
  let optionIndex = 0;
  return normalizeSelectOptionNodes(slots.default?.() || []).map((group) => ({
    ...group,
    options: group.options.map((option) => ({ ...option, index: optionIndex++ })),
  }));
});
const flatOptions = computed(() => optionGroups.value.flatMap((group) => group.options));
const visibleOptionGroups = computed(() => optionGroups.value
  .map((group) => ({ ...group, options: group.options.filter((option) => !option.hidden) }))
  .filter((group) => group.options.length > 0));
const selectedOption = computed(() => flatOptions.value.find(
  (option) => isSameSelectValue(option.value, props.modelValue),
));
const selectedLabel = computed(() => selectedOption.value?.label || '');
const formValue = computed(() => toSelectValue(props.modelValue));
const ariaRequired = computed(() => (
  attrs.required !== false && attrs.required != null ? 'true' : undefined
));
const activeDescendantId = computed(() => (
  visible.value && highlightedIndex.value >= 0
    ? optionId(highlightedIndex.value)
    : undefined
));
const listboxAriaLabel = computed(() => attrs['aria-label'] || '选择选项');
const listboxStyle = computed(() => ({
  left: `${listboxPosition.value.x}px`,
  top: `${listboxPosition.value.y}px`,
  width: `${listboxWidth.value}px`,
  maxHeight: `${listboxMaxHeight.value}px`,
  zIndex: props.zIndex,
}));

/** 表单属性交给隐藏字段，其余未声明属性作用于可交互触发器。 */
function getControlAttrs() {
  const formAttributeNames = [
    'class',
    'style',
    'name',
    'form',
    'required',
    'multiple',
    'autocomplete',
    'aria-invalid',
  ];
  return Object.fromEntries(
    Object.entries(attrs).filter(([name]) => !formAttributeNames.includes(name)),
  );
}

function isOptionSelected(option) {
  return isSameSelectValue(option.value, props.modelValue);
}

function optionId(index) {
  return `${selectId}-option-${index}`;
}

function findInitialHighlight(direction = 1) {
  const selectedIndex = selectedOption.value?.index ?? -1;
  if (selectedIndex >= 0 && !selectedOption.value.disabled && !selectedOption.value.hidden) {
    return selectedIndex;
  }
  return findAdjacentEnabledOption(flatOptions.value, -1, direction);
}

async function open(direction = 1) {
  if (props.disabled || visible.value) return;
  highlightedIndex.value = findInitialHighlight(direction);
  activePlacement.value = 'bottom';
  listboxMaxHeight.value = MAX_LISTBOX_HEIGHT;
  prepareListboxWidth();
  visible.value = true;
  bindGlobalEvents();
  await nextTick();
  updatePosition();
  scrollHighlightedOptionIntoView();
}

function close() {
  if (!visible.value) return;
  visible.value = false;
  highlightedIndex.value = -1;
  clearTypeahead();
  unbindGlobalEvents();
}

function toggle() {
  if (visible.value) close();
  else open();
}

function highlightOption(option) {
  if (option.disabled || option.hidden) return;
  highlightedIndex.value = option.index;
}

function moveHighlight(direction) {
  const nextIndex = findAdjacentEnabledOption(
    flatOptions.value,
    highlightedIndex.value,
    direction,
  );
  if (nextIndex < 0) return;
  highlightedIndex.value = nextIndex;
  scrollHighlightedOptionIntoView();
}

function moveHighlightToBoundary(end = false) {
  const options = end ? [...flatOptions.value].reverse() : flatOptions.value;
  const option = options.find((item) => !item.disabled && !item.hidden);
  if (!option) return;
  highlightedIndex.value = option.index;
  scrollHighlightedOptionIntoView();
}

function selectOption(option, sourceEvent) {
  if (!option || option.disabled || option.hidden) return;
  const value = toSelectValue(option.value);
  const changed = !isSameSelectValue(value, props.modelValue);
  close();
  if (!changed) return;
  emit('update:modelValue', value);
  emit('change', value, sourceEvent);
}

function selectHighlighted(sourceEvent) {
  selectOption(flatOptions.value[highlightedIndex.value], sourceEvent);
}

function handleControlKeydown(event) {
  if (props.disabled) return;

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    if (visible.value) moveHighlight(direction);
    else open(direction);
    return;
  }
  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    if (visible.value) moveHighlightToBoundary(event.key === 'End');
    else {
      open(event.key === 'End' ? -1 : 1)
        .then(() => moveHighlightToBoundary(event.key === 'End'));
    }
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    if (visible.value) selectHighlighted(event);
    else open();
    return;
  }
  if (event.key === 'Escape' && visible.value) {
    event.preventDefault();
    close();
    return;
  }
  if (event.key === 'Tab') {
    close();
    return;
  }
  if (isTypeaheadKey(event)) handleTypeahead(event);
}

function isTypeaheadKey(event) {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
}

function handleTypeahead(event) {
  const key = event.key.toLocaleLowerCase();
  typeaheadQuery += key;
  clearTimeout(typeaheadTimer);
  typeaheadTimer = globalThis.setTimeout(clearTypeahead, TYPEAHEAD_RESET_DELAY);

  const options = flatOptions.value;
  const startIndex = Math.max(highlightedIndex.value, selectedOption.value?.index ?? -1);
  const orderedOptions = [
    ...options.slice(startIndex + 1),
    ...options.slice(0, startIndex + 1),
  ];
  const match = orderedOptions.find((option) => (
    !option.disabled
    && !option.hidden
    && option.label.toLocaleLowerCase().startsWith(typeaheadQuery)
  ));
  if (!match) return;

  event.preventDefault();
  if (visible.value) {
    highlightedIndex.value = match.index;
    scrollHighlightedOptionIntoView();
  } else {
    selectOption(match, event);
  }
}

function clearTypeahead() {
  clearTimeout(typeaheadTimer);
  typeaheadTimer = null;
  typeaheadQuery = '';
}

function handleControlBlur(event) {
  emit('blur', event);
  close();
}

function prepareListboxWidth() {
  const triggerRect = selectRef.value?.getBoundingClientRect();
  if (!triggerRect || typeof window === 'undefined') return;
  listboxWidth.value = Math.min(triggerRect.width, window.innerWidth - VIEWPORT_GAP * 2);
}

function updatePosition() {
  const trigger = selectRef.value;
  const listbox = listboxRef.value;
  if (!trigger || !listbox || typeof window === 'undefined') return;

  const triggerRect = trigger.getBoundingClientRect();
  const listboxRect = listbox.getBoundingClientRect();
  const naturalHeight = Math.min(
    Math.max(listbox.scrollHeight, listboxRect.height),
    MAX_LISTBOX_HEIGHT,
  );
  const availableBelow = window.innerHeight - triggerRect.bottom - LISTBOX_OFFSET - VIEWPORT_GAP;
  const availableAbove = triggerRect.top - LISTBOX_OFFSET - VIEWPORT_GAP;
  const useTopPlacement = naturalHeight > availableBelow && availableAbove > availableBelow;
  const availableHeight = Math.max(useTopPlacement ? availableAbove : availableBelow, 0);
  const maxHeight = Math.min(MAX_LISTBOX_HEIGHT, availableHeight);
  const renderedHeight = Math.min(naturalHeight, maxHeight);
  const desiredTop = useTopPlacement
    ? triggerRect.top - LISTBOX_OFFSET - renderedHeight
    : triggerRect.bottom + LISTBOX_OFFSET;
  const width = Math.min(triggerRect.width, window.innerWidth - VIEWPORT_GAP * 2);

  activePlacement.value = useTopPlacement ? 'top' : 'bottom';
  listboxWidth.value = width;
  listboxMaxHeight.value = maxHeight;
  listboxPosition.value = {
    x: clamp(triggerRect.left, VIEWPORT_GAP, window.innerWidth - width - VIEWPORT_GAP),
    y: clamp(desiredTop, VIEWPORT_GAP, window.innerHeight - renderedHeight - VIEWPORT_GAP),
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, Math.max(min, max)));
}

function scheduleUpdatePosition() {
  if (!visible.value || updateFrame != null || typeof window === 'undefined') return;
  updateFrame = window.requestAnimationFrame(() => {
    updateFrame = null;
    updatePosition();
  });
}

function scrollHighlightedOptionIntoView() {
  nextTick(() => {
    const option = listboxRef.value?.querySelector(`[data-option-index="${highlightedIndex.value}"]`);
    option?.scrollIntoView?.({ block: 'nearest' });
  });
}

function handleOutsidePointer(event) {
  if (!visible.value) return;
  if (rootRef.value?.contains(event.target) || listboxRef.value?.contains(event.target)) return;
  close();
}

function bindGlobalEvents() {
  if (eventsBound || typeof document === 'undefined' || typeof window === 'undefined') return;
  eventsBound = true;
  document.addEventListener('pointerdown', handleOutsidePointer, true);
  document.addEventListener('scroll', scheduleUpdatePosition, true);
  window.addEventListener('resize', scheduleUpdatePosition);
}

function unbindGlobalEvents() {
  if (!eventsBound || typeof document === 'undefined' || typeof window === 'undefined') return;
  eventsBound = false;
  document.removeEventListener('pointerdown', handleOutsidePointer, true);
  document.removeEventListener('scroll', scheduleUpdatePosition, true);
  window.removeEventListener('resize', scheduleUpdatePosition);
}

function focus(options) {
  selectRef.value?.focus(options);
}

function blur() {
  close();
  selectRef.value?.blur();
}

watch(
  () => props.modelValue,
  () => {
    if (visible.value) highlightedIndex.value = findInitialHighlight();
  },
);

watch(
  () => props.disabled,
  (value) => {
    if (value) close();
  },
);

onBeforeUnmount(() => {
  clearTypeahead();
  unbindGlobalEvents();
  if (updateFrame != null && typeof window !== 'undefined') window.cancelAnimationFrame(updateFrame);
});

defineExpose({ focus, blur, open, close, toggle, selectRef, listboxRef });
</script>

<style scoped>
.au-select {
  display: inline-flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  height: 30px;
  border: 0.5px solid var(--au-material-border-strong);
  border-radius: var(--au-radius-control);
  color: var(--au-color-text-regular);
  background: var(--au-material-bg-subtle);
  font-size: 13px;
  transition:
    border-color var(--au-transition-duration) var(--au-transition-ease),
    background var(--au-transition-duration) var(--au-transition-ease),
    box-shadow var(--au-transition-duration) var(--au-transition-ease);
}

.au-select.is-small {
  height: 26px;
  border-radius: var(--au-radius-small);
  font-size: var(--au-font-size-small);
}

.au-select.is-large {
  height: 36px;
  border-radius: var(--au-radius-control);
  font-size: var(--au-font-size-base);
}

.au-select:hover:not(.is-disabled),
.au-select.is-open:not(.is-disabled) {
  border-color: var(--au-material-border-strong);
  background: var(--au-material-bg-subtle);
}

.au-select:focus-within:not(.is-disabled) {
  border-color: color-mix(in srgb, var(--au-color-primary) 45%, transparent);
  background: var(--au-material-bg-subtle);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--au-color-primary) 8%, transparent);
}

.au-select.is-invalid {
  border-color: color-mix(in srgb, var(--au-color-danger) 60%, transparent);
}

.au-select.is-invalid:focus-within {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--au-color-danger) 10%, transparent);
}

.au-select.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.au-select__control {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0 8px 0 10px;
  gap: 6px;
  margin: 0;
  border: 0;
  outline: 0;
  color: inherit;
  background: transparent;
  font: inherit;
  text-align: left;
  appearance: none;
  cursor: pointer;
}

.au-select.is-small > .au-select__control {
  padding-inline: 8px 6px;
}

.au-select.is-large > .au-select__control {
  padding-inline: 12px 9px;
}

.au-select__control:active:not(:disabled) {
  background: color-mix(in srgb, var(--au-color-primary) 5%, transparent);
}

.au-select__control:disabled {
  cursor: not-allowed;
}

.au-select__value {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.au-select__icon {
  flex: none;
  color: var(--au-color-text-secondary);
  pointer-events: none;
  transition: transform var(--au-transition-duration) var(--au-transition-ease);
}

.au-select.is-open .au-select__icon {
  transform: rotate(180deg);
}

.au-select__listbox {
  position: fixed;
  min-height: 30px;
  padding: 4px;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: var(--au-radius-overlay);
  font-size: 13px;
  line-height: 1.3;
  overscroll-behavior: contain;
  transform-origin: top left;
}

.au-select__listbox.is-top {
  transform-origin: bottom left;
}

.au-select__option {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 30px;
  padding: 5px 7px 5px 9px;
  gap: 8px;
  border-radius: var(--au-radius-control);
  color: var(--au-color-text-regular);
  cursor: pointer;
  user-select: none;
  transition:
    color var(--au-transition-duration) var(--au-transition-ease),
    background var(--au-transition-duration) var(--au-transition-ease);
}

.au-select__listbox.is-small .au-select__option {
  min-height: 28px;
  padding-block: 4px;
  font-size: var(--au-font-size-small);
}

.au-select__listbox.is-large .au-select__option {
  min-height: 34px;
  padding-inline: 11px 9px;
  font-size: var(--au-font-size-base);
}

.au-select__option.is-selected {
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-color-primary) 9%, transparent);
}

.au-select__option.is-highlighted {
  color: var(--au-color-text-primary);
  background: color-mix(in srgb, var(--au-color-primary) 14%, transparent);
}

.au-select__option:active:not(.is-disabled) {
  background: color-mix(in srgb, var(--au-color-primary) 18%, transparent);
  transition-duration: 0s;
}

.au-select__option.is-disabled {
  color: var(--au-color-text-disabled);
  cursor: not-allowed;
  opacity: 0.62;
}

.au-select__option-label {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.au-select__option-marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 16px;
  aspect-ratio: 1;
  flex: none;
  color: var(--au-color-primary);
  font-size: 14px;
}

.au-select__group + .au-select__group {
  margin-top: 3px;
  padding-top: 3px;
  border-top: 1px solid var(--au-material-border-strong);
}

.au-select__group-label {
  padding: 5px 9px 3px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
  font-weight: var(--au-font-weight-medium);
}

.au-select__empty {
  padding: 7px 9px;
  color: var(--au-color-text-secondary);
  font-size: var(--au-font-size-small);
}

.au-select-popover-enter-from,
.au-select-popover-leave-to {
  opacity: 0;
  transform: translateY(-3px) scale(0.985);
}

.au-select__listbox.is-top.au-select-popover-enter-from,
.au-select__listbox.is-top.au-select-popover-leave-to {
  transform: translateY(3px) scale(0.985);
}

@media (prefers-reduced-transparency: reduce) {
  .au-select,
  .au-select:hover:not(.is-disabled),
  .au-select.is-open:not(.is-disabled),
  .au-select:focus-within:not(.is-disabled) {
    background: var(--au-color-bg-overlay);
  }
}

@media (prefers-reduced-motion: reduce) {
  .au-select__icon,
  .au-select-popover-enter-from,
  .au-select-popover-leave-to,
  .au-select__listbox.is-top.au-select-popover-enter-from,
  .au-select__listbox.is-top.au-select-popover-leave-to {
    transform: none;
  }
}

@media (prefers-contrast: more) {
  .au-select,
  .au-select__listbox {
    border-width: 1px;
    border-color: var(--au-color-border);
  }
}

@media (forced-colors: active) {
  .au-select,
  .au-select__listbox {
    border: 1px solid CanvasText;
  }

  .au-select:focus-within:not(.is-disabled) {
    outline: 2px solid Highlight;
    outline-offset: 2px;
    box-shadow: none;
  }

  .au-select__option.is-selected,
  .au-select__option.is-highlighted {
    color: HighlightText;
    background: Highlight;
  }

  .au-select__option-marker {
    color: currentColor;
  }
}
</style>
