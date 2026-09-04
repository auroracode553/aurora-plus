# Aurora Plus npm 发布指南

本文面向 Aurora Plus 维护者，说明如何手动构建并发布 `ui` 目录中的组件库。所有命令均为手动执行说明，不会自动安装依赖、构建或发布。

## 先看结论

- 在仓库的 `ui` 目录执行组件库的构建、包检查和 `npm publish`。
- 发布前必须执行 `npm run build`。当前包的 UI、图标、CSS 和 CommonJS 入口全部指向 `dist/`，而 `npm publish` 不会根据现有脚本自动运行 `npm run build`。
- 不要在仓库根目录或 `vitepress` 目录执行 `npm publish`。根目录没有待发布包的 `package.json`，`vitepress` 是独立的文档站包。
- 当前 npm 包名是 `aurora-plus`，版本是 `0.1.0`。截至 2026-09-02，npm 公共仓库查询该包名返回 `E404 Not Found`；名称在正式发布前仍可能被其他账号注册。

## 当前发布配置

`ui/package.json` 中与发布直接相关的配置如下：

| 配置 | 当前值 | 作用 |
| --- | --- | --- |
| `name` | `aurora-plus` | npm 包名 |
| `version` | `0.1.0` | 待发布版本 |
| `main` | `./dist/aurora-plus.cjs` | UI 的 CommonJS 入口 |
| `module` | `./dist/aurora-plus.js` | ES Module 入口 |
| `style` | `./dist/aurora-plus.css` | 样式入口 |
| `exports["./icons"]` | `./dist/icons.js` / `./dist/icons.cjs` | 独立图标入口，分别供 ES Module 与 CommonJS 使用 |
| `files` | `dist`、`README.md`、`THIRD_PARTY_NOTICES.md` | 实际进入 npm 包的文件及内联图标的第三方许可证声明 |
| `peerDependencies` | `vue >=3.3.0` | 由使用者项目提供 Vue |
| `devDependencies` 中的 `@tabler/icons-vue` | `3.46.0` | 仅供构建使用；图标实现会内联到发布产物，不成为使用者的安装依赖 |
| `repository` | `github.com/auroracode553/aurora-plus` | npm 包页面关联的源码仓库 |
| `homepage` | Aurora Plus GitHub Pages | npm 包页面的使用文档入口 |
| `bugs` | GitHub Issues | 问题反馈入口 |
| `publishConfig` | npm 官方仓库、公开访问 | 固定发布目标和访问级别 |

构建命令会根据 `ui/vite.config.js` 生成 UI 与图标两组 JavaScript 入口及样式文件。Tabler 图标实现会内联到这些产物，使用者只需安装 `aurora-plus`；Vue 仍作为 peer dependency 由使用者项目提供。多入口使用 ES Module 与 CommonJS 格式，不再生成 UMD 文件。由于发布清单只包含 `dist`、`README.md` 和 `THIRD_PARTY_NOTICES.md`，如果不先构建，发布包可能缺少入口文件；如果 `dist` 是旧产物，则可能发布旧代码。

## 第一步：再次确认包名和账号

正式发布前重新查询 `aurora-plus`，避免包名在准备期间被其他账号注册：

```powershell
npm view aurora-plus name version dist-tags --json
npm whoami
```

如果第一条命令仍返回 `E404 Not Found`，说明查询时 npm 公共仓库中没有该包。若已经返回包信息，则必须确认当前账号拥有发布权限，或者改用另一个未注册的包名。

## 第二步：准备发布环境

进入组件库目录：

```powershell
cd .\ui
```

确认 npm 使用官方仓库并登录正确账号：

```powershell
npm config get registry
npm login
npm whoami
```

官方 registry 应为：

```text
https://registry.npmjs.org/
```

依赖需要由维护者手动安装。已有正确且完整的 `node_modules` 时不必重复安装；需要按锁文件重新安装时，可手动执行：

```powershell
npm ci
```

## 第三步：手动构建

仍在 `ui` 目录执行：

```powershell
npm run build
```

构建完成后，至少确认以下文件存在且来自本次构建：

```text
ui/dist/aurora-plus.js
ui/dist/aurora-plus.cjs
ui/dist/aurora-plus.css
ui/dist/icons.js
ui/dist/icons.cjs
```

本项目当前没有 `prepublishOnly` 或 `prepare` 自动构建脚本，因此不能依赖 `npm publish` 帮你完成这一步。

## 第四步：检查将要发布的内容

先执行 npm 的发布清单预检，它不会把包发布到仓库：

```powershell
npm pack --dry-run
```

检查输出时重点确认：

- 包名和版本正确。
- 五个 `dist` 入口文件均在清单中。
- `README.md` 在清单中。
- `THIRD_PARTY_NOTICES.md` 在清单中。
- 没有包含源码密钥、私有配置或其他不应公开的文件。

还可以让 npm 只模拟发布流程：

```powershell
npm publish --dry-run --access public
```

## 第五步：正式发布

确认包名、版本、账号、构建产物和预检结果都正确后，在 `ui` 目录手动执行：

```powershell
npm publish --access public
```

如果 npm 账号启用了双因素认证，按终端提示完成一次性验证码验证。不要把 npm token、验证码或 `.npmrc` 中的认证信息提交到仓库。

## 第六步：发布后验证

```powershell
npm view aurora-plus name version dist-tags --json
```

也可以在一个与本仓库无关的临时 Vue 3 项目中手动安装该版本，确认以下公共入口均可解析：

```js
import AuroraPlus from 'aurora-plus';
import { IconSearch } from 'aurora-plus/icons';
import 'aurora-plus/style.css';
```

## 后续版本发布

每次发布都必须使用未发布过的 SemVer 版本号：

- 修复且保持兼容：递增 patch，例如 `0.1.0` → `0.1.1`。
- 新增且保持兼容：递增 minor，例如 `0.1.0` → `0.2.0`。
- 包含不兼容变更：递增 major，例如 `1.0.0` → `2.0.0`。

每次发布都重复“修改版本 → 构建 → 预检 → 正式发布 → 远端验证”的流程。npm 已发布的同名同版本不可覆盖；发现问题时应修复后发布新版本。

## 常见错误

| 错误 | 常见原因 | 处理方式 |
| --- | --- | --- |
| `403 Forbidden` | 包名已被其他账号注册，或账号/组织策略阻止发布 | 检查 `npm whoami` 和包信息；无权限时改用其他名称或自己的 scope |
| `You cannot publish over the previously published versions` | 版本号已存在 | 同步更新 `package.json` 与 `package-lock.json` 为新的合法版本 |
| `ENEEDAUTH` | 尚未登录或 token 失效 | 重新执行 `npm login`，再用 `npm whoami` 确认 |
| 安装后找不到 JS 或 CSS | 未构建、产物过期，或发布清单缺文件 | 重新构建，并在发布前检查 `npm pack --dry-run` 输出 |
| 发布后其他人无法安装 | 包访问级别或组织策略配置错误 | 检查 npm 包页面的访问设置，并使用公开发布参数 |
