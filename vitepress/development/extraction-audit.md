# Aurora Editor 组件抽离清单

## 首批已抽离

| Aurora Editor 源文件 | Aurora UI | 处理结果 |
| --- | --- | --- |
| `src/components/commonComponents/XButton.vue` | `AuButton` | 移除应用路径别名，改为主题变量，增加图标和 circle 能力 |
| `src/components/commonComponents/SvgIcon.vue` | `AuIcon` | 移除宿主目录 glob 扫描，改为内置基础图标与显式注册 |
| `src/components/commonComponents/XCloseButton.vue` | `AuCloseButton` | 增加 disabled、无障碍标签和主题变量 |
| `src/components/commonComponents/XTooltip.vue` | `AuTooltip` | 保留自动翻转与视口避让，增加 Teleport 配置和暴露方法 |
| `src/components/commonComponents/BaseDialog.vue` | `AuDialog` | 增加 v-model、Escape、焦点恢复、滚动锁和模态遮罩 |
| `src/components/commonComponents/VirtualScrollList.vue` | `AuVirtualList` | 增加 key 函数、对齐滚动、区间事件和边界同步 |
| `src/components/commonComponents/ContextMenu.vue` | `AuContextMenu` | 移除对 `showConfirm` 的硬依赖，确认逻辑改由 `beforeSelect` 注入 |
| `src/components/FloatingToolbar.vue` | `AuFloatingToolbar` | 移除主题 MutationObserver，增加自动上下定位和元素引用注入 |
| `src/utils/toast.js` | `AuMessage` | 从单例文本升级为可堆叠、可暂停、可关闭、可分类型消息服务 |
| `src/utils/confirm.js` | `AuMessageBox` | 改为组件化渲染和请求队列，避免并发调用遗留未完成 Promise |

## 暂不抽离

| 组件范围 | 保留原因 | 将来可抽离的条件 |
| --- | --- | --- |
| `AboutDialog`、`UpdateDialog`、`PreferenceDialog` | 依赖 IPC、应用常量、更新状态或业务 Store | 先拆成无状态展示组件，再由应用容器注入数据与动作 |
| `SaveChangesDialog`、`InsertLinkDialog`、`InsertTableDialog` | 依赖编辑器/对话框 Store，业务动作强绑定 | 把字段校验和提交动作改为 emits 后再评估 |
| `FindReplacePanel` | 依赖编辑器实例和查找替换命令 | 将编辑器适配器抽成接口后再评估 |
| `DocumentContextMenu` | 依赖编辑器 Store、资源路径与业务菜单模型 | 应用层继续组合 `AuContextMenu` |
| `Git*` 组件 | 依赖 Git Store、IPC 与仓库状态 | 适合独立业务包，不属于基础 UI 库 |
| `Outline*`、`StatusBar` | 依赖多个 Store、文件系统和编辑器状态 | 可复用视觉子项稳定后再拆基础 List/Tree 组件 |
| `WindowTitleBar` | 依赖 Electron 窗口 IPC | 应作为 Electron 专用扩展包，而非 Web 通用核心 |
| `WhiteboardEditor`、`AudioRecorder`、`ImagePreview` | 依赖画布、媒体、编辑器或平台能力 | 应按领域分别做扩展组件包 |

## 应用侧迁移建议

当前 Aurora Editor 源组件暂未删除，避免在 UI 包尚未完成手动安装与构建前破坏现有应用。完成本地包安装后，可逐个替换导入：

```js
// 旧
import XButton from '@/components/commonComponents/XButton.vue';

// 新
import { AuButton as XButton } from 'aurora-ui';
```

入口处只需引入一次 `aurora-ui/style.css`。确认一轮功能与视觉回归后，再删除应用内对应旧文件；不建议一次性同时删除全部组件。
