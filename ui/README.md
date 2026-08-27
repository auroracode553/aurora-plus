# Aurora UI

Aurora UI 是 Vue 3 通用组件库，公共 API 使用 `Au` 前缀，支持完整安装、按需导入和命令式服务。

## 当前组件

| 导出 | 用途 |
| --- | --- |
| `AuButton` | 多类型、多尺寸、加载态按钮 |
| `AuButtonGroup` | 连体按钮组与悬浮控制组 |
| `AuInput` | 支持清空、前后缀和错误态的单行输入框 |
| `AuSwitch` | 二元状态切换开关 |
| `AuCheckbox` | 布尔值、数组和半选状态复选框 |
| `AuDropdown` | 带视口避让和键盘导航的下拉菜单 |
| `AuMenu`、`AuMenuItem` | 支持受控选中和键盘导航的持久导航菜单 |
| `AuCard` | 卡片容器 |
| `AuIcon` | 图标尺寸、颜色与无障碍外壳 |
| `AuTooltip` | 自动翻转、视口避让的提示气泡 |
| `AuDialog` | 模态对话框 |
| `AuVirtualList` | 固定行高虚拟列表 |
| `AuContextMenu` | 配置式右键菜单 |
| `AuFloatingToolbar` | 锚点浮动工具条 |
| `AuWindowTitleBar` | 桌面无边框窗口的受控标题栏 |
| `AuMessage` | 命令式消息提示 |
| `AuMessageBox` | Promise 风格确认框 |

## 安装

```bash
npm install aurora-ui
```

## 完整安装

```js
import { createApp } from 'vue';
import AuroraUI from 'aurora-ui';
import 'aurora-ui/style.css';
import App from './App.vue';

createApp(App).use(AuroraUI).mount('#app');
```

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

## 图标

从 `aurora-ui` 导入图标组件，并传给 `AuIcon` 或其他接受图标的 Aurora 组件：

```vue
<script setup>
import { AuButton, AuIcon, IconBold, IconHeart } from 'aurora-ui';
</script>

<template>
  <AuButton :icon="IconBold">加粗</AuButton>
  <AuIcon :icon="IconHeart" size="24" color="var(--au-color-danger)" aria-label="收藏" />
</template>
```

## 主题

使用 `data-au-theme` 设置暗色主题：

```html
<html data-au-theme="dark"></html>
```

使用 `data-au-material` 设置 `soft`、`clear` 或 `solid` 材质：

```html
<html data-au-material="clear"></html>
```

可以覆盖 `--au-*` CSS 变量定制主题：

```css
:root {
  --au-color-primary: #7c3aed;
  --au-border-radius-base: 8px;
}
```
