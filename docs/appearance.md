# 统一外观与动效实现

Aurora Plus 全库使用统一外观，没有材质属性、档位、切换 API 或偏好存储。亮暗主题仍由 `setAuroraTheme` 管理，语义颜色沿用宿主覆盖值。Button 为 28/32/40px；Switch 三档轨道为 30×18、36×20、42×24px，滑块为 14/16/20px；Slider 为 14/16/18px。输入类控件采用下述独立尺寸配方。它们是 Web 布局对原生设计基线的几何适配。

## 文件与依赖

| 文件 | 职责与调用关系 |
| --- | --- |
| `ui/src/theme/_config.scss` | 唯一的 `$surface-opacity=98%` 与 `surface-background()` 配方，供主题令牌、语义按钮及反色表面复用 |
| `ui/src/theme/_surface-tokens.scss`、`_surfaces.scss`、`_glass.scss` | 分别维护表面颜色令牌、通用样式/能力回退与主题阴影；不重复定义底色 |
| `ui/src/utils/glass/surface.js` | 公开 `createAuroraGlassSurface`，仅为框架外浮层设置固定磨砂、可选阴影和 CSS 按压类；内置组件不调用此适配器 |
| `ui/src/utils/glass/motion.js` | Tabs 位置弹簧与静止即停止的帧循环 |
| `ui/src/utils/use-sliding-indicator.js` | Tabs 指示线的布局坐标测量、位置弹簧与生命周期 |
| `ui/src/theme/mixins/_field-sizing.scss` | Input、Select、范围及颜色选择器共用的尺寸与触屏适配；FormItem 复用标签高度 |
| `ui/src/components/switch/use-switch-motion.js` | 开关拖动位置、指针取消及受控状态恢复；普通切换交给组件 CSS |
| `ui/src/components/slider/AuSlider.vue` | 填充与实体滑块直接读取同一比例；指针、键盘和值提交统一由组件处理 |
| `ui/src/utils/button-group-context.js` | ButtonGroup/FloatingToolbar 注入统一的尺寸、方向和配色，操作项与 Divider 通过 Vue 上下文读取 |
| `ui/src/theme/mixins/_control-group.scss` | 胶囊边框、留白、操作项和图标尺寸的单一配方，由按钮组、工具条和操作项各自样式引用 |
| `ui/src/theme/mixins/_window-chrome.scss` | WindowTitleBar/MenuBar 共用的贴边玻璃表面与菜单操作项布局，菜单按钮的材质直接复用公共 surfaces 模块 |

## 独立图标按钮几何

`AuButton` 仅含图标或显式设置 `circle` 时，small/default/large 的宽高分别固定为 28/32/40px；menu 类型对应为 24/26/30px。普通图标按钮沿用控件圆角，circle 使用圆形，menu 保留紧凑圆角。尺寸与最小尺寸由 `AuButton.scss` 的同一 Sass 配方设置，并关闭 Flex 伸缩，避免同行输入框压缩按钮或纵向布局拉伸按钮。文字按钮继续按内容确定宽度。

Tooltip 触发区域使用 `min-width: min-content`，通过内容自身的最小宽度约束包装层，不依赖具体按钮类型或尺寸。同行输入框允许收缩，固定尺寸按钮及其提示触发区域保留操作宽度。

## 输入类控件几何

Input、Select、DateRangePicker 和 ColorPicker 的 small/default/large 高度分别为 28/32/40px，文字为 13/14/16px；TreeSelect、DatePicker、TimePicker 和 DateTimePicker 通过内部 Input 复用同一配方。高度和 min-height 一并设置，避免纵向 flex 布局压缩输入区域；宽度继续允许收缩。FormItem 的同行标签及状态图标按同档高度对齐，顶部标签不占用控件高度。

视口宽度不超过 640px，或主指针为粗指针且不支持悬停时，三档高度分别为 36/44/48px，输入文字统一为 16px；Select 选项使用同档最小行高。清除、密码切换与可替换后缀的区域为 32px，有内容时清除按钮直接可见；图标保留原有大小。ColorPicker 保持等宽高圆形。Input 多行模式覆盖单行高度，继续使用 rows、最小内容高度和原生 resize。

