# Aurora UI

Aurora UI 是从 Aurora Editor 中拆出的 Vue 3 通用组件库。首个版本聚焦桌面端与 Web 管理界面常用的基础交互，公共 API 使用 `Au` 前缀，设计方式参考 Element Plus 的“完整安装 + 按需导入 + 命令式服务”。

## 当前组件

| 导出 | 用途 | 来源 |
| --- | --- | --- |
| `AuButton` | 多类型、多尺寸、加载态按钮 | `XButton.vue` |
| `AuIcon` | SVG 图标渲染与注册 | `SvgIcon.vue` |
| `AuCloseButton` | 带提示的关闭按钮 | `XCloseButton.vue` |
| `AuTooltip` | 自动翻转、视口避让的提示气泡 | `XTooltip.vue` |
| `AuDialog` | 模态对话框壳、焦点和滚动管理 | `BaseDialog.vue` |
| `AuVirtualList` | 固定行高虚拟列表 | `VirtualScrollList.vue` |
| `AuContextMenu` | 配置式右键菜单 | `ContextMenu.vue` |
| `AuFloatingToolbar` | 锚点浮动工具条 | `FloatingToolbar.vue` |
| `AuMessage` | 命令式消息提示 | `toast.js` |
| `AuMessageBox` | Promise 风格确认框 | `confirm.js` |

## 依赖

运行时同级依赖：

- Vue `>= 3.3.0`

本地开发依赖：

- Vite `^8.1.5`
- `@vitejs/plugin-vue` `^6.0.7`
- Vue `^3.5.40`

文档站依赖由 `vitepress/package.json` 独立管理，其中包含 VitePress `^1.6.4` 与 Vue `^3.5.40`。组件库与文档站分别维护自己的 `package-lock.json`、依赖安装目录和 npm scripts，不使用 workspace。

依赖由使用者自行安装。

## 引入

完整安装：

```js
import { createApp } from 'vue';
import AuroraUI from 'aurora-ui';
import 'aurora-ui/style.css';
import App from './App.vue';

createApp(App).use(AuroraUI).mount('#app');
```

按需导入：

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

## 图标注册

`AuIcon` 内置 `close`、`loading`、`chevron-right` 及原组件使用的兼容名称。业务图标由宿主显式注册，UI 库不会扫描宿主源码目录。

```js
import boldIcon from './assets/bold.svg?raw';
import { registerIcons } from 'aurora-ui';

registerIcons({ bold: boldIcon });
```

也可以在完整安装时注入：

```js
app.use(AuroraUI, {
  icons: {
    bold: boldIcon,
  },
});
```

注册内容通过 `v-html` 渲染，只能传入项目内可信 SVG，禁止直接注册用户输入。

## 常用示例

对话框：

```vue
<AuDialog v-model="visible" title="编辑资料" width="520px" close-on-click-modal>
  <div>对话框正文</div>
  <template #footer>
    <AuButton @click="visible = false">取消</AuButton>
    <AuButton type="primary" @click="submit">确定</AuButton>
  </template>
</AuDialog>
```

虚拟列表的容器必须有可计算高度，且每项高度应与 `item-height` 一致：

```vue
<AuVirtualList class="file-list" :items="files" :item-height="36" v-slot="{ item, index }">
  <div class="file-row">{{ index + 1 }}. {{ item.name }}</div>
</AuVirtualList>
```

```css
.file-list {
  height: 480px;
}

.file-row {
  height: 36px;
}
```

右键菜单的业务确认通过回调注入：

```vue
<AuContextMenu
  v-model="menuVisible"
  :items="menuSections"
  :position="menuPosition"
  :before-select="beforeSelect"
  @select="runCommand"
/>
```

```js
import { AuMessageBox } from 'aurora-ui';

async function beforeSelect(item) {
  if (!item.confirmMessage) return true;
  return AuMessageBox.confirm({
    title: '请确认',
    message: item.confirmMessage,
  });
}
```

## 主题

默认读取根节点上的主题属性，与 Aurora Editor 现有约定兼容：

```js
document.documentElement.dataset.theme = 'dark';
```

也可使用独立属性：

```html
<html data-au-theme="dark"></html>
```

业务项目可以覆盖 `--au-*` CSS 变量定制颜色、圆角、字体、阴影和层级，完整变量见 `src/theme/index.css`。

## 文档与实时预览

文档站使用 VitePress，Markdown 文档直接挂载 Aurora UI 源组件，修改 `src/` 后会同步热更新预览。

```powershell
cd D:\my_project\front-sdk\aurora-ui
npm install

cd vitepress
npm install
npm run dev
```

默认访问 `http://127.0.0.1:5174`。

## 项目命令

| 执行目录 | 命令 | 用途 |
| --- | --- | --- |
| 仓库根目录 | `npm run build` | 构建 UI 库到 `dist/` |
| `vitepress/` | `npm run dev` | 启动文档与组件实时预览 |
| `vitepress/` | `npm run build` | 构建文档站 |
| `vitepress/` | `npm run preview` | 预览已经构建的文档站 |

两个包需要分别安装依赖。更详细的内容在 `vitepress/` 文档站中维护，包括组件示例、API、主题、架构和抽离清单。
