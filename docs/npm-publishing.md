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

已有完整依赖时可跳过 `npm ci`。包入口指向 `dist/`，发布不会自动生成产物；预检清单应包含 UI、图标的 ES Module / CommonJS 文件、CSS、README 和第三方许可证声明。

发布后核对版本：

```powershell
npm view aurora-plus name version dist-tags --json
```