尺寸由编译期 Sass 配方维护，不添加组件级 CSS 变量，不改变共享玻璃表面、受控值、禁用或只读规则。树的虚拟行高继续由 itemHeight 控制，不使用 CSS 单独改变行高，以免滚动偏移与渲染尺寸失配。

## 控制组几何

ButtonGroup 与 FloatingToolbar 使用 Hyper TabBar 的胶囊轮廓和同心内缩规则，Web 保留紧凑操作尺寸。图标项 small/default/large 为 24/28/40px，图标为 14/16/20px；悬浮容器 3px 留白加 1px 边框形成 4px 内缩，总高度为 32/36/48px。Connected 维持 2px 留白加 1px 边框，选中项使用柔和底面，无独立硬描边和外阴影。

FloatingToolbar 自身提供 `button-group-context.js` 上下文，插槽内直接使用 AuButtonGroupItem；Tooltip 和 Popover 包装不会中断注入，动态 size 更新会触发重新定位。Divider 在该上下文内使用 12/14/20px 高度和左右各 2px 外距，普通 Divider 不变。组内操作项间隔 2px，内容分组只负责排列，不再叠加容器背景。

动作项沿用点击提交、禁用、加载与自定义语义色；selected 由宿主控制，支持独立操作项的选中状态。按压复用现有 85/180ms 整面反馈，深浅主题与反色组沿用既有语义。Flutter 参考的 TabBar 是 56px 导航结构，不能据此宣称紧凑 Web 操作组与其逐帧或像素一致。

## 表面绘制

WindowTitleBar 和 MenuBar 的整栏使用公共固定磨砂，底色直接引用公共表面令牌，不单独维护透明度；分界线使用前景色的 6%。浅色呈清亮白色磨砂，深色采用石墨底，避免系统 Acrylic 的灰底主导长条外观。整栏不加高光与浮动阴影。标题栏默认高 32px，自绘窗口控件完整命中宽 40px、高度填满栏体，默认透明，悬停与按压使用铺满命中区的矩形反馈，不使用胶囊、内缩底面或按压缩放；键盘焦点保留内描边。标题栏在浏览器与 Electron 中均可渲染自绘外观和受控交互，仅在 Electron 中自动检测 Window Controls Overlay，启用后隐藏自绘控件并通过覆盖区环境变量预留位置及高度；独立的 `aurora-plus/electron` 主进程入口管理原生控件、主题与关闭意图，普通组件入口不引入 Electron。菜单栏仍高 30px、根操作项高 26px。根菜单在悬停、键盘焦点和展开时复用公共表面和静止半径 6px 的中性阴影；鼠标和焦点只影响展示，菜单业务状态仍由 openIndex 管理。不建立 JS 动画控制器。

MenuBarPanel 保留公共菜单面板材质、28px 行高、快捷键与勾选列，根面板与栏体间隔 4px，子菜单仍按现有偏移定位。拖拽区、no-drag 操作区、标题双击、窗口事件、菜单键盘及点击外部关闭仍由原组件管理；视觉层不依赖 Electron 或宿主业务。

背景磨砂仅用于浮层和贴边栏，使用公共 `--au-surface-blur=8px`、`--au-surface-saturation=100%`；Dialog/Drawer 的浅/深 blur 为 16/8px，saturation=1.5。普通按钮、输入框、选择器控制区、按钮组和实体滑块不启用背景滤镜。表面直接通过公共 CSS 声明，不生成 Canvas 位移图、PNG data URL、SVG 滤镜或附加高光节点。

Button、ButtonGroupItem 和菜单操作项通过 CSS `:active` 缩放到 0.975，释放恢复到 1；按压/恢复的默认时长为 85/180ms，曲线复用全局 `(0.23,1,0.32,1)`，不改变透明度或逐帧重绘阴影。窗口控件只切换背景与文字颜色，不执行缩放。颜色与阴影使用全局语义变量，主题变化由 CSS 继承即时生效。

Card、CollapseItem 和 MenuList 属于正文承载表面：保留既有底色、边框、阴影与 hoverable/展开动画，不建立背景滤镜。`mixins/_surfaces.scss` 的 content 配方统一关闭标准与 WebKit 背景滤镜，避免长页面中大面积、嵌套表面随滚动重复合成。模态全屏交互层保持透明，图片预览保留独立底幕。

