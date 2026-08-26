# 快速开始

## 环境与依赖

Aurora UI 是 Vue 3 组件库，运行时需要 Vue `>= 3.3.0`。在业务项目中安装组件库及其运行时依赖：

```bash
npm install aurora-ui vue
```

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
