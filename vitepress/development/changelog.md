# 更新记录

## 0.1.0

- 从 Aurora Editor 抽离 8 个通用 Vue 组件。
- 新增 `AuMessage` 和 `AuMessageBox` 命令式反馈服务。
- 新增完整安装、按需导入、SVG 注册和 TypeScript 声明。
- 新增明暗主题与 `--au-*` 设计变量。
- 使用 VitePress 合并组件实时预览、使用指南和开发文档。
- 将文档站拆分为完全独立的 npm package，分别管理依赖、锁文件和脚本。
- 重构组件文档为独立页面，补齐 Attributes、Events、Slots、Exposes 和数据结构说明。
- 示例改由真实 `.vue` 文件同时驱动预览与完整源码展示，复杂数据示例默认展开并支持复制。
- 示例源码使用 Shiki 在构建阶段生成 Vue 语法高亮，并随 VitePress 明暗主题自动切换颜色。