颜色遵守原语义。全部文字表面统一使用 98% 覆盖率，浅色取白色、深色取主题石墨色；普通与 elevated 表面指向同一底色，subtle 只改变面色。MenuBar、Dropdown、ContextMenu、Popover、Tooltip、Select、日期/时间/树选择面板、Dialog、Drawer、Message/MessageBox、按钮组和工具条均沿公共令牌或同一 Sass 配方取色；Avatar、Tag、Trend 的语义浅底合成在公共底面上，Switch 关闭轨道和局部 Loading 也不再单独稀释底面。选中、悬停、禁用、进度/滑块和颜色预览继续使用各自的状态与数据色；透明内容容器、模态交互层和图片预览底幕保留既有职责。Button 不使用品牌投影或附加轮廓。加载按钮保持正常表面并阻止点击；禁用按钮无阴影和按压。表格、树和正文滚动容器不增加着色背景；固定列保留不透明的内容底色，避免横向滚动时后方文字透出并重叠。

## 动效和提交

- Tabs 指示线的位置和尺寸采用 stiffness=1000、dampingRatio=1，阈值 0.001；物理积分使用解析解，中断时保留当前速度。
- Tabs 保留细指示线和横向滚动语义，只使用位置弹簧。
- Switch 使用不透明白色实体滑块和公共轻阴影，默认 200ms CSS 位置/轨道色过渡；拖动期间关闭过渡，直接跟随指针。不计算速度样本、形变或材质弹簧，窗口 blur 监听只在持有指针期间存在。
- Switch 指针横移立即更新临时目标，RTL 反转方向；松手以 0.5 吸附，最多提交一次。取消、纵向接管、窗口失焦和失去可用性均恢复宿主值。宿主拒绝更新时，下一次 Vue 更新后回到绑定值，不保留另一份业务状态。
- Slider 的拖动、键盘和外部值均直接定位，填充与实体滑块共用实际比例，不创建展示值弹簧或动画循环。原有 input/change 触发时机和键盘 range 保留，滑块不缩放。
- 普通 CSS 状态默认 200ms、按压 85ms、释放 180ms、浮层进入/退出 250ms。Dialog/Drawer 的 Vue 退出生命周期、点击外部关闭、滚动锁和透明全屏交互层保持原机制。
- ImagePreview 使用独立灰色磨砂底幕隔离正文，blur=20px、saturate=75%；浅色画布承接透明图片，图片本身不做模糊。无 backdrop-filter 能力时底幕不透明。底幕仍服从现有 topOffset 和视口边界，缩放、拖动、关闭、滚动锁与退出生命周期不变。

## 生命周期、性能与平台边界

内置组件不挂载玻璃指令或创建表面适配器，不为表面注册 ResizeObserver、IntersectionObserver、MutationObserver、指针事件或动画帧。主题使用 CSS 变量继承，无主题观察或逐表面调度。Tabs 自己的布局测量、浮层定位及虚拟滚动仍由各自模块管理，位置弹簧静止即停止，不做常驻动画或正文截图。

框架外表面适配器只设置固定背景滤镜、可选按钮阴影及现有 `au-motion-control` 类，不读取布局或监听事件，不插入子节点。`update()` 更新配置时重新应用静态样式，`destroy()` 只恢复仍由自身持有的样式和类；既有定位及宿主内容保持原样。

背景模糊不能作为文字隔离的前提：宿主软件渲染、嵌套背景滤镜的取样边界都可能限制实际模糊。98% 底色在滤镜未绘制时仍隔开后方正文；不为视觉效果切换宿主硬件加速策略。各浏览器使用同一套原生模糊表面；无 backdrop-filter 时由 `_surfaces.scss` 统一回退到实色可读背景。减少动态效果时展示位置直接定位、缩放为 1，材质即时变化。

外部 DOM 集成：`createAuroraGlassSurface(element, { role: 'navigation' })` 返回 `{ update(options), destroy() }`。调用方负责在元素移除前调用 `destroy()`；组件库不扫描或修改宿主编辑器内部节点。
