# 三个桌面项目的 Aurora UI 接入与组件缺口

更新日期：2026-08-27

## 1. 盘点范围

本文用于 Aurora UI 后续迭代，不属于面向组件库使用者的 API 文档。盘点范围如下：

- `D:\my_project\electron-project\elctron_typora`
- `D:\my_project\electron-project\electron-st`
- `D:\my_project\electron-project\translate-pc`
- `D:\my_project\front-sdk\aurora-ui\ui`

盘点只读取源码，默认排除 `dist`、`dist-electron`、`node_modules`、`build_output` 和发布目录；未启动、编译或打包任何项目。

## 2. 当前接入状态

三个应用均采用本机 npm 软连接，不在项目清单中保存 `file:` 依赖：

| 项目 | Vue 入口 | 接入状态 | 已有直接用例 |
| --- | --- | --- | --- |
| `elctron_typora` | `src/main.js` | 已加载 `aurora-ui/style.css`，并通过 `app.use(AuroraUI)` 完整注册 | `AuWindowTitleBar` |
| `electron-st` | `src/renderer/index.js` | 已加载 `aurora-ui/style.css`，并通过 `app.use(AuroraUI)` 完整注册 | 全局组件及 `$message`、`$messageBox`、`$confirm` 已可用 |
| `translate-pc` | `src/main.js` | 已加载 `aurora-ui/style.css`，并通过 `app.use(AuroraUI)` 完整注册 | 全局组件及 `$message`、`$messageBox`、`$confirm` 已可用 |

本机三个 `node_modules/aurora-ui` 均应指向：

```text
D:\my_project\front-sdk\aurora-ui\ui
```

`npm link` 是开发机状态，不会形成可提交的依赖声明。更换电脑、清理 `node_modules` 或执行会重建依赖树的 npm 操作后，需要由使用者重新链接。

## 3. Aurora UI 当前已有能力

| 分类 | 已实现组件或服务 |
| --- | --- |
| 基础操作 | `AuButton`、`AuButtonGroup`、`AuIcon` |
| 表单选择 | `AuSwitch`、`AuCheckbox` |
| 内容容器 | `AuCard`、`AuVirtualList` |
| 浮层 | `AuTooltip`、`AuDropdown`、`AuContextMenu`、`AuDialog`、`AuFloatingToolbar` |
| 桌面窗口 | `AuWindowTitleBar` |
| 反馈服务 | `AuMessage`、`AuMessageBox` |

下面列出的 `AuButton`、`AuSwitch`、`AuCheckbox`、对话框、消息等现有重复实现，不代表 Aurora UI 缺少组件，只代表业务项目尚未完成迁移。

## 4. 现有能力可直接替换的项目组件

### 4.1 elctron_typora

| 项目内实现 | Aurora UI 对应能力 | 建议 |
| --- | --- | --- |
| `components/window/WindowTitleBar.vue` | `AuWindowTitleBar` | 已迁移；项目组件只保留 Electron IPC 适配 |
| `commonComponents/XButton.vue`、`XCloseButton.vue` | `AuButton` | 按按钮类型、尺寸和图标逐步替换 |
| `commonComponents/XTooltip.vue` | `AuTooltip` | 可直接迁移，先核对延迟和 placement 默认值 |
| `commonComponents/SvgIcon.vue` | `AuIcon` 与 Aurora UI 导出的 Tabler 图标 | 本地专用 SVG 可继续由业务适配器承载 |
| `commonComponents/BaseDialog.vue` | `AuDialog` | 保留业务表单，替换通用遮罩、焦点和关闭逻辑 |
| `commonComponents/ContextMenu.vue`、`context-menu/DocumentContextMenu.vue` | `AuContextMenu` | 将项目菜单项结构转换为库的配置结构 |
| `commonComponents/VirtualScrollList.vue` | `AuVirtualList` | 核对行高、滚动定位和插槽参数后迁移 |
| `FloatingToolbar.vue`、`ImageToolbar.vue`、`AudioToolbar.vue` | `AuFloatingToolbar`、`AuButtonGroup`、`AuTooltip` | 通用定位和按钮反馈交给组件库，保留编辑器命令 |
| `utils/confirm.js`、`utils/toast.js` | `AuMessageBox`、`AuMessage` | 业务工具可保留为薄适配层，统一返回值和错误处理 |

