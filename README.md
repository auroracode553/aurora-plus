# Aurora UI 仓库

本仓库由两个相互独立的目录组成：`ui/` 是 Vue 3 组件库，`vitepress/` 是组件文档站。仓库根目录不作为 npm package，也不使用 workspace。

## 目录

```text
aurora-ui/
├─ ui/          Aurora UI 组件库
├─ vitepress/   Aurora UI 文档站
├─ README.md    仓库级说明
└─ .gitignore   仓库级忽略规则
```

| 目录 | 职责 | 详细说明 |
| --- | --- | --- |
| `ui/` | 组件、服务、主题、类型声明与组件库构建 | [UI README](./ui/README.md) |
| `vitepress/` | 使用指南、组件文档、实时示例与文档站构建 | [VitePress README](./vitepress/README.md) |

## 独立管理

两个目录各自拥有 `package.json`、`package-lock.json`、`node_modules` 和 npm scripts。在一个目录中安装或更新依赖，不会改写另一个目录的锁文件。

手动安装依赖：

```powershell
cd D:\my_project\front-sdk\aurora-ui\ui
npm install

cd ..\vitepress
npm install
```

常用命令：

| 执行目录 | 命令 | 用途 |
| --- | --- | --- |
| `ui/` | `npm run build` | 构建组件库到 `ui/dist/` |
| `vitepress/` | `npm run dev` | 启动文档开发服务 |
| `vitepress/` | `npm run build` | 构建文档站 |
| `vitepress/` | `npm run preview` | 预览文档构建产物 |

依赖安装和命令执行均由使用者手动完成。
