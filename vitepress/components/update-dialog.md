<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import UpdateCheck from '../.vitepress/theme/examples/update-dialog/UpdateCheck.vue';
import updateCheckSource from '../.vitepress/theme/examples/update-dialog/UpdateCheck.vue?demo-source';
import UpdateAvailable from '../.vitepress/theme/examples/update-dialog/UpdateAvailable.vue';
import updateAvailableSource from '../.vitepress/theme/examples/update-dialog/UpdateAvailable.vue?demo-source';
import UpdateRecovery from '../.vitepress/theme/examples/update-dialog/UpdateRecovery.vue';
import updateRecoverySource from '../.vitepress/theme/examples/update-dialog/UpdateRecovery.vue?demo-source';
import UpdateSources from '../.vitepress/theme/examples/update-dialog/UpdateSources.vue';
import updateSourcesSource from '../.vitepress/theme/examples/update-dialog/UpdateSources.vue?demo-source';
</script>

# UpdateDialog 更新对话框

展示检查、下载与安装状态，通过受控属性更新界面，通过事件通知操作。

## 检查更新

<DemoBlock title="检查、已是最新与检查失败" :source="updateCheckSource">
  <UpdateCheck />
</DemoBlock>

## 发现新版本与下载

<DemoBlock title="版本说明、下载进度与安装" :source="updateAvailableSource">
  <UpdateAvailable />
</DemoBlock>

## 未知进度与失败重试

<DemoBlock title="连接中与下载重试" :source="updateRecoverySource">
  <UpdateRecovery />
</DemoBlock>

## 更新源

`source` 表示选择偏好，`active-source` 表示当前操作实际使用的源；空 `source` 表示自动选择。

<DemoBlock title="并行检查、备用源与失败结果" :source="updateSourcesSource">
  <UpdateSources />
</DemoBlock>

检查中、下载中、下载完成、安装中及安装失败阶段禁止切换源。

### UpdateSource

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| id | 必填、唯一、非空的源标识 | string |
| name | 展示名称，未传时显示 id | string |
| status | pending / checking / success / ready / available / latest / not-available / error；默认 pending | string |
| version | 该源最近读取到的版本 | string |
| message | 提示文字；悬停可查看，手动选中时在列表下方展示 | string |
| disabled | 该源不可选择；默认 false | boolean |
| active | 实际使用标记；未传 active-source 时从该标记获取源标识 | boolean |

全部源禁用或指定的源已不存在时，检查按钮不可用。

源状态 `ready` 表示已发现新版本；对话框状态 `ready` 表示下载完成。`not-available` 表示该源没有可更新版本。

## 操作语义

`check`、`download`、`install`、`retry` 只发出事件，不自动改变 `status`。`cancel`、`later`、`skip` 同时关闭窗口；关闭按钮、Escape 和实例 `close()` 只关闭窗口。

更新说明为普通文本，自定义内容使用 `release-notes` 插槽。

## UpdateDialog API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 是否显示 | boolean | false |
| status | 当前更新状态，见下表 | string | idle |
| title | 对话框顶部标题 | string | 软件更新 |
| width | 宽度，数字按 px 处理，受视口约束 | string / number | 480 |
| appName | 应用名称 | string | '' |
| description | 替换当前状态的说明文字 | string | '' |
| currentVersion | 当前版本，按原样展示 | string | '' |
| latestVersion | 最新版本，按原样展示 | string | '' |
| channel | 版本渠道标签，如稳定版 | string | '' |
| releaseDate | 发布时间的展示文本 | string | '' |
| releaseNotes | 分组更新说明 | UpdateReleaseNote[] | [] |
| releaseUrl | 完整更新说明链接，在新窗口打开 | string | '' |
| progress | 下载百分比；null 表示未知进度 | number / null | null |
| progressText | 自定义检查、下载或安装进度文案 | string | '' |
| downloadSize | 更新文件总大小的展示文本 | string | '' |
| downloadedSize | 已下载大小的展示文本 | string | '' |
| downloadSpeed | 下载速度的展示文本 | string | '' |
| errorStage | 失败阶段：check / download / install | string | check |
| errorMessage | 失败详情 | string | '' |
| showAutoCheck | 显示自动检查选项 | boolean | false |
| autoCheck / v-model:auto-check | 自动检查选项值 | boolean | false |
| showSkip | 发现新版本时显示跳过操作 | boolean | false |
| sources | 更新源展示列表；不传时隐藏源区域 | UpdateSource[] | [] |
| source / v-model:source | 指定的更新源标识；空字符串表示自动选择 | string | '' |
| activeSource | 当前任务实际使用的源标识，优先于源列表 active 标记 | string | '' |
| sourceSelectable | 是否允许手动选择源 | boolean | true |
| sourceDisabled | 额外禁止切换源 | boolean | false |

