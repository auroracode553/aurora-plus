# 通用动效层

## 文件职责

- `../_motion.scss`：主题动效入口，按顺序组织反馈、过渡和关键帧。
- `../mixins/_motion.scss`：阶段时长和局部样式配方，组件 SCSS 通过 `@use` 引用。
- `_feedback.scss`：可以直接复用的 `au-motion-*` CSS 类。
- `_transitions.scss`：Vue 进入、退出、折叠与列表位置过渡；浮层方向由组件保留。
- `_keyframes.scss`：入场、呼吸、旋转、骨架与不确定进度的共享关键帧。
- `../../utils/layout-box.js` 与 `use-sliding-indicator.js`：布局坐标测量和选中层同步，供组件及列表过渡引用。
- `../../utils/floating-actions.js`：过滤退出中的浮层操作项，供菜单键盘导航引用。

时长和曲线仅取自 `--au-transition-duration`、`--au-transition-timing`。阶段倍率集中在 mixin 中，不新增组件级 CSS 变量。静态表面使用状态过渡；交互动作才触发按压、切换或进退，不为整页控件添加常驻装饰动画。

## 接入规则

| 场景 | 复用方式 |
| --- | --- |
| 表面、主题及禁用颜色变化 | 根元素 `au-motion-state` 或 `motion.state` |
| 按钮、链接、菜单命令、标签关闭、窗口控制 | `au-motion-control`、`motion.control`；局部按压使用数值参数 `motion.press` |
| 输入框及选择器外壳 | `fields.field` 复用 `motion.state`，编辑区域不缩放 |
| Switch、Checkbox、Slider | 状态轨道及标记使用共享过渡；按压只改变独立 scale 属性 |
| Tabs、Segmented | 选中层使用共享过渡和位置测量工具，不修改父容器尺寸 |
| Table、VirtualTable、Tree、菜单列表 | `motion.row` 过渡悬停及选中颜色；不动画虚拟滚动偏移 |
| Dialog、Drawer、ImagePreview、Loading | 统一进退类；模态面板通过 `au-motion-panel` 继承交互层节奏 |
| Popover、Tooltip、Dropdown、ContextMenu、MenuBar、FloatingToolbar | `au-float` 或同阶段的命名过渡，位置测量留在组件 |
| Badge、Avatar、Skeleton、Empty | 徽章显隐、图片替换、骨架反馈或空状态入场复用公共动效；Skeleton 保留直接插槽布局 |
| Number、Progress、更新进度 | `motion.phase(progress, ...)`；不确定状态使用公共关键帧 |
| Card、Form、Divider、Icon、Tag、Trend、PageHeader 和分组容器 | 状态类；可交互 Card 显式启用 `motion.lift`，内容进退可使用 AuTransition |
| 组合式日期、时间、树选择、Popconfirm、MessageBox、UpdateDialog | 复用内部控件和浮层的动画，不叠加整组缩放 |

`AuTableColumn` 只声明列数据，不渲染可动画元素。`vLoading` 与命令式服务沿用相应组件，不独立声明动画。

## 生命周期与布局

进入比退出稍长，按压立即响应、释放平滑恢复。缩放与位移优先用独立 `scale`、`translate` 属性，保留组件自身的 transform 定位。对 DOM 尺寸进行测量的 Collapse 只由 JS 设置起止高度，帧与节奏归公共 CSS；完成后恢复自然高度。

AuTransitionGroup 的稳定 key 支持原生 Vue 位置过渡；元素插入后设置逐项间隔，退出前锁定布局位置和尺寸。动态时长、间隔和布局样式在结束、取消与卸载时恢复，保留调用方的行内样式优先级。列表退出元素取消指针交互；菜单键盘导航过滤退出中的操作项。调用方的拖拽位置和虚拟列表偏移不设置 transition，避免运动跟随滞后。
