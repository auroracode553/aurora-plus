<template>
  <nav
    v-if="!hidden"
    class="au-pagination au-component"
    :class="[`is-${size}`, { 'is-disabled': disabled, 'has-background': background }]"
    :aria-label="ariaLabel"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <template v-for="(item, index) in layoutItems" :key="`${item}-${index}`">
      <span v-if="item === 'total'" class="au-pagination__total">
        {{ formatTotal(total) }}
      </span>

      <span v-else-if="item === 'sizes'" class="au-pagination__sizes">
        <AuSelect
          class="au-pagination__select"
          :model-value="innerPageSize"
          :size="size"
          :disabled="disabled"
          fit-content
          :max-width="160"
          aria-label="每页条数"
          @update:model-value="handlePageSizeChange"
        >
          <option v-for="option in normalizedPageSizes" :key="option" :value="option">
            {{ formatPageSize(option) }}
          </option>
        </AuSelect>
      </span>

      <button
        v-else-if="item === 'prev'"
        class="au-pagination__button au-control-reset au-focus-ring au-forced-highlight au-disabled-text"
        type="button"
        :disabled="disabled || innerCurrentPage <= 1"
        :aria-label="prevAriaLabel"
        @click="movePage(-1, 'prev')"
      >
        <slot name="prev" :disabled="innerCurrentPage <= 1">
          <span v-if="prevText">{{ prevText }}</span>
          <AuIcon v-else :icon="IconChevronLeft" />
        </slot>
      </button>

      <div v-else-if="item === 'pager'" class="au-pagination__pager">
        <button
          v-for="pager in pagerItems"
          :key="pager"
          class="au-pagination__button au-control-reset au-focus-ring au-forced-highlight au-disabled-text"
          :class="{
            'is-active': pager === innerCurrentPage,
            'is-more': typeof pager === 'string',
          }"
          type="button"
          :disabled="disabled"
          :aria-current="pager === innerCurrentPage ? 'page' : undefined"
          :aria-label="getPagerAriaLabel(pager)"
          @click="handlePagerClick(pager)"
        >
          <span v-if="pager === 'prev-more'" aria-hidden="true">•••</span>
          <span v-else-if="pager === 'next-more'" aria-hidden="true">•••</span>
          <span v-else>{{ pager }}</span>
        </button>
      </div>

      <button
        v-else-if="item === 'next'"
        class="au-pagination__button au-control-reset au-focus-ring au-forced-highlight au-disabled-text"
        type="button"
        :disabled="disabled || innerCurrentPage >= resolvedPageCount"
        :aria-label="nextAriaLabel"
        @click="movePage(1, 'next')"
      >
        <slot name="next" :disabled="innerCurrentPage >= resolvedPageCount">
          <span v-if="nextText">{{ nextText }}</span>
          <AuIcon v-else :icon="IconChevronRight" />
        </slot>
      </button>

      <label v-else-if="item === 'jumper'" class="au-pagination__jumper">
        <span>{{ jumpText }}</span>
        <input
          v-model="jumpPage"
          class="au-pagination__input au-control-reset au-focus-ring au-disabled-text"
          type="number"
          inputmode="numeric"
          min="1"
          :max="Math.max(resolvedPageCount, 1)"
          :disabled="disabled"
          aria-label="跳转页码"
          @keydown.enter.prevent="commitJump"
          @change="commitJump"
        />
      </label>

      <span v-else-if="item === '->'" class="au-pagination__spacer au-flex-spacer"></span>
      <slot v-else-if="item === 'slot'"></slot>
    </template>
  </nav>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { IconChevronLeft, IconChevronRight } from '../../icons/internal.js';
import { AuIcon } from '../icon/index.js';
import { AuSelect } from '../select/index.js';
import {
  buildPagerItems,
  clampNumber,
  getPageCount,
  parsePaginationLayout,
} from './pagination-utils.js';

