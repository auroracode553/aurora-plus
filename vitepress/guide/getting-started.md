# 快速开始

## 安装

```bash
npm install aurora-plus
```

## 完整安装

```js
import { createApp } from 'vue';
import AuroraPlus from 'aurora-plus';
import 'aurora-plus/style.css';
import App from './App.vue';

createApp(App).use(AuroraPlus).mount('#app');
```

完整安装后，可以直接在模板中使用 `AuButton` 等组件，并通过 `$message`、`$messageBox` 和 `$confirm` 调用反馈服务。

## 按需导入

```vue
<script setup>
import { AuButton, AuMessage } from 'aurora-plus';
import 'aurora-plus/style.css';

function save() {
  AuMessage.success('保存成功');
}
</script>

<template>
  <AuButton type="primary" @click="save">保存</AuButton>
</template>
```

## 使用图标

```vue
<script setup>
import { AuButton } from 'aurora-plus';
import { IconBold } from 'aurora-plus/icons';
</script>

<template>
  <AuButton :icon="IconBold">加粗</AuButton>
</template>
```

图标按需从 `aurora-plus/icons` 具名导入，图标实现已包含在 Aurora Plus 的发布产物中，无需安装其他图标包。完整安装注册 `AuIcon` 等 UI 组件，不会把全部 `Icon*` 图标自动注册到应用；直接传入所用图标即可。需要少量图标时避免导入、遍历或批量注册整个图标集合。完整用法和 `AuIcon` API 见 [Icon 图标](/components/icon)。

## 可用平台

组件文档顶部显示适用平台。通用组件支持浏览器和 Electron；[WindowTitleBar 窗口标题栏](/components/window-title-bar) 用于 Electron 桌面窗口，文档示例可在浏览器中正常预览外观与按钮交互，实际窗口操作由 Electron 宿主处理。

浏览器和 Electron 渲染进程使用普通 `aurora-plus` 组件入口；窗口原生控件适配器从 `aurora-plus/electron` 导入，仅在 Electron 主进程使用。普通组件入口不会加载 `electron` 模块，浏览器项目无需配置 Electron 依赖或垫片。完整的主进程接入方式见窗口标题栏文档。
