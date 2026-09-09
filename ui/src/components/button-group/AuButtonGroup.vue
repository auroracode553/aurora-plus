<template>
  <div
    class="au-button-group au-component"
    :class="[
      `is-${variant}`,
      `is-${orientation}`,
      `is-${size}`,
      {
        'is-icon-only': iconOnly,
        'is-inverse': inverse,
        'au-material-surface': variant !== 'segmented',
        'au-material-surface--base': variant !== 'segmented',
        'au-material-blur': variant === 'segmented',
      },
    ]"
    :role="role"
    :aria-label="ariaLabel || undefined"
    :aria-orientation="role === 'toolbar' ? orientation : undefined"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, provide } from 'vue';

const BUTTON_GROUP_CONTEXT = Symbol.for('aurora-plus.button-group-context');

const props = defineProps({
  variant: {
    type: String,
    default: 'connected',
    validator: (value) => ['connected', 'segmented', 'floating'].includes(value),
  },
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value),
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value),
  },
  role: {
    type: String,
    default: 'group',
    validator: (value) => ['group', 'toolbar'].includes(value),
  },
  iconOnly: { type: Boolean, default: false },
  inverse: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '' },
});

provide(BUTTON_GROUP_CONTEXT, {
  variant: computed(() => props.variant),
  orientation: computed(() => props.orientation),
  size: computed(() => props.size),
  iconOnly: computed(() => props.iconOnly),
  inverse: computed(() => props.inverse),
});
</script>

<style scoped lang="scss">
@use '../../theme/glass-controls' as glass;

.au-button-group {
  display: inline-flex;
  align-items: stretch;
  min-width: 0;
  max-width: 100%;
  vertical-align: middle;
  isolation: isolate;
}

.au-button-group.is-vertical {
  align-items: stretch;
  flex-direction: column;
}

/* 连体与悬浮控制组共用 UI 库的玻璃表面，只保留布局差异。 */
.au-button-group.is-connected,
.au-button-group.is-floating {
  gap: 2px;
  padding: 2px;
  border: 1px solid transparent;
  border-radius: 9px;
  @include glass.surface;
}

.au-button-group.is-floating {
  box-shadow:
    0 1px 2px color-mix(in srgb, var(--au-color-mask) 10%, transparent),
    0 4px 10px color-mix(in srgb, var(--au-color-mask) 10%, transparent);
}

/* 分段选择使用同一套控制按钮，仅让容器占满并均分子项。 */
.au-button-group.is-segmented {
  width: 100%;
  gap: 2px;
  padding: 2px;
  border: 0;
  border-radius: var(--au-radius-surface);
  color: var(--au-color-text-default);
  background: var(--au-material-background-subtle);
}

.au-button-group:is(.is-connected, .is-floating).is-small {
  border-radius: var(--au-radius-control);
}

.au-button-group:is(.is-connected, .is-floating).is-large {
  border-radius: var(--au-radius-surface);
}

.au-button-group.au-component.is-inverse {
  border-color: rgb(255 255 255 / 12%);
  color: rgb(255 255 255 / 88%);
  background: rgb(48 49 51 / 72%);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .au-button-group:is(.is-connected, .is-floating) {
    @include glass.solid-surface;
  }

  .au-button-group.au-component.is-inverse {
    background: rgb(48 49 51);
  }
}

@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .au-button-group:is(.is-connected, .is-floating) {
    @include glass.solid-surface;
  }

  .au-button-group.is-segmented {
    background: var(--au-color-background-subtle);
  }

  .au-button-group.au-component.is-inverse {
    background: rgb(48 49 51);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

@media (prefers-contrast: more) {
  .au-button-group:is(.is-connected, .is-floating, .is-segmented) {
    border: 1px solid var(--au-color-text-secondary);
  }

  .au-button-group.au-component.is-inverse {
    border: 1px solid currentColor;
  }
}

@media (forced-colors: active) {
  .au-button-group.au-component:is(.is-connected, .is-floating, .is-segmented, .is-inverse) {
    border: 1px solid ButtonText;
    color: ButtonText;
    background: Canvas;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}
</style>