const props = defineProps({
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  total: { type: Number, default: 0 },
  pageCount: { type: Number, default: undefined },
  pagerCount: {
    type: Number,
    default: 7,
    validator: (value) => value >= 5 && value <= 21 && value % 2 === 1,
  },
  layout: { type: String, default: 'prev, pager, next' },
  pageSizes: { type: Array, default: () => [10, 20, 30, 40, 50, 100] },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  disabled: { type: Boolean, default: false },
  background: { type: Boolean, default: false },
  hideOnSinglePage: { type: Boolean, default: false },
  prevText: { type: String, default: '' },
  nextText: { type: String, default: '' },
  prevAriaLabel: { type: String, default: '上一页' },
  nextAriaLabel: { type: String, default: '下一页' },
  jumpText: { type: String, default: '前往' },
  totalFormatter: { type: Function, default: null },
  pageSizeFormatter: { type: Function, default: null },
  ariaLabel: { type: String, default: '分页导航' },
});

const emit = defineEmits([
  'update:currentPage',
  'update:pageSize',
  'current-change',
  'size-change',
  'change',
  'prev-click',
  'next-click',
]);

const innerCurrentPage = ref(1);
const innerPageSize = ref(normalizePageSize(props.pageSize));
const jumpPage = ref('');

const resolvedPageCount = computed(() => getPageCount({
  pageCount: props.pageCount,
  total: props.total,
  pageSize: innerPageSize.value,
}));
const layoutItems = computed(() => parsePaginationLayout(props.layout));
const normalizedPageSizes = computed(() => {
  const values = props.pageSizes
    .map(normalizePageSize)
    .filter((value, index, list) => list.indexOf(value) === index)
    .sort((left, right) => left - right);
  if (!values.includes(innerPageSize.value)) values.push(innerPageSize.value);
  return values.sort((left, right) => left - right);
});
const pagerItems = computed(() => buildPagerItems(
  innerCurrentPage.value,
  resolvedPageCount.value,
  props.pagerCount,
));
const hidden = computed(() => props.hideOnSinglePage && resolvedPageCount.value <= 1);

function normalizePageSize(value) {
  const number = Math.trunc(Number(value));
  return Number.isFinite(number) && number > 0 ? number : 10;
}

function normalizeCurrentPage(value) {
  return clampNumber(value, 1, Math.max(resolvedPageCount.value, 1));
}

function setCurrentPage(value, source = 'pager') {
  if (props.disabled) return;
  const page = normalizeCurrentPage(value);
  if (page === innerCurrentPage.value) return;
  innerCurrentPage.value = page;
  jumpPage.value = '';
  emit('update:currentPage', page);
  emit('current-change', page);
  emit('change', page, innerPageSize.value);
  if (source === 'prev') emit('prev-click', page);
  if (source === 'next') emit('next-click', page);
}

function movePage(amount, source) {
  setCurrentPage(innerCurrentPage.value + amount, source);
}

function handlePagerClick(pager) {
  if (typeof pager === 'number') {
    setCurrentPage(pager);
    return;
  }
  const jump = Math.max(props.pagerCount - 2, 1);
  setCurrentPage(innerCurrentPage.value + (pager === 'prev-more' ? -jump : jump));
}

function handlePageSizeChange(value) {
  const size = normalizePageSize(value);
  if (size === innerPageSize.value) return;
  innerPageSize.value = size;
  emit('update:pageSize', size);
  emit('size-change', size);
  const nextPage = normalizeCurrentPage(innerCurrentPage.value);
  if (nextPage !== innerCurrentPage.value) {
    innerCurrentPage.value = nextPage;
    emit('update:currentPage', nextPage);
    emit('current-change', nextPage);
  }
  emit('change', innerCurrentPage.value, size);
}

function commitJump() {
  if (jumpPage.value === '') return;
  setCurrentPage(jumpPage.value, 'jumper');
  jumpPage.value = '';
}

function formatTotal(total) {
  return props.totalFormatter ? props.totalFormatter(total) : `共 ${Math.max(total, 0)} 条`;
}

