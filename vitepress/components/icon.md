<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import IconGallery from '../.vitepress/theme/components/IconGallery.vue';
import IconBasic from '../.vitepress/theme/examples/icon/IconBasic.vue';
import iconBasicSource from '../.vitepress/theme/examples/icon/IconBasic.vue?demo-source';
</script>

# Icon 图标

Aurora UI 提供可按需导入的图标组件，并支持调整尺寸、颜色和描边宽度。`AuIcon` 用于统一图标的尺寸、颜色和无障碍属性。

## 基础用法

从 `aurora-ui` 导入需要的图标组件：

```vue
<script setup>
import { IconHome, IconSearch } from 'aurora-ui';
</script>

<template>
  <IconHome />
  <IconSearch size="20" color="#3478f6" />
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

下方目录收录当前版本的全部图标。可以按功能分类、样式或英文组件名筛选，点击图标即可复制组件名。

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

`AuButton`、`AuDropdown` 和 `AuContextMenu` 的 `icon` 字段都遵循同一约定，并支持描边和填充图标变体。

## AuIcon API

`AuIcon` 适合需要统一对齐、尺寸或无障碍属性的场景：

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
| `icon` | 图标组件 | `Component` | `null` |
| `color` | 图标颜色 | `string` | `''` |
| `size` | 根节点宽高及字号；数字会转换为 px | `string / number` | `''` |
| `strokeWidth` | 图标描边宽度 | `number` | `2` |
| `ariaLabel` | 图标的无障碍名称；为空时设置 `aria-hidden="true"` | `string` | `''` |

其他 HTML 属性会透传到 `.au-icon` 根节点。装饰性图标保持默认的隐藏语义；表达操作含义时请提供 `aria-label`，或在按钮上提供可见文本。

## 图标变体与查找

图标组件名以 `Icon` 开头，例如 `IconHeart` 与 `IconHeartFilled`。完整图标清单、预览和组件名可在本页的图标集合中查看。
