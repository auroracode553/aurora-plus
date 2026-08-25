# 主题定制

Aurora UI 使用 CSS 变量提供主题能力，不要求额外的主题运行时。

## 暗色模式

以下三种方式均可启用暗色变量：

```html
<html class="dark"></html>
<html data-theme="dark"></html>
<html data-au-theme="dark"></html>
```

其中 `.dark` 用于兼容 VitePress，`data-theme` 与 Aurora Editor 现有约定一致，`data-au-theme` 适合独立使用 Aurora UI 的项目。

## 颜色变量

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `--au-color-primary` | `#409eff` | 品牌与主要动作 |
| `--au-color-success` | `#67c23a` | 成功状态 |
| `--au-color-warning` | `#e6a23c` | 警告状态 |
| `--au-color-danger` | `#f56c6c` | 危险状态 |
| `--au-color-info` | `#909399` | 中性信息状态 |
| `--au-color-text-primary` | `#303133` | 标题与主要文本 |
| `--au-color-text-regular` | `#606266` | 正文文本 |
| `--au-color-text-secondary` | `#909399` | 辅助文本 |
| `--au-color-text-placeholder` | `#a8abb2` | 占位文本 |
| `--au-color-text-disabled` | `#c0c4cc` | 禁用文本 |
| `--au-color-bg` | `#ffffff` | 页面及组件背景 |
| `--au-color-bg-overlay` | `#ffffff` | 弹层背景 |
| `--au-color-bg-soft` | `#f5f7fa` | 柔和区域背景 |
| `--au-color-bg-hover` | `#f2f3f5` | 悬停背景 |
| `--au-color-mask` | `rgba(0, 0, 0, 0.38)` | 模态遮罩 |
| `--au-color-border` | `#dcdfe6` | 常规边框 |
| `--au-color-border-light` | `#e4e7ed` | 较浅边框 |
| `--au-color-border-lighter` | `#ebeef5` | 最浅分隔线 |

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