function formatPageSize(size) {
  return props.pageSizeFormatter ? props.pageSizeFormatter(size) : `${size} 条/页`;
}

function getPagerAriaLabel(pager) {
  if (pager === 'prev-more') return '向前跳转更多页';
  if (pager === 'next-more') return '向后跳转更多页';
  return `第 ${pager} 页`;
}

watch(
  () => props.pageSize,
  (value) => { innerPageSize.value = normalizePageSize(value); },
  { immediate: true },
);

watch(
  () => [props.currentPage, resolvedPageCount.value],
  ([value]) => { innerCurrentPage.value = normalizeCurrentPage(value); },
  { immediate: true },
);

defineExpose({ currentPage: innerCurrentPage, pageCount: resolvedPageCount, setCurrentPage });
</script>

<style scoped lang="scss">
.au-pagination {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 6px;
  flex-wrap: wrap;
  color: var(--au-color-text-default);
  font-size: var(--au-font-size-small);
  font-variant-numeric: tabular-nums;
}

.au-pagination__pager {
  display: inline-flex;
  gap: 2px;
}

.au-pagination__button,
.au-pagination__input {
  height: 28px;
  border: 1px solid var(--au-material-border-emphasis);
  border-radius: var(--au-radius-compact);
  transition:
    color var(--au-transition-duration) var(--au-transition-timing),
    border-color var(--au-transition-duration) var(--au-transition-timing),
    background var(--au-transition-duration) var(--au-transition-timing),
    transform var(--au-transition-duration) var(--au-transition-timing);
}

.au-pagination__button {
  display: inline-grid;
  place-items: center;
  min-width: 28px;
  padding: 0 7px;
  cursor: pointer;
}

.au-pagination__button:hover:not(:disabled),
.au-pagination__input:hover:not(:disabled) {
  border-color: color-mix(in srgb, var(--au-color-primary) 50%, transparent);
  color: var(--au-color-primary);
  background: color-mix(in srgb, var(--au-color-primary) 7%, transparent);
}

.au-pagination__button:active:not(:disabled) {
  transform: scale(0.96);
  transition-duration: 0s;
}

.au-pagination__button.is-active {
  border-color: color-mix(in srgb, var(--au-color-primary) 55%, transparent);
  color: var(--au-color-primary);
  background: color-mix(in srgb, var(--au-color-primary) 12%, transparent);
  font-weight: var(--au-font-weight-semibold);
}

.au-pagination__button.is-more {
  color: var(--au-color-text-secondary);
  letter-spacing: 1px;
}

.au-pagination.has-background .au-pagination__button {
  background: var(--au-material-background-subtle);
}

.au-pagination__button:disabled,
.au-pagination__input:disabled {
  opacity: 0.7;
}

.au-pagination__sizes,
.au-pagination__jumper {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.au-pagination__select {
  flex: none;
}

/* AuSelect 自带交互与浮层样式，这里只对齐分页控件的紧凑高度。 */
.au-pagination__select {
  height: 28px;
}

.au-pagination__input {
  width: 48px;
  padding: 0 6px;
  text-align: center;
  -moz-appearance: textfield;
}

.au-pagination__input::-webkit-inner-spin-button,
.au-pagination__input::-webkit-outer-spin-button {
  margin: 0;
  appearance: none;
}

.au-pagination__spacer {
  min-width: 8px;
}

.au-pagination.is-small .au-pagination__button,
.au-pagination.is-small .au-pagination__input {
  height: 24px;
}

.au-pagination.is-small .au-pagination__select {
  height: 24px;
}

.au-pagination.is-small .au-pagination__button {
  min-width: 24px;
  padding-inline: 5px;
}

.au-pagination.is-large .au-pagination__button,
.au-pagination.is-large .au-pagination__input {
  height: 32px;
}

.au-pagination.is-large .au-pagination__select {
  height: 32px;
}

.au-pagination.is-large .au-pagination__button {
  min-width: 32px;
}

@media (prefers-contrast: more) {
  .au-pagination__button.is-active {
    border-color: currentColor;
  }
}

</style>
