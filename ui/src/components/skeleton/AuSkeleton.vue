<template>
  <div class="au-skeleton au-component">
    <template v-if="visible">
      <div v-for="index in safeCount" :key="index" class="au-skeleton__group">
        <slot name="template" :index="index - 1">
          <div class="au-skeleton__paragraph">
            <AuSkeletonItem variant="p" width="33%" />
            <AuSkeletonItem
              v-for="row in safeRows"
              :key="row"
              variant="p"
              :width="row === safeRows ? '61%' : '100%'"
            />
          </div>
        </slot>
      </div>
    </template>
    <slot v-else-if="!loading" />
  </div>
</template>

<script setup>
import { computed, provide } from 'vue';
import AuSkeletonItem from './AuSkeletonItem.vue';
import { skeletonContextKey } from './skeleton-context.js';
import { useSkeletonLoading } from './use-skeleton-loading.js';

const props = defineProps({
  loading: { type: Boolean, default: true },
  animated: { type: Boolean, default: false },
  rows: { type: Number, default: 3, validator: (value) => Number.isInteger(value) && value >= 0 },
  count: { type: Number, default: 1, validator: (value) => Number.isInteger(value) && value >= 1 },
  throttle: { type: [Number, Object], default: 0 },
});

const safeRows = computed(() => Number.isFinite(props.rows) ? Math.max(0, Math.floor(props.rows)) : 3);
const safeCount = computed(() => Number.isFinite(props.count) ? Math.max(1, Math.floor(props.count)) : 1);
const { visible } = useSkeletonLoading(props);
provide(skeletonContextKey, { animated: computed(() => props.animated) });
</script>

<style scoped lang="scss" src="./AuSkeleton.scss"></style>
