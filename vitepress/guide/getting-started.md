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

图标按需从 `aurora-plus/icons` 导入，图标实现已包含在 Aurora Plus 的发布产物中，无需安装其他图标包。完整用法和 `AuIcon` API 见 [Icon 图标](/components/icon)。
