<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import IconGallery from '../.vitepress/theme/components/IconGallery.vue';
import IconBasic from '../.vitepress/theme/examples/icon/IconBasic.vue';
import iconBasicSource from '../.vitepress/theme/examples/icon/IconBasic.vue?demo-source';
</script>

# Icon 图标

Aurora Plus 通过 `aurora-plus/icons` 入口提供具名异步图标组件，支持调整尺寸、颜色和描边宽度。调用方普通导入后直接渲染即可，无需再封装异步组件。图标实现仅在首次渲染时加载，保存或注册组件引用不会触发加载；相同图标的多个实例共享加载结果，再次使用无需重复加载。

## 基础用法

```vue
<script setup>
import { IconHome, IconSearch } from 'aurora-plus/icons';
</script>

<template>
  <IconHome />
  <IconSearch size="20" color="#3478f6" />
</template>
```

<DemoBlock
  title="常用图标"
  :source="iconBasicSource"
>
  <IconBasic />
</DemoBlock>

## 图标集合

<IconGallery />

## 在 Aurora Plus 组件中使用

```vue
<script setup>
import { AuButton, AuDropdown } from 'aurora-plus';
import { IconDownload, IconSettings } from 'aurora-plus/icons';

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

## AuIcon API

```vue
<script setup>
import { AuIcon } from 'aurora-plus';
import { IconHeart } from 'aurora-plus/icons';
</script>

<template>
  <AuIcon
    :icon="IconHeart"
    size="28"
    color="#e5484d"
    :stroke-width="1.5"
  />
</template>
```

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 图标组件 | Component | null |
| color | 图标颜色 | string | '' |
| size | 根节点宽高及字号；数字会转换为 px | string / number | '' |
| strokeWidth | 图标描边宽度 | number | 2 |
