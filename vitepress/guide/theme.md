<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import MaterialPreview from '../.vitepress/theme/examples/theme/MaterialPreview.vue';
import materialPreviewSource from '../.vitepress/theme/examples/theme/MaterialPreview.vue?demo-source';
</script>

# 主题定制

Aurora UI 使用 CSS 变量提供主题能力。

## 暗色模式

以下三种方式均可启用暗色变量：

```html
<html class="dark"></html>
<html data-theme="dark"></html>
<html data-au-theme="dark"></html>
```

其中 `.dark` 和 `data-theme` 适合应用级主题切换，`data-au-theme` 可用于独立使用 Aurora UI 的项目或局部容器。

## 玻璃材质

Aurora UI 的浮层、卡片、按钮组、消息和菜单会读取根节点上的 `data-au-material`：

```html
<html data-au-material="soft"></html>
```

可选材质如下：

| 值 | 视觉特征 | 适用场景 |
| --- | --- | --- |
| `soft` | 柔和、低对比、轻模糊 | 日常工作台和内容型页面 |
| `clear` | 清透、高饱和、背景层次明显 | 需要突出玻璃质感的首页或仪表盘 |
| `solid` | 不透明、边界清晰 | 信息密集或对比度要求高的页面 |

### 交互预览

下面的示例可以直接切换材质，观察同一组组件在不同透明度、模糊和背景层级下的变化：

<DemoBlock
  title="材质切换预览"
  description="选择柔和、清透或实色，预览局部容器内组件的材质效果。"
  :source="materialPreviewSource"
>
  <MaterialPreview />
</DemoBlock>

### 全局配置

在安装组件库时传入 `material`，即可为整个应用设置默认材质：

```js
import { createApp } from 'vue';
import AuroraUI from 'aurora-ui';
import App from './App.vue';

createApp(App).use(AuroraUI, { material: 'clear' }).mount('#app');
```

运行时可通过 `setAuroraMaterial` 切换全局材质。传入无效值时不会修改当前设置：

```js
import { getAuroraMaterial, setAuroraMaterial } from 'aurora-ui';

setAuroraMaterial('soft');
console.log(getAuroraMaterial()); // soft
```

### 局部配置

将 `data-au-material` 放在任意容器上，只影响该容器内的 Aurora UI 组件：

```vue
<section data-au-material="clear">
  <AuCard>清透材质只作用于这个区域</AuCard>
</section>
```

也可以覆盖材质变量，微调透明度、边框和模糊强度。覆盖应放在 `aurora-ui/style.css` 之后：

```css
.dashboard-shell {
  --au-material-bg: rgba(255, 255, 255, 0.58);
  --au-material-bg-strong: rgba(255, 255, 255, 0.76);
  --au-material-border: rgba(255, 255, 255, 0.64);
  --au-material-blur: 20px;
  --au-material-saturation: 140%;
}
```

### 材质变量

以下变量可以在根节点或局部容器上覆盖：

| 变量 | 默认值 | 作用 |
| --- | --- | --- |
| `--au-material-bg` | `rgba(255, 255, 255, 0.68)` | 普通材质表面 |
| `--au-material-bg-strong` | `rgba(255, 255, 255, 0.82)` | 弹层和强调表面 |
| `--au-material-bg-subtle` | `rgba(255, 255, 255, 0.42)` | 次级表面 |
| `--au-material-border` | `rgba(255, 255, 255, 0.68)` | 材质边框 |
| `--au-material-border-strong` | `rgba(116, 137, 172, 0.28)` | 强调边框和分隔线 |
| `--au-material-blur` | `18px` | 背景模糊半径 |
| `--au-material-saturation` | `145%` | 背景饱和度 |

