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

库构建通过 `preserveModules: true` 保留模块边界，主入口、图标入口和 Electron 入口的公开导出保持不变，入口文件名仍为 `aurora-plus.js/.cjs`、`icons.js/.cjs` 和 `electron.js/.cjs`。Tabler 图标的创建调用没有纯调用标记，因此保留独立图标模块，配合包内现有 `sideEffects` 声明，让消费方按实际具名导入跳过未使用的模块，无需额外的图标转换插件。CSS、SCSS 和 Vue 的副作用声明继续保留。

内联依赖的输出路径中，`node_modules/` 映射为 `vendor/`，避免 npm 自动排除嵌套依赖目录；模块间相对引用由构建器生成。包发布范围包含整个 `dist/`，`npm pack --dry-run` 应确认三个公开入口、入口引用的独立模块及 CSS 均在发布清单中。发布包包含完整图标不代表消费方生产包包含全部图标。

图标公开入口保留全部具名图标及已有目录导出，不维护调用方的图标白名单。消费方具名导入时，由最终应用的真实摇树过程去除未使用的图标模块和目录对象；UI 完整安装只引用各组件实际需要的内部图标，不引用全量图标集合。显式消费 `icons`、`iconsList` 或动态枚举完整命名空间时，整套目录本身就是实际使用范围，不能将其当作少量具名导入验收。

升级 Tabler 或构建工具后须复核独立模块边界、发布清单中的依赖路径，以及三个公开入口的 ES Module / CommonJS 导出和实际调用。消费侧生产构建至少比较单个图标、多个具名图标、UI 完整安装加少量图标三种真实入口：所选图标与 UI 内部实际使用的图标保留，无关的普通/填充图标与完整目录不得因入口导出而留在应用中；公共导出完整不等于应用必须包含全部实现。仅比较库产物大小或文件数不能代替最终应用生产产物的摇树验收。

发布后核对版本：

```powershell
npm view aurora-plus name version dist-tags --json
```
