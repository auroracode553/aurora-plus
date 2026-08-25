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

## 常用设计变量

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `--au-color-primary` | `#409eff` | 品牌与主要动作 |
| `--au-color-success` | `#67c23a` | 成功状态 |
| `--au-color-warning` | `#e6a23c` | 警告状态 |
| `--au-color-danger` | `#f56c6c` | 危险状态 |
| `--au-color-bg` | `#ffffff` | 页面及组件背景 |
| `--au-color-bg-overlay` | `#ffffff` | 弹层背景 |
| `--au-color-text-primary` | `#303133` | 主要文本 |
| `--au-color-border` | `#dcdfe6` | 常规边框 |
| `--au-border-radius-base` | `6px` | 基础圆角 |
| `--au-font-family` | 系统字体栈 | 组件字体 |
| `--au-z-index-dialog` | `10000` | 对话框层级 |

## 覆盖变量

```css
:root {
  --au-color-primary: #7c3aed;
  --au-border-radius-base: 8px;
  --au-font-family: Inter, "PingFang SC", sans-serif;
}
```

完整变量位于组件库包的 `src/theme/index.css`。
