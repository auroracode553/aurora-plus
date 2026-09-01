<template>
  <div
    ref="scrollContainerRef"
    class="au-virtual-list au-component au-surface-frame au-surface-frame--rounded au-scroll-region au-thin-scrollbar au-focus-ring au-focus-ring--tight"
    :class="{ 'au-depth-surface': !plain, 'is-plain': plain, 'is-fill': fill }"
    @scroll.passive="handleScroll"
  >
    <slot v-if="items.length === 0" name="empty"></slot>
    <div v-else class="au-virtual-list__spacer" :style="{ height: `${totalHeight}px` }">
      <div class="au-virtual-list__content" :style="{ transform: `translateY(${offsetTop}px)` }">
        <slot
          v-for="(item, localIndex) in visibleItems"
          :key="resolveItemKey(item, visibleRange.start + localIndex)"
          :item="item"
          :index="visibleRange.start + localIndex"
        ></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  itemHeight: { type: Number, default: 28, validator: (value) => value > 0 },
  overscan: { type: Number, default: 8, validator: (value) => value >= 0 },
  keyField: { type: String, default: 'id' },
  itemKey: { type: Function, default: null },
  plain: { type: Boolean, default: false },
  fill: { type: Boolean, default: false },
});

const emit = defineEmits(['scroll', 'range-change']);
const scrollContainerRef = ref(null);
const scrollTop = ref(0);
const viewportHeight = ref(0);

let resizeObserver = null;
let listeningWindowResize = false;

const visibleRange = computed(() => {
  const total = props.items.length;
  const visibleCount = Math.ceil((viewportHeight.value || 360) / props.itemHeight) + props.overscan * 2;
  const start = Math.max(Math.floor(scrollTop.value / props.itemHeight) - props.overscan, 0);
  return { start, end: Math.min(start + visibleCount, total) };
});

const visibleItems = computed(() => props.items.slice(visibleRange.value.start, visibleRange.value.end));
const offsetTop = computed(() => visibleRange.value.start * props.itemHeight);
const totalHeight = computed(() => props.items.length * props.itemHeight);

function resolveItemKey(item, index) {
  if (props.itemKey) return props.itemKey(item, index);
  if (item && typeof item === 'object' && item[props.keyField] != null) return item[props.keyField];
  return index;
}

function handleScroll(event) {
  scrollTop.value = event.currentTarget.scrollTop;
  emit('scroll', event);
}

function updateViewportHeight() {
  if (!scrollContainerRef.value) return;
  const container = scrollContainerRef.value;
  const styles = typeof window === 'undefined' ? null : window.getComputedStyle(container);
  const paddingTop = Number.parseFloat(styles?.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(styles?.paddingBottom) || 0;

  // clientHeight includes padding, while the virtual range only covers item rows.
  viewportHeight.value = Math.max(container.clientHeight - paddingTop - paddingBottom, 0);
  syncScrollBounds();
}

function syncScrollBounds() {
  const maxScrollTop = Math.max(totalHeight.value - viewportHeight.value, 0);
  if (scrollTop.value <= maxScrollTop) return;
  setScrollTop(maxScrollTop);
}

function setScrollTop(value) {
  scrollTop.value = value;
  if (scrollContainerRef.value) scrollContainerRef.value.scrollTop = value;
}

function bindResizeObserver() {
  if (resizeObserver) resizeObserver.disconnect();
  updateViewportHeight();

  if (typeof ResizeObserver !== 'undefined' && scrollContainerRef.value) {
    resizeObserver = new ResizeObserver(updateViewportHeight);
    resizeObserver.observe(scrollContainerRef.value);
    return;
  }

  if (typeof window !== 'undefined' && !listeningWindowResize) {
    window.addEventListener('resize', updateViewportHeight);
    listeningWindowResize = true;
  }
}

function scrollToTop() {
  setScrollTop(0);
}

function scrollToIndex(index, align = 'auto') {
  const safeIndex = Math.max(0, Math.min(Math.trunc(index), Math.max(props.items.length - 1, 0)));
  const itemTop = safeIndex * props.itemHeight;
  const itemBottom = itemTop + props.itemHeight;
  const viewportBottom = scrollTop.value + viewportHeight.value;
  let target = itemTop;

  if (align === 'center') target = itemTop - (viewportHeight.value - props.itemHeight) / 2;
  else if (align === 'end') target = itemBottom - viewportHeight.value;
  else if (align === 'auto') {
    if (itemTop >= scrollTop.value && itemBottom <= viewportBottom) return;
    target = itemTop < scrollTop.value ? itemTop : itemBottom - viewportHeight.value;
  }

  setScrollTop(Math.max(0, Math.min(target, totalHeight.value - viewportHeight.value)));
}

watch(
  () => [props.items.length, props.itemHeight],
  syncScrollBounds
);

watch(
  visibleRange,
  (range) => emit('range-change', { ...range }),
  { immediate: true }
);

onMounted(bindResizeObserver);

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect();
  if (typeof window !== 'undefined') window.removeEventListener('resize', updateViewportHeight);
  listeningWindowResize = false;
});

defineExpose({ scrollContainerRef, scrollToIndex, scrollToTop });
</script>

<style scoped lang="scss">
.au-virtual-list {
  position: relative;
  min-width: 0;
  max-width: 100%;
  padding: 4px 6px;
  /* Lists inherit the page surface instead of adding a tinted layer. */
  background: transparent;
  scroll-padding-block: 4px;
  contain: strict;
}

.au-virtual-list.is-plain {
  padding: 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  contain: content;
}

.au-virtual-list.is-fill {
  width: 100%;
  min-width: 0;
  height: 100%;
  min-height: 0;
  flex: 1;
}

.au-virtual-list__spacer {
  position: relative;
  width: 100%;
}

.au-virtual-list__content {
  position: absolute;
  inset: 0 0 auto;
  will-change: transform;
}

</style>