## 颜色变量

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `--au-color-primary` | `#3478f6` | 品牌与主要动作 |
| `--au-color-success` | `#2f9e72` | 成功状态 |
| `--au-color-warning` | `#d98a24` | 警告状态 |
| `--au-color-danger` | `#df4c62` | 危险状态 |
| `--au-color-info` | `#718096` | 中性信息状态 |
| `--au-color-text-primary` | `#172033` | 标题与主要文本 |
| `--au-color-text-regular` | `#3e4a61` | 正文文本 |
| `--au-color-text-secondary` | `#6d7890` | 辅助文本 |
| `--au-color-text-placeholder` | `#99a3b5` | 占位文本 |
| `--au-color-text-disabled` | `#b5bdca` | 禁用文本 |
| `--au-color-bg` | `#f5f7fb` | 页面及组件背景 |
| `--au-color-bg-overlay` | `#ffffff` | 弹层背景 |
| `--au-color-bg-soft` | `#edf1f8` | 柔和区域背景 |
| `--au-color-bg-hover` | `rgba(31, 44, 68, 0.07)` | 悬停背景 |
| `--au-color-mask` | `rgba(18, 27, 45, 0.42)` | 模态遮罩 |
| `--au-color-border` | `rgba(105, 123, 154, 0.3)` | 常规边框 |
| `--au-color-border-light` | `rgba(105, 123, 154, 0.2)` | 较浅边框 |
| `--au-color-border-lighter` | `rgba(105, 123, 154, 0.13)` | 最浅分隔线 |

## 尺寸、阴影与层级

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `--au-border-radius-small` | `4px` | 小型控件圆角 |
| `--au-border-radius-base` | `6px` | 常规控件圆角 |
| `--au-border-radius-large` | `12px` | 容器圆角 |
| `--au-font-family` | 系统字体栈 | 组件字体 |
| `--au-font-size-small` | `12px` | 小号文字 |
| `--au-font-size-base` | `14px` | 正文与控件文字 |
| `--au-font-size-large` | `16px` | 大号控件文字 |
| `--au-virtual-list-padding-block` | `4px` | VirtualList 上下内边距 |
| `--au-virtual-list-padding-inline` | `6px` | VirtualList 左右内边距 |
| `--au-shadow-control` | 控件阴影 | Button、Checkbox、Switch |
| `--au-shadow-surface` | 表面阴影 | Card、VirtualList、ButtonGroup |
| `--au-shadow-overlay` | 浮层阴影 | Message、Tooltip、菜单、工具条和 Dialog |
| `--au-focus-ring-color` | 主色半透明 | 键盘焦点轮廓颜色 |
| `--au-focus-ring-width` | `2px` | 键盘焦点轮廓宽度 |
| `--au-focus-ring-offset` | `2px` | 键盘焦点轮廓偏移 |
| `--au-transition-duration` | `0.2s` | 通用过渡时长 |
| `--au-transition-ease` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | 通用过渡曲线 |
| `--au-z-index-toolbar` | `9000` | 浮动工具条建议层级 |
| `--au-z-index-dialog` | `10000` | 对话框层级 |
| `--au-z-index-message` | `11000` | 消息层级 |
| `--au-z-index-tooltip` | `12000` | 文字提示层级 |

## 覆盖变量

```css
:root {
  --au-color-primary: #7c3aed;
  --au-color-bg-soft: #faf5ff;
  --au-border-radius-base: 8px;
  --au-font-family: Inter, "PingFang SC", sans-serif;
}
```

覆盖应放在 `aurora-ui/style.css` 之后，确保同等选择器权重下由业务主题生效：

```js
import 'aurora-ui/style.css';
import './styles/brand-theme.css';
```

## 局部主题

`data-au-theme="dark"` 也可放在局部容器上，让容器内的 Aurora UI 组件读取暗色变量：

```html
<section data-au-theme="dark">
  <!-- 此区域内的 Aurora UI 组件使用暗色变量 -->
</section>
```

命令式服务和默认 Teleport 到 `body` 的组件不在该局部容器内，需使用根节点主题，或为支持的组件配置 `teleported="false"` / `append-to`。
