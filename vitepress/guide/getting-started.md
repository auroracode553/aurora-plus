# 快速开始

## 环境与依赖

建议使用 Node.js 22。组件库的运行时同级依赖为 Vue `>= 3.3.0`，构建环境使用 Vite 和 Vue 插件；文档包独立使用 VitePress 与 Vue。

在项目目录中由使用者手动安装依赖：

```powershell
cd D:\my_project\front-sdk\aurora-ui
npm install
```

## 运行文档与组件预览

在仓库根目录通过 workspace 启动：

```powershell
npm run dev --workspace @aurora-ui/vitepress
```

也可以进入文档包后启动：

```powershell
cd vitepress
npm run dev
```

默认访问地址：

```text
http://127.0.0.1:5174
```

VitePress 会同时提供 Markdown 文档热更新和 Vue 组件热更新。组件库与文档站的脚本分别位于根目录 `package.json` 和 `vitepress/package.json`。

## 构建命令

| 命令 | 用途 | 输出目录 |
| --- | --- | --- |
| `npm run build` | 构建 Aurora UI 库 | `dist/` |
| `npm run build --workspace @aurora-ui/vitepress` | 构建文档站 | `vitepress/.vitepress/dist/` |
| `npm run preview --workspace @aurora-ui/vitepress` | 预览已构建的文档站 | 默认端口 `4174` |

运行文档预览前需要先构建文档包。在 `vitepress/` 目录内可省略 `--workspace`，直接执行对应脚本。

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

## 注册业务图标

```js
import boldIcon from './assets/bold.svg?raw';
import { registerIcons } from 'aurora-ui';

registerIcons({ bold: boldIcon });
```

注册内容通过 `v-html` 渲染，只应传入项目内可信 SVG，禁止直接注册用户输入。
