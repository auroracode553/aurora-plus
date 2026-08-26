<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import IconGallery from '../.vitepress/theme/components/IconGallery.vue';
import IconBasic from '../.vitepress/theme/examples/icon/IconBasic.vue';
import iconBasicSource from '../.vitepress/theme/examples/icon/IconBasic.vue?demo-source';
</script>

# Icon 图标

Aurora UI 使用 [Tabler Icons](https://tabler.io/icons) 作为唯一图标来源。Tabler 为每个图标提供独立的 Vue 组件，支持按需导入、尺寸、颜色和描边宽度调整。图标组件本身保持 SVG 语义，`AuIcon` 只负责统一尺寸、颜色和无障碍外壳。

## 基础用法

从 `aurora-ui` 导入需要的图标组件即可。图标仍保留独立的 ESM 导出，业务构建工具可以按需裁剪未使用图标：

```vue
<script setup>
import { IconHome, IconSearch } from 'aurora-ui';
</script>

<template>
  <IconHome />
  <IconSearch size="20" color="var(--au-color-primary)" />
</template>
```

<DemoBlock
  title="常用图标"
  description="图标组件可以直接使用，也可以交给 AuIcon 统一控制尺寸、颜色和描边。"
  :source="iconBasicSource"
>
  <IconBasic />
</DemoBlock>

## 图标集合

下方目录收录当前版本的全部 Tabler Vue 图标。可以按功能分类、样式或英文组件名筛选，点击图标即可复制组件名。

<IconGallery />

## 在 Aurora 组件中使用

接受图标的 Aurora 组件统一接收 Vue 图标组件本身，而不是字符串名称：

```vue
<script setup>
import { AuButton, AuDropdown, IconDownload, IconSettings } from 'aurora-ui';

const menuItems = [
  { id: 'download', label: '下载', icon: IconDownload },
  { id: 'settings', label: '设置', icon: IconSettings },
];
</script>

<template>
  <AuButton :icon="IconDownload">下载</AuButton>
  <AuDropdown :items="menuItems" />
</template>
```

`AuButton`、`AuDropdown` 和 `AuContextMenu` 的 `icon` 字段都遵循同一约定。这样可以保持按需导入，并且可以直接使用 Tabler 的描边和填充图标变体。

## AuIcon API

`AuIcon` 适合需要统一对齐、尺寸或无障碍属性的场景，也可以包裹任意 Tabler 图标组件：

```vue
<script setup>
import { AuIcon, IconHeart } from 'aurora-ui';
</script>

<template>
  <AuIcon
    :icon="IconHeart"
    size="28"
    color="#e5484d"
    :stroke-width="1.5"
    aria-label="收藏"
  />
</template>
```

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `icon` | Tabler Icons Vue 组件 | `Component` | `null` |
| `color` | 图标颜色，会传递给 Tabler 的 `color` 属性 | `string` | `''` |
| `size` | 根节点宽高及字号；数字会转换为 px | `string / number` | `''` |
| `strokeWidth` | Tabler 图标描边宽度 | `number` | `2` |
| `ariaLabel` | 图标的无障碍名称；为空时设置 `aria-hidden="true"` | `string` | `''` |

其他 HTML 属性会透传到 `.au-icon` 根节点。装饰性图标保持默认的隐藏语义；表达操作含义时请提供 `aria-label`，或在按钮上提供可见文本。

## 图标变体与查找

Tabler 同时提供描边和填充变体，组件名以 `Icon` 开头，例如 `IconHeart` 与 `IconHeartFilled`。完整图标清单、预览和每个图标的组件名请参阅 [Tabler Icons 图标目录](https://tabler.io/icons)。

组件库不再维护 SVG 字符串注册表，也不接受 `name`、`source` 或运行时注册方法；图标实现由 Aurora UI 集成的 Tabler 运行时依赖统一提供。