### 4.2 electron-st

| 项目内实现 | Aurora UI 对应能力 | 建议 |
| --- | --- | --- |
| `shared/ui/BaseModal.vue` | `AuDialog` | 用业务外壳补充说明文本即可，不再重复焦点和 Escape 逻辑 |
| `shared/ui/AppConfirmDialog.vue` | `AuMessageBox` | `tone: danger` 映射为 `confirmButtonType: 'danger'` |
| `shared/ui/AppToastViewport.vue` | `AuMessage` | `notify*` 方法可改成服务薄封装 |
| 各页面原生操作按钮 | `AuButton`、`AuButtonGroup` | 优先迁移弹窗页脚和工具条按钮 |
| 原生布尔选项 | `AuSwitch`、`AuCheckbox` | 根据“即时生效”或“批量选择”语义分别使用 |
| 信息卡片和模块卡片 | `AuCard` | 只迁移通用容器，不把行情业务结构放入 UI 库 |

### 4.3 translate-pc

| 项目内实现 | Aurora UI 对应能力 | 建议 |
| --- | --- | --- |
| `components/ToastMessage.vue` | `AuMessage` | `useToast` 可保留为业务适配层 |
| 设置页的 8 个布尔开关 | `AuSwitch` | 保留标题和说明文案插槽或外层布局 |
| 页面按钮和图标按钮 | `AuButton`、`AuButtonGroup`、`AuTooltip` | 优先迁移保存、检测、复制和清理操作 |
| 工作区、词典和历史卡片 | `AuCard` | 只替换表面容器，业务数据展示继续留在项目内 |
| `AppIcon.vue` | `AuIcon` 与 Aurora UI 导出的 Tabler 图标 | 专用品牌图形仍保留在应用侧 |

## 5. 尚未实现的通用组件

源码中的原生控件数量说明了基础表单组件应优先补齐：

| 项目 | `input` | `select` | `textarea` | `form` | `table` |
| --- | ---: | ---: | ---: | ---: | ---: |
| `elctron_typora` | 16 | 6 | 1 | 2 | 0 |
| `electron-st` | 15 | 0 | 0 | 2 | 1 |
| `translate-pc` | 24 | 7 | 1 | 0 | 0 |

### P0：基础表单与锚点浮层

| 建议组件 | 主要需求来源 | 首版范围 |
| --- | --- | --- |
| `AuInput` | 三个项目的搜索、路径、账号、密钥、链接和普通文本输入 | `v-model`、文本类型、禁用/只读、清空、前后缀、字数限制、错误态、组合输入法兼容 |
| `AuTextarea` | Markdown 链接/源码输入、翻译原文等多行内容 | `v-model`、自动高度、字数限制、禁用/只读、错误态 |
| `AuSelect`、`AuOption` | 主题、翻译引擎、服务商、语言域和应用设置 | 单选、禁用项、键盘导航、视口避让、受控展开；后续再增加多选 |
| `AuInputNumber` | 表格行列、提醒阈值、请求超时等数值输入 | 最小/最大值、步进、精度、键盘增减、单位后缀 |
| `AuRadio`、`AuRadioGroup` | `electron-st` 的类型选择，`translate-pc` 的主题和字号选择 | `v-model`、禁用、横向/纵向布局、完整键盘行为 |
| `AuForm`、`AuFormItem` | 插入链接/表格、提醒设置、翻译服务配置 | 标签、说明、错误消息、必填状态、提交校验；校验器通过入参注入 |
| `AuPopover` | `AppControlPopover`、复杂设置提示、不能由配置式 Dropdown 承载的任意内容 | 触发/内容插槽、受控显示、点击外部关闭、焦点返回、自动翻转和视口避让 |

### P1：搜索、导航与数据展示

