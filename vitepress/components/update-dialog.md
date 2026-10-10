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

一套覆盖检查更新、发现新版本、下载和安装的应用更新界面。通过 `v-model` 控制显示，通过 `status` 控制状态，自动沿用全局主题和材质。

## 检查更新

`idle` 显示检查入口，`checking` 显示检查进度，`latest` 显示已是最新版本。`show-auto-check` 显示自动检查选项，选项值由 `v-model:auto-check` 控制。

<DemoBlock title="检查、已是最新与检查失败" :source="updateCheckSource">
  <UpdateCheck />
</DemoBlock>

## 发现新版本与下载

通过版本号、发布信息和分组更新说明展示新版本。点击下载时触发 `download`，业务开始下载后将状态切换为 `downloading`，并传入 `progress`。下载完成后设为 `ready`，安装期间设为 `installing`。

<DemoBlock title="版本说明、下载进度与安装" :source="updateAvailableSource">
  <UpdateAvailable />
</DemoBlock>

## 未知进度与失败重试

无法获得下载百分比时，将 `progress` 设为 `null`，组件展示循环进度。失败时设为 `error`，通过 `error-stage` 区分检查、下载或安装失败；`retry` 事件携带该阶段，业务据此重试对应任务。

<DemoBlock title="连接中与下载重试" :source="updateRecoverySource">
  <UpdateRecovery />
</DemoBlock>

## 调用者配置与多源自动检查

更新源由调用者配置，通过 `sources` 传入展示信息，组件不内置平台、仓库或地址配置表单。`source` 默认为空字符串，表示自动检查所有未禁用的源；通过 `v-model:source` 可以手动指定一个源。`active-source` 表示本次检查最终使用的源，与选择偏好分开保存。

<DemoBlock title="并行检查、备用源与失败结果" :source="updateSourcesSource">
  <UpdateSources />
</DemoBlock>

可选的 `useUpdateCheck` 辅助函数接收源配置和调用者提供的 `checkSource`，并行检查各源，等待结果后按配置顺序选择第一个可更新的源。优先源读取失败或没有新版本时，继续使用其他可更新的源；结果不受响应速度影响，也不会自动改为选择版本最高的源。各源独立超时，全部失败时显示失败，至少一个源成功且均无新版本时显示已是最新。

手动指定源时只检查该源，不自动切换到其他源。使用辅助函数时，切换源、修改源配置或当前版本会取消检查并清空旧结果；其他受控接入方式应在 `source-change` 中自行清空旧版本与更新说明，再重新检查。

检查中、下载中、下载完成、安装中及安装失败阶段禁止切换源。`source-disabled` 可额外锁定源区域；`:source-selectable="false"` 可将列表作为只读状态展示，适用于已有更新服务自动决定实际源的应用。

下载时使用 `activeSource` 定位检查结果对应的配置，避免混用不同源的版本与文件。自动检查显示逐源读取状态和完成数量；下载进度显示实际源名称。`show-auto-check` 只是偏好选项，是否在启动时或定期调用 `check()` 由应用决定。

### UpdateSource

```js
const sources = [
  { id: 'github', name: 'GitHub', status: 'success', version: '1.9.0' },
  { id: 'gitee', name: 'Gitee', status: 'error', message: '暂时无法连接，请稍后再试。' },
];
```

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| id | 必填、唯一、非空的源标识 | string |
| name | 展示名称，未传时显示 id | string |
| status | pending / checking / success / ready / available / latest / not-available / error；默认 pending | string |
| version | 该源最近读取到的版本 | string |
| message | 提示文字；悬停可查看，手动选中时在列表下方展示 | string |
| disabled | 该源不可选择；默认 false | boolean |
| active | 实际使用标记；未传 active-source 时从该标记获取源标识 | boolean |

地址、认证和请求逻辑保留在应用自己的配置中，通过 `id` 与展示数据关联。检查中与读取失败的状态优先于旧版本信息展示。全部源禁用或指定的源已不存在时，检查按钮不可用；下载优先依据实际使用的源判断可用性。

源状态 `ready` 表示元数据已发现新版本、等待更新服务确认，与对话框的下载完成状态不同；`not-available` 表示该源没有可更新版本。这两个状态和 `active` 字段可用于接收已有更新 SDK 的源快照。

### useUpdateCheck

辅助函数仅协调独立的源检查请求，不依赖 Electron 或特定网络协议。每次 `checkSource` 应完成该源所需的读取与有效性校验，失败时抛出异常。如果应用的更新 SDK 已负责多源检查和切换，直接将它的状态、源快照和实际源传给对话框即可，无需再使用辅助函数并行调用同一个更新客户端。

