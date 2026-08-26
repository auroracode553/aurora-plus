# 快速开始

## 环境与依赖

Aurora UI 是 Vue 3 组件库，运行时需要 Vue `>= 3.3.0`。在业务项目中安装组件库及其运行时依赖：

```bash
npm install aurora-ui vue
```

Tabler 图标已经集成到 Aurora UI，无需安装额外图标包。

## 完整安装

```js
import { createApp } from 'vue';
import AuroraUI from 'aurora-ui';
import 'aurora-ui/style.css';
import App from './App.vue';

createApp(App).use(AuroraUI).mount('#app');
```

完整安装后，可以直接在模板中使用 `AuButton` 等组件，并通过 `$message`、`$messageBox` 和 `$confirm` 调用反馈服务。

## 按需导入

```vue
<script setup>
import { AuButton, AuMessage } from 'aurora-ui';
import 'aurora-ui/style.css';

function save() {
  AuMessage.success('保存成功');
}
</script>

<template>
  <AuButton type="primary" @click="save">保存</AuButton>
</template>
```

## 使用 Tabler 图标

```vue
<script setup>
import { AuButton, IconBold } from 'aurora-ui';
</script>

<template>
  <AuButton :icon="IconBold">加粗</AuButton>
</template>
```

图标按需从 `aurora-ui` 导入，完整用法和 `AuIcon` API 见 [Icon 图标](/components/icon)。

## 玻璃材质

Aurora UI 默认使用柔和（`soft`）材质，也可以在完整安装时设置为清透（`clear`）或实色（`solid`）：

```js
import { createApp } from 'vue';
import AuroraUI, { setAuroraMaterial } from 'aurora-ui';
import App from './App.vue';

const app = createApp(App);
app.use(AuroraUI, { material: 'clear' }).mount('#app');

// 运行时切换全局材质
setAuroraMaterial('soft');
```

也可以只为某个区域设置材质：

```html
<section data-au-material="clear">
  <!-- 该区域内的 Aurora UI 组件使用清透材质 -->
</section>
```

材质只影响表面透明度、模糊、饱和度和阴影，不会改变组件 API。系统开启“减少透明度”或高对比度后，组件会自动切换为更清晰的实色表面。

可以在[主题定制](/guide/theme#交互预览)页面直接切换材质并查看组件效果。
