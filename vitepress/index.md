---
layout: home

hero:
  name: Aurora UI
  text: Vue 3 通用组件库
  tagline: 从 Aurora Editor 的真实界面中抽离，保持轻量、低耦合和可组合。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 浏览组件
      link: /components/overview

features:
  - title: 真实业务沉淀
    details: 组件来自 Aurora Editor 的实际交互，再收敛为不依赖 Electron、Pinia 和业务 Store 的公共 API。
  - title: 文档即预览
    details: VitePress 直接挂载真实示例文件，同一份源码同时用于交互预览、完整代码展示和复制。
  - title: 灵活引入
    details: 支持完整插件安装、组件按需导入、命令式反馈服务和 TypeScript 类型声明。
  - title: 主题可定制
    details: 使用 au- 前缀与 --au-* 设计变量，兼容 data-theme、data-au-theme 和 VitePress 暗色模式。
---

<div class="home-intro">

## 当前版本

Aurora UI `0.1.0` 已包含 8 个组件与 2 个命令式服务。文档包通过开发别名引用组件库的 `src/index.js`，修改组件源码后会热更新到文档页面，同时两个包各自维护依赖与脚本。

</div>
