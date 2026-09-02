<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import MaterialPreview from '../.vitepress/theme/examples/theme/MaterialPreview.vue';
import materialPreviewSource from '../.vitepress/theme/examples/theme/MaterialPreview.vue?demo-source';
</script>

# 主题配置

Aurora Plus 提供暗色模式和玻璃材质配置。

## 暗色模式

运行时调用 `setAuroraTheme` 切换亮色和暗色：

```js
import { getAuroraTheme, setAuroraTheme } from 'aurora-plus';

setAuroraTheme('dark');
console.log(getAuroraTheme()); // dark

setAuroraTheme('light');
```

安装组件库时传入 `theme`，即可设置初始主题：

```js
import { createApp } from 'vue';
import AuroraPlus from 'aurora-plus';
import App from './App.vue';

createApp(App).use(AuroraPlus, { theme: 'dark' }).mount('#app');
```

有效值为 `light` 和 `dark`。传入无效值时不会修改当前设置。

## 玻璃材质

可选值为 `soft`、`clear` 和 `solid`，默认 `solid`。

### 交互预览

<DemoBlock
  title="全站材质切换"
  description="选择柔和、清透或实色。"
  :source="materialPreviewSource"
>
  <MaterialPreview />
</DemoBlock>

### 全局配置

安装组件库时传入 `material`，即可设置初始材质：

```js
import { createApp } from 'vue';
import AuroraPlus from 'aurora-plus';
import App from './App.vue';

createApp(App).use(AuroraPlus, { material: 'clear' }).mount('#app');
```

运行时调用 `setAuroraMaterial` 切换材质：

```js
import { getAuroraMaterial, setAuroraMaterial } from 'aurora-plus';

setAuroraMaterial('soft');
console.log(getAuroraMaterial()); // soft
```

传入无效值时不会修改当前设置。