```vue
<script setup>
import { ref } from 'vue';
import { AuButton, AuUpdateDialog, useUpdateCheck } from 'aurora-plus';

const visible = ref(false);
const configurations = [
  { id: 'primary', name: '主要更新源', url: 'https://updates.example.com/stable.json' },
  { id: 'backup', name: '备用更新源', url: 'https://backup.example.com/stable.json' },
];
const { source, dialogProps, check, cancel } = useUpdateCheck({
  sources: configurations,
  currentVersion: '1.8.0',
  async checkSource(configuration, { signal }) {
    const response = await fetch(configuration.url, { signal });
    if (!response.ok) throw new Error(`读取失败：${response.status}`);
    // 服务返回 { version, releaseNotes?, releaseDate?, releaseUrl?, channel?, downloadSize? }。
    return response.json();
  },
});
function open() { visible.value = true; check(); }
function retry(stage, context) { if (stage === 'check') check(context); }
function download(version, { activeSource }) {
  const configuration = configurations.find((item) => item.id === activeSource);
  // 用 configuration 和 version 调用应用自己的下载服务。
  console.log(configuration, version);
}
</script>

<template>
  <AuButton @click="open">检查更新</AuButton>
  <AuUpdateDialog v-model="visible" v-bind="dialogProps" v-model:source="source"
    @check="check" @retry="retry" @download="download" @cancel="cancel" @close="cancel" />
</template>
```

#### Options

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| sources | 按优先级排列的源配置，包含唯一 id、name 和调用者所需的其他字段；支持 ref 或 getter | array / ref / function | — |
| currentVersion | 当前版本，支持 ref 或 getter | string / ref / function | — |
| checkSource | 检查单个源，接收完整配置和 `{ signal, currentVersion }`，返回包含 version 的结果 | async function | 必填 |
| compareVersions | 自定义版本比较，返回正数 / 0 / 负数；同步执行 | (candidate, current) => number | 默认比较数字版本与预发布标识，忽略构建信息和 v 前缀 |
| timeout | 每个源的超时毫秒数，必须大于 0 | number | 15000 |

结果必须包含非空字符串 `version`；可包含对话框的 `releaseNotes`、`releaseDate`、`releaseUrl`、`channel`、`downloadSize` 展示字段及 `message`。结果还可显式返回布尔值 `available` 替代版本比较，例如已跳过的版本返回 `available: false`。涉及地址、令牌或更新客户端的字段不会传入源展示列表。

#### Returns

| 字段或方法 | 说明 |
| --- | --- |
| source | 可写 ref；空字符串表示自动选择，用于 v-model:source |
| status / activeSource / errorMessage / updateInfo | 只读 ref；检查状态、实际源、失败文案与选中的新版本结果 |
| sources | 源展示快照 computed，包含逐源状态、版本、消息及 active 标记 |
| dialogProps | 可直接 v-bind 给对话框的 computed；仅包含检查与版本展示属性 |
| check(context?) | 返回 Promise，完成结果为 `{ status, activeSource, info }`；同目标重复调用共用当前任务；可通过 context.source 指定源 |
| cancel() | 取消正在进行的检查并恢复 idle；已完成的结果不受影响 |
| reset() | 取消任务并清空结果，恢复 idle |

取消后的 `check()` 返回 `status: 'cancelled'`，迟到响应不会覆盖新任务。辅助函数在所属 Vue 作用域销毁时取消任务；离开作用域使用时由调用者执行 `cancel()`。下载、安装及其状态由应用维护，不要调用 `check()` 重试下载。

## 业务接入

组件负责界面展示与操作事件，辅助函数按需协调检查与版本比较。请求实现、下载、安装、自动检查偏好的保存及跳过版本的记录由应用处理；创建辅助函数不会立即发起检查。

`check`、`download`、`install`、`retry` 不会自动改变 `status` 或关闭窗口，业务应在任务开始与完成时更新状态。百分比使用 0 到 100 的数值，显示时取整并限制在该范围内。

取消检查或下载会触发 `cancel` 并关闭窗口，应用应在该事件中中止对应任务。右上角关闭、Escape 或实例 `close()` 只关闭窗口；如需中止任务，请在 `close` 中处理。稍后提醒与跳过版本会发送对应事件并关闭窗口，提醒时间与版本记录由应用决定。

更新说明以普通文本展示，不解析 HTML。`release-notes` 插槽可以替换为应用自己的说明内容。

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

`title` 为可选分组标题，`items` 为该组的字符串数组。长说明在内容区域滚动，正文默认保持透明背景。

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

`UpdateSourceContext` 为 `{ source: string, activeSource: string }`，可用它定位应用中的源配置；`source` 为空表示自动检查所有可用源，下载使用 `activeSource`。未配置源时这两个字段均为空字符串。下载与重试保留原有第一个参数，源信息作为第二个参数传递。安装使用已下载的文件，不重新选择源。

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