| 建议组件 | 主要需求来源 | 首版范围 |
| --- | --- | --- |
| `AuCombobox` / `AuAutocomplete` | 股票搜索、文件搜索、历史搜索、查找替换 | 基于 `AuInput` 与 `AuPopover`，支持异步结果、空状态、键盘选中和加载态 |
| `AuMenuBar`、`AuSubmenu`、`AuNavigationMenu` | Typora 风格应用菜单、监控工具控制入口、翻译侧栏 | 菜单树、快捷键文本、选中/禁用/危险态、左右方向键和 Escape 行为 |
| `AuTabs`、`AuTabPane` | 偏好设置分区、工作区视图切换、详情分区 | 受控选中、延迟内容、键盘导航和溢出处理 |
| `AuTree`、`AuTreeItem` | Markdown 大纲、目录树 | 展开、选择、键盘导航、自定义节点、虚拟化扩展点 |
| `AuList`、`AuListItem` | 文件、历史记录、股票、自选项、提醒列表 | 选中、禁用、操作插槽、空状态；排序拖拽保持为可选扩展 |
| `AuTable` | 股票提醒表格及后续通用数据列表 | 列配置、插槽、空状态、固定表头、横向滚动；排序与虚拟化后续增加 |
| `AuToolbar` | 应用控制条、编辑器/图片/音频/白板常驻工具条 | 分组、分隔、紧凑图标按钮、`aria-pressed`、横向溢出；与 `AuFloatingToolbar` 共享按钮规范 |
| `AuTag`、`AuBadge`、`AuStatus` | 引擎状态、股票涨跌、Git 文件状态、版本和提醒状态 | 语义色、圆点/文本、可关闭 Tag、无障碍文本 |
| `AuProgress`、`AuLoading` | 更新下载、导出、异步检测、录音和行情加载 | 确定/不确定进度、紧凑 Spinner、可访问状态文本 |
| `AuEmpty`、`AuAlert` | 空股票列表、无历史、服务错误、设置说明 | 图标/标题/描述/操作插槽，以及 info/success/warning/error 语义 |

### P2：桌面工作台增强组件

| 建议组件 | 主要需求来源 | 首版范围 |
| --- | --- | --- |
| `AuSplitPane` / `AuResizable` | 编辑器侧栏、源码控制页、翻译工作区 | 水平/垂直分割、最小最大尺寸、键盘调整、持久化尺寸回调 |
| `AuColorPicker` | `elctron_typora` 的页面主题颜色 | 原生颜色输入适配、文本值同步、重置和透明度扩展点 |
| `AuImageViewer` | 图片预览 | 缩放、旋转、上一张/下一张、键盘操作、工具条插槽 |
| `AuTimeline` | 文件历史、Git 历史、翻译历史 | 时间节点、状态、操作插槽和长列表扩展点 |
| `AuPathInput` | 翻译模型目录、Python 路径、文件选择 | 基于 `AuInput`，只定义展示和选择事件，不内置 Electron IPC |
| `AuKeyHint` | 菜单快捷键、操作提示 | 跨平台按键显示、组合键和无障碍文本 |

## 6. 不建议放入 Aurora UI 的业务组件

以下组件虽然当前只存在于单个项目，但包含明显业务、SDK 或 Electron IPC 逻辑，应继续留在应用侧：

- Markdown 编辑器、Git 提交/远端配置、白板编辑器、录音器；
- 股票行情图、股票代码规则、金价或股票提醒业务表单；
- 翻译工作区、词典详情、翻译分段、在线/离线引擎配置；
- Electron 窗口 IPC、自动更新业务流程、文件系统和剪贴板操作。

Aurora UI 只提供这些业务组件内部可复用的按钮、表单、布局、浮层和反馈原语。

## 7. 推荐实施顺序

1. 先完成 `AuInput`、`AuTextarea`、`AuSelect`、`AuInputNumber`、`AuRadioGroup` 和 `AuFormItem`，覆盖三个项目最集中的重复样式。
2. 完成 `AuPopover` 后，在其上组合 `AuCombobox`，再迁移股票搜索、文件搜索和历史搜索。
3. 完成 `AuMenuBar`、`AuTabs`、`AuTree`、`AuList` 和 `AuToolbar`，处理桌面工作台的导航与密集操作区。
4. 补齐状态、空态、加载和进度组件，统一异步反馈。
5. 最后按真实复用需求实现 `AuSplitPane`、`AuImageViewer`、`AuTimeline` 等体量较大的桌面组件。

每个新组件应继续遵守 Aurora UI 的紧凑尺寸、扁平表面、键盘焦点、主题变量、`prefers-reduced-motion`、`prefers-reduced-transparency` 和高对比度回退规则。
