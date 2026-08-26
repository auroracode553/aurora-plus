# 主题定制

Aurora UI 使用 CSS 变量提供主题能力，不要求额外的主题运行时。

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
| `soft` | 柔和、低对比、轻模糊 | 日常工作台和内容型页面（默认） |
| `clear` | 清透、高饱和、背景层次明显 | 需要突出玻璃质感的首页或仪表盘 |
| `solid` | 不透明、边界清晰 | 信息密集或对比度要求高的页面 |

也可以在 `app.use(AuroraUI, { material: 'clear' })` 时初始化，或调用 `setAuroraMaterial('soft')` 运行时切换。将 `data-au-material` 放在任意容器上，可只覆盖该容器内的组件。

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
| `--au-shadow-light` | 轻量阴影 | Tooltip、Message、工具条 |
| `--au-shadow-overlay` | 弹层阴影 | Dialog 等大型浮层 |
| `--au-transition-duration` | `0.18s` | 通用过渡时长 |
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

命令式服务和默认 Teleport 到 `body` 的组件不在该局部容器内，需使用根节点主题，或为支持的组件配置 `teleported="false"` / `append-to`。完整变量源码位于组件库包的 `src/theme/index.css`。
