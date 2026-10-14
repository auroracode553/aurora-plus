<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import AboutOverview from '../.vitepress/theme/examples/about-dialog/AboutOverview.vue';
import aboutOverviewSource from '../.vitepress/theme/examples/about-dialog/AboutOverview.vue?demo-source';
</script>

# AboutDialog 关于对话框

展示应用名称、图标、版本、作者、更新日志与可展开的详情。信息由属性传入，详情显隐由 `v-model:details-visible` 控制。

## 应用信息与版本日志

<DemoBlock title="关于应用" :source="aboutOverviewSource">
  <AboutOverview />
</DemoBlock>

日志原文的展示规则与 [UpdateDialog 更新说明](./update-dialog#更新日志) 一致，也支持纯文本分组数组。详情值按文本展示；需要自定义内容时使用 `details` 插槽。

## AboutDialog API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue / v-model | 是否显示 | boolean | true |
| title | 对话框标题 | string | 关于 |
| width | 宽度，数字按 px 处理，受视口约束 | string / number | 560 |
| appName | 应用名称 | string | '' |
| iconSrc | 应用图标地址；icon 插槽优先 | string | '' |
| version | 版本的展示文本 | string | '' |
| platform | 平台的展示文本 | string | '' |
| description | 应用描述 | string | '' |
| author | 作者或团队名称 | string | '' |
| authorUrl | 作者链接，默认在新窗口打开 | string | '' |
| copyright | 版权信息 | string | '' |
| releaseNotes | 日志原文或更新说明数组，类型同 UpdateDialog | string / array | [] |
| showReleaseNotes | 空日志时仍显示更新说明区域 | boolean | false |
| releaseNotesTitle | 更新说明标题 | string | 当前版本更新 |
| emptyNotesText | 空日志提示 | string | 暂无更新说明 |
| infoGroups | 分组详情 | AboutInfoGroup[] | [] |
| detailsVisible / v-model:details-visible | 是否展开详情 | boolean | false |
| showDetailsButton | 显示详情切换按钮 | boolean | false |
| detailsButtonText | 详情按钮文案 | string | 详细信息… |
| closeText | 底部关闭按钮文案 | string | 关闭 |

其余 `AuDialog` 属性同样适用，例如 `append-to-body`、`lock-scroll`、`show-close`、`close-on-press-escape`、`max-height` 与 `z-index`。

### AboutInfoGroup

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| title | 可选分组标题 | string |
| items | 该组的详情条目 | AboutInfoItem[] |

### AboutInfoItem

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| label | 条目名称 | string |
| value | 条目值；0 和 false 正常展示，空字符串、null、undefined 显示 suffix 或“未知” | string / number / boolean |
| suffix | 空值时的替代文字 | string |
| extra | 使用较小文字，默认 false | boolean |
| type | 值的语义颜色，默认 default | default / danger |

### Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 请求关闭窗口 | false |
| update:detailsVisible | 请求切换详情显隐 | visible: boolean |
| details-toggle | 点击详情按钮，通知期望的显隐状态 | visible: boolean |
| author-click | 点击默认作者链接；可用 .prevent 接管链接操作 | MouseEvent |
| open / opened | 开始打开 / 打开过渡完成 | — |
| close | 关闭窗口 | reason: string |
| closed | 关闭过渡完成 | — |

详情按钮不会自行更改 `detailsVisible`；通过 `v-model:details-visible` 接收显隐变化。底部关闭按钮的原因为 `dismiss`，其余关闭原因沿用 `AuDialog`。

### Slots

| 插槽 | 作用域参数 | 说明 |
| --- | --- | --- |
| icon | — | 替换应用图标 |
| heading | { appName, version, platform } | 替换应用名称、平台与版本区域 |
| credit | { author, authorUrl } | 替换署名区域 |
| release-notes | { version, notes } | 替换更新说明正文 |
| details | { groups } | 替换详情区域 |
| default | — | 补充正文 |
| footer | { close, detailsVisible, toggleDetails } | 替换底部操作区 |

### Exposes

| 方法或属性 | 说明 |
| --- | --- |
| close(reason?) | 关闭窗口，默认原因为 api |
| dialogRef | 内部 AuDialog 实例引用 |
