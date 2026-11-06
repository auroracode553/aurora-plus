# Aurora Plus npm 发布

发布目录为 `ui/`。包名、版本、入口和发布范围以 `ui/package.json` 为准，依赖使用现有锁文件。

## 手动发布

在 `ui` 目录核对账号、包信息与仓库地址：

```powershell
npm whoami
npm config get registry
npm view aurora-plus name version dist-tags --json
```

使用有发布权限的账号及尚未发布的版本号。需要登录时执行 `npm login`。

```powershell
npm ci
npm run build
npm pack --dry-run
npm publish --dry-run --access public
npm publish --access public
```

已有完整依赖时可跳过 `npm ci`。包入口指向 `dist/`，发布不会自动生成产物；预检清单应包含 UI、图标及 Electron 适配器的 ES Module / CommonJS 文件、CSS、README 和第三方许可证声明。`aurora-plus/electron` 独立保留 Electron 外部依赖，普通组件与文档站不加载该入口。

库构建保留模块边界，主入口、图标入口和 Electron 入口的导出保持不变。Tabler 图标的创建调用没有纯函数标记；如果先把所有图标合成一个大模块，使用方只导入少数图标时也可能保留全部创建调用。独立模块配合现有 `sideEffects` 声明，让使用方按实际导入裁剪未使用的图标和组件，不需要改用库源码或安装额外图标依赖。

内联第三方模块输出到 `dist/vendor/`，不得输出到嵌套 `node_modules/`，以免 npm 打包时自动排除；模块之间的相对引用由构建器生成。`npm pack --dry-run` 应确认 `dist/vendor/`、`dist/src/` 和 `dist/_virtual/` 的 ES Module / CommonJS 文件都包含在发布清单中。升级构建工具后核对三个公开入口的导出、ES Module / CommonJS 导入及实际使用方的摇树结果，不能只比较库自身产物大小。

发布后核对版本：

```powershell
npm view aurora-plus name version dist-tags --json
```
