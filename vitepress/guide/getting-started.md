# 快速开始

## 环境与依赖

建议使用 Node.js 22。组件库的运行时同级依赖为 Vue `>= 3.3.0`，构建环境使用 Vite 和 Vue 插件；文档包独立使用 VitePress 与 Vue。

组件库和文档站需要由使用者分别安装依赖：

```powershell
cd D:\my_project\front-sdk\aurora-ui
npm install

cd vitepress
npm install
```

## 运行文档与组件预览

进入文档包后启动：

```powershell
cd D:\my_project\front-sdk\aurora-ui\vitepress
npm run dev
```

默认访问地址：

```text
http://127.0.0.1:5174
```

VitePress 会同时提供 Markdown 文档热更新和 Vue 组件热更新。组件库与文档站拥有各自的 `package.json`、`package-lock.json`、依赖安装和 npm scripts。

## 构建命令

| 执行目录 | 命令 | 用途 | 输出目录 |
| --- | --- | --- | --- |
| 仓库根目录 | `npm run build` | 构建 Aurora UI 库 | `dist/` |
| `vitepress/` | `npm run build` | 构建文档站 | `.vitepress/dist/` |
| `vitepress/` | `npm run preview` | 预览已构建的文档站 | 默认端口 `4174` |

运行文档预览前，需要先在 `vitepress/` 目录中构建文档包。

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

## 从文档复制示例

组件页的每个演示框底部都有“查看完整源代码（含数据）”。展开后展示的是驱动上方预览的同一个 Vue 单文件组件，内容包括：

- `<template>` 中的组件组合和事件绑定；
- `<script setup>` 中的 `ref`、`reactive`、数组数据及处理函数；
- 示例正常布局所需的 `<style scoped>`。

复制到业务项目后，只需确认已经引入 `aurora-ui/style.css`。示例中的业务数据可以直接替换，组件 API 不需要改动。

## 注册业务图标

```js
import boldIcon from './assets/bold.svg?raw';
import { registerIcons } from 'aurora-ui';

registerIcons({ bold: boldIcon });
```

注册内容通过 `v-html` 渲染，只应传入项目内可信 SVG，禁止直接注册用户输入。
