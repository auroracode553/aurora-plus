# 主题配置

Aurora Plus 提供亮色与暗色主题配置，组件统一使用内置外观和动效。

按钮、表单、卡片、菜单、提示、弹窗和工具条共用高覆盖率的主题表面，默认底色覆盖率为 98%，保留轻微透色。磨砂仅用于浮层和贴边栏，普通控件与内容面板不模糊背景。深色主题使用石墨色底面，减少后方文字干扰；列表、正文容器和模态交互层仍保持透明继承。

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
