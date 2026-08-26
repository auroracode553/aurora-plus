# Aurora UI

Aurora UI 是从 Aurora Editor 中拆出的 Vue 3 通用组件库。首个版本聚焦桌面端与 Web 管理界面常用的基础交互，公共 API 使用 `Au` 前缀，设计方式参考 Element Plus 的“完整安装 + 按需导入 + 命令式服务”。

## 当前组件

| 导出 | 用途 | 来源 |
| --- | --- | --- |
| `AuButton` | 多类型、多尺寸、加载态按钮 | `XButton.vue` |
| `AuButtonGroup` | `connected` 连体按钮组与 `floating` 悬浮控制组 | 通用控制组 |
| `AuSwitch` | 二元状态切换开关 | 通用开关 |
| `AuCheckbox` | 布尔值、数组和半选状态复选框 | 通用复选框 |
| `AuDropdown` | 带视口避让和键盘导航的下拉菜单 | 通用下拉菜单 |
| `AuCard` | 带玻璃质感的空卡片容器 | 通用卡片 |
| `AuIcon` | Tabler 图标组件的尺寸、颜色与无障碍外壳 | `AuIcon.vue` |
| `AuTooltip` | 自动翻转、视口避让的提示气泡 | `XTooltip.vue` |
| `AuDialog` | 模态对话框壳、焦点和滚动管理 | `BaseDialog.vue` |
| `AuVirtualList` | 固定行高虚拟列表 | `VirtualScrollList.vue` |
| `AuContextMenu` | 配置式右键菜单 | `ContextMenu.vue` |
| `AuFloatingToolbar` | 锚点浮动工具条 | `FloatingToolbar.vue` |
| `AuMessage` | 命令式消息提示 | `toast.js` |
| `AuMessageBox` | Promise 风格确认框 | `confirm.js` |

## 依赖

运行时依赖：

- Vue `>= 3.3.0`
- `@tabler/icons-vue` `^3.46.0`（随 Aurora UI 自动安装）

在业务项目中安装 `aurora-ui` 时，请同时安装满足版本要求的 Vue。Tabler 图标属于 Aurora UI 的运行时依赖，无需单独安装：

```bash
npm install aurora-ui vue
```

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

## 使用 Tabler 图标

Aurora UI 不再维护字符串图标注册表。Tabler 图标由组件库统一导出，将图标组件本身传给 `AuIcon` 或其他接受图标的 Aurora 组件：

```vue
<script setup>
import { AuButton, AuIcon, IconBold, IconHeart } from 'aurora-ui';
</script>

<template>
  <AuButton :icon="IconBold">加粗</AuButton>
  <AuIcon :icon="IconHeart" size="24" color="var(--au-color-danger)" aria-label="收藏" />
</template>
```

完整图标清单与组件名请参阅 [Icon 图标文档](../vitepress/components/icon.md) 或 [Tabler Icons 目录](https://tabler.io/icons)。

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
  padding: 0 10px;
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

业务项目可以覆盖 `--au-*` CSS 变量定制颜色、圆角、字体、阴影和层级，完整变量见[主题文档](../vitepress/guide/theme.md)。

## 玻璃材质

组件默认使用柔和（`soft`）材质。完整安装时可以选择清透（`clear`）或实色（`solid`）：

```js
import AuroraUI from 'aurora-ui';

app.use(AuroraUI, { material: 'clear' });
```

运行时也可以切换全局材质，或通过 `data-au-material` 只覆盖某个容器：

```js
import { setAuroraMaterial } from 'aurora-ui';

setAuroraMaterial('soft');
```

```html
<section data-au-material="solid">
  <!-- 该区域内的 Aurora UI 组件使用实色材质 -->
</section>
```

可选值：`soft`（柔和）、`clear`（清透）、`solid`（实色）。系统开启减少透明度或高对比度后，组件会自动使用更清晰的表面。

材质常量和读取方法也可以直接使用：

```js
import { AURORA_MATERIALS, getAuroraMaterial } from 'aurora-ui';

console.log(AURORA_MATERIALS); // ['soft', 'clear', 'solid']
console.log(getAuroraMaterial());
```

如需微调材质，只覆盖对应容器上的 CSS 变量即可：

```css
.dashboard-shell {
  --au-material-bg: rgba(255, 255, 255, 0.58);
  --au-material-bg-strong: rgba(255, 255, 255, 0.76);
  --au-material-border: rgba(255, 255, 255, 0.64);
  --au-material-blur: 20px;
  --au-material-saturation: 140%;
}
```

材质不会添加高光渐变或内发光，仅调整表面透明度、模糊、饱和度和边框；组件阴影使用统一的控件、表面和浮层层级。
