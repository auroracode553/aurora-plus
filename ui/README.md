# Aurora UI

Aurora UI 是从 Aurora Editor 中拆出的 Vue 3 通用组件库。首个版本聚焦桌面端与 Web 管理界面常用的基础交互，公共 API 使用 `Au` 前缀，设计方式参考 Element Plus 的“完整安装 + 按需导入 + 命令式服务”。

## 当前组件

| 导出 | 用途 | 来源 |
| --- | --- | --- |
| `AuButton` | 多类型、多尺寸、加载态按钮 | `XButton.vue` |
| `AuButtonGroup` | `connected` 连体按钮组与 `floating` 悬浮控制组 | 通用控制组 |
| `AuCard` | 带玻璃质感的空卡片容器 | 通用卡片 |
| `AuIcon` | SVG 图标渲染与注册 | `SvgIcon.vue` |
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

在业务项目中安装 `aurora-ui` 时，请同时安装满足版本要求的 Vue。

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

所有示例都展示完整数据定义，不省略 `v-model` 状态或 `items` 数组。下面的虚拟列表示例可以直接复制为单文件组件：

```vue
<script setup>
import { AuVirtualList } from 'aurora-ui';

const files = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `项目文件 ${String(index + 1).padStart(4, '0')}.md`,
  status: index % 3 === 0 ? '已同步' : '仅本地',
}));
</script>

<template>
  <AuVirtualList class="file-list" :items="files" :item-height="36">
    <template #default="{ item, index }">
      <div class="file-row">
        <span>{{ index + 1 }}. {{ item.name }}</span>
        <small>{{ item.status }}</small>
      </div>
    </template>
  </AuVirtualList>
</template>

<style scoped>
.file-list {
  height: 480px;
}

.file-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
}
</style>
```

虚拟列表容器必须有可计算高度，每项实际高度应与 `item-height` 一致。右键菜单同样使用显式的数据模型：

```vue
<script setup>
import { ref } from 'vue';
import { AuContextMenu, AuMessage, AuMessageBox } from 'aurora-ui';

const menuVisible = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const menuSections = [
  {
    id: 'editing',
    type: 'button-group',
    items: [
      { id: 'copy', label: '复制', shortcut: 'Ctrl+C' },
      { id: 'rename', label: '重命名' },
    ],
  },
  { id: 'separator', type: 'separator' },
  {
    id: 'delete-section',
    type: 'button',
    item: {
      id: 'delete',
      label: '删除',
      danger: true,
      confirmMessage: '确定删除当前记录吗？',
    },
  },
];

function openMenu(event) {
  menuPosition.value = { x: event.clientX, y: event.clientY };
  menuVisible.value = true;
}

async function beforeSelect(item) {
  if (!item.confirmMessage) return true;
  return AuMessageBox.confirm({
    title: '请确认',
    message: item.confirmMessage,
    confirmButtonType: 'danger',
  });
}

function runCommand(item) {
  AuMessage.success(`已执行：${item.label}`);
}
</script>

<template>
  <div @contextmenu.prevent="openMenu">在这里点击右键</div>
  <AuContextMenu
    v-model="menuVisible"
    :items="menuSections"
    :position="menuPosition"
    :before-select="beforeSelect"
    @select="runCommand"
  />
</template>
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