其余 `AuDialog` 属性同样适用，例如 `append-to-body`、`lock-scroll`、`show-close`、`close-on-press-escape`、`close-on-click-modal`、`max-height` 与 `z-index`。

### Status

| 值 | 界面 | 默认操作 |
| --- | --- | --- |
| idle | 检查入口与当前版本 | 关闭、检查更新 |
| checking | 检查中与循环进度 | 取消检查 |
| available | 新版本、发布信息与更新说明 | 稍后提醒、下载更新，可选跳过 |
| latest | 当前版本已是最新 | 关闭、再次检查 |
| downloading | 更新说明与下载进度 | 取消下载 |
| ready | 下载完成与安装提示 | 稍后提醒、安装更新 |
| installing | 安装中与循环进度 | 关闭、禁用的安装按钮 |
| error | 失败原因及对应阶段 | 关闭、重新检查 / 下载 / 安装 |

### UpdateReleaseNote

```js
const releaseNotes = [
  { title: '新增功能', items: ['支持专注模式。', '增加常用文档快捷入口。'] },
  { title: '问题修复', items: ['修复切换工作区时丢失滚动位置的问题。'] },
];
```

`title` 为可选分组标题，`items` 为该组的字符串数组。

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 请求关闭窗口 | false |
| update:autoCheck | 自动检查选项变化 | boolean |
| update:source | 请求切换选中的源 | id: string |
| source-change | 用户切换源；空 id 表示自动选择 | (id: string, previousId: string) |
| check | 请求检查更新 | context: UpdateSourceContext |
| download | 请求下载新版本 | (latestVersion: string, context: UpdateSourceContext) |
| install | 请求安装新版本 | latestVersion: string |
| retry | 请求重试失败阶段 | (stage: 'check' / 'download' / 'install', context: UpdateSourceContext) |
| cancel | 请求取消检查或下载，同时关闭 | 'checking' / 'downloading' |
| later | 请求稍后提醒，同时关闭 | 'available' / 'ready' |
| skip | 请求跳过此版本，同时关闭 | latestVersion: string |
| open / opened | 开始打开 / 打开过渡完成 | — |
| close | 内部关闭窗口 | reason: string |
| closed | 关闭过渡完成 | — |

操作按钮产生的关闭原因为 `cancel`、`later`、`skip` 或 `dismiss`，其余原因沿用 `AuDialog`。

`UpdateSourceContext` 为 `{ source: string, activeSource: string }`；未配置源时两字段均为空字符串。

### Slots

| 插槽 | 作用域参数 | 说明 |
| --- | --- | --- |
| icon | { status } | 替换状态图标，可放置应用图标 |
| release-notes | { version, notes } | 替换更新说明正文 |
| default | { status } | 补充正文，如安装提示 |
| sources | { sources, source, activeSource, disabled, select } | 替换整个源区域；sources 为整理后的展示字段，select(id) 遵循任务锁定规则，select('') 请求自动选择 |
| footer | { status, close, check, download, install, retry, cancel, later, skip } | 替换操作区；业务操作方法只在对应状态发出事件 |

### Exposes

| 方法或属性 | 说明 |
| --- | --- |
| close(reason?) | 关闭窗口，默认原因为 api |
| dialogRef | 内部 AuDialog 实例引用 |
