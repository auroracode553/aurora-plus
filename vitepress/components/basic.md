<script setup>
import BasicDemo from '../.vitepress/theme/components/BasicDemo.vue';
</script>

# 基础组件

本页包含 `AuButton`、`AuIcon`、`AuCloseButton` 和 `AuTooltip`。

<BasicDemo />

## AuButton

```vue
<AuButton type="primary" :loading="saving" @click="save">保存</AuButton>
```

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `default / primary / success / info / warning / danger` | `default` | 视觉类型 |
| `size` | `small / default / large` | `default` | 尺寸 |
| `nativeType` | `button / submit / reset` | `button` | 原生按钮类型 |
| `icon` | `string` | 空 | 已注册图标名称 |
| `plain` | `boolean` | `false` | 朴素样式 |
| `round` | `boolean` | `false` | 胶囊圆角 |
| `circle` | `boolean` | `false` | 圆形按钮 |
| `disabled` | `boolean` | `false` | 禁用状态 |
| `loading` | `boolean` | `false` | 加载状态 |

## AuIcon

```vue
<AuIcon name="close" color="#409eff" :size="20" />
```

`source` 可以直接覆盖注册表内容。由于 SVG 使用 `v-html` 渲染，`source` 也只能接收可信源码。

## AuTooltip

```vue
<AuTooltip content="保存文件" placement="top" :show-after="200">
  <AuButton>保存</AuButton>
</AuTooltip>
```

支持 `top`、`bottom`、`left`、`right` 及 `-start`、`-end` 对齐后缀；空间不足时会在主轴方向自动翻转。
