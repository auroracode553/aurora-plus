# 统一外观与动效实现

Aurora Plus 全库使用统一外观，没有材质属性、档位、切换 API 或偏好存储。亮暗主题仍由 `setAuroraTheme` 管理，语义颜色沿用宿主覆盖值。原有尺寸不放大：Button 为 28/32/40px；Switch 三档轨道为 30×18、36×20、42×24px，滑块为 14/16/20px；Slider 为 14/16/18px。它们是 Web 紧凑布局对原生设计基线的几何适配。

## 文件与依赖

| 文件 | 职责与调用关系 |
| --- | --- |
| `ui/src/theme/_surface-tokens.scss`、`_surfaces.scss`、`_glass.scss` | 统一背景、边框、阴影和降级样式；组件复用全局语义变量 |
| `ui/src/utils/glass/optics.js` | 从 HyperGlassOptics / hyper_glass.frag 移植圆角距离场、法线、圆弧折射、七波段位移和 Ambient 遮罩公式 |
| `ui/src/utils/glass/filter.js` | 构造 Chromium SVG 背景采样链，不录制前景文字或镜片自身 |
| `ui/src/utils/glass/surface.js` | DOM 几何、主题、可见性和资源生命周期；公开 `createAuroraGlassSurface` 供框架外浮层注入 |
| `ui/src/utils/glass/directive.js` | Vue 指令，挂载、更新和卸载时调用 DOM 适配器 |
| `ui/src/utils/glass/motion.js` | 临界/欠阻尼弹簧、85/180ms 按压时间函数和帧循环 |
| `ui/src/utils/use-sliding-indicator.js` | Tabs/Segmented 的布局坐标测量和位置弹簧；Segmented 的临时镜片、拖动与单次提交 |
| `ui/src/components/switch/use-switch-motion.js` | 开关五通道展示值、位置样本速度、指针取消及受控状态恢复 |
| `ui/src/components/slider/use-slider-motion.js` | 滑块展示位置与按压材质；值提交仍由原组件处理 |

## 光学链路

Chromium 使用 `backdrop-filter: url(#filter)` 采样实时背景，依次执行 Clamp 模糊、饱和度/亮度、圆弧位移、七波段合成和边缘高光；表面染色、清晰内容与外缘由宿主元素绘制。位移图使用局部布局尺寸，浏览器合成器负责元素和祖先变换的背景映射，不把全局坐标相减作为采样变换。

Button 的按压进度 p 限制在 [0,1]，blur=8−2p、edge=12+2p、amount=16+2p、外阴影半径=6−1.5p（均为 CSS px）。进入 85ms、恢复 180ms，曲线 `(0.23,1,0.32,1)`；重入从当前展示值继续。Navigation 为 8/24/24px。Dialog 的浅/深 blur 为 16/8px，edge=24px、amount=48px、depth=1、saturation=1.5、浅色 brightness=0.2。

Selection 为 blur=0、edge=10p、amount=14p、dispersion=p；Slider Thumb 为 blur=8(1−p)，其余同 Selection。Switch Thumb 为 blur=8(1−p)、edge=5p、amount=10p，折射时 dispersion=1，并单独计算方向相关的黑白 Ambient。除 Switch 外，滤镜范围向外扩展 `ceil(3×blur+edge)`；Switch 保持 padding=0。

颜色遵守原语义。浅/深中性表面白色 alpha 为 0.4/0.136；Dialog 为 0.6/0.272。Button 不使用品牌投影；外部显式边框存在时关闭额外轮廓。加载按钮保持正常表面并阻止点击；禁用按钮无光学采样、阴影和按压。表格、树和正文滚动容器不增加着色背景；固定列保留不透明的内容底色，避免横向滚动时后方文字透出并重叠。

## 动效和提交

- 位置与按压采用 stiffness=1000、dampingRatio=1，阈值 0.001；物理积分使用解析解，中断时保留当前速度。
- Segmented 双轴 active 目标为 78/56，stiffness=250、dampingRatio=0.6/0.7。镜片与目标的距离按项宽归一化，接近 `(count−1)×0.025` 后释放。速度通道 300/0.5，形变分母为 10。横向拖动在松手时选择最近的可用项；取消和纵向滚动接管恢复绑定项。Tabs 保留细指示线和横向滚动语义，只使用位置弹簧。
- Switch 的双轴 active 目标为 1.5，参数为 250/0.6、250/0.7。active 为按住或位置距离 ≥0.025；速度通道为 300/0.5，通过最近 100ms 位置样本的时间斜率估计归一化行程/秒。scaleX=sx/(1−clamp(v/50×0.75,−0.2,0.2))，scaleY=sy×(1−clamp(v/50×0.25,−0.2,0.2))。
- Switch 指针横移立即更新临时目标，RTL 反转方向；松手以 0.5 吸附，最多提交一次。取消、纵向接管、窗口失焦和失去可用性均恢复宿主值。宿主拒绝更新时，下一次 Vue 更新后回到绑定值，不保留另一份业务状态。
- Slider 拖动直接定位；键盘和外部值使用位置弹簧，填充与滑块共用展示比例。原有 input/change 触发时机和键盘 range 保留，滑块不缩放。
- 普通 CSS 状态默认 200ms、按压 85ms、释放 180ms、浮层进入/退出 250ms。Dialog/Drawer 的 Vue 退出生命周期、点击外部关闭、滚动锁和透明全屏交互层保持原机制。

## 生命周期、性能与平台边界

静止后停止 requestAnimationFrame，不做常驻动画或正文截图。ResizeObserver 只在尺寸变化后更新几何；主题观察限于主题所有者和根节点属性。IntersectionObserver 在视口前后 128px 范围内启用折射，离屏时采用模糊表面。每个表面复用自身 SVG；几何和参数未变时复用纹理。位移纹理倍率最大 2，单图最多 1,048,576 像素，大面板降低纹理倍率。卸载时释放 SVG、纹理引用、观察器、帧和事件，并恢复适配器写入的样式。

Web 使用 8 位位移图和 SVG 合成，不是原生 RuntimeShader；色散以不透明页面背景为采样前提，透明窗口的 alpha 合成不保证与原生七波段 alpha 平均一致。Switch 直接采样浏览器合成的背景与轨道，没有原生独立轨道录制及专用缩放采样；Ambient 的像素取整与字体、DPR、浏览器合成后端也存在差异。不能宣称与 Android/Flutter 逐帧或像素完全一致。

非 Chromium 不启用 SVG 折射，使用主题化模糊表面；无 backdrop-filter 时使用实色可读背景。减少动态效果时展示位置直接定位、缩放为 1，材质即时变化。能力回退不等于完整折射实现。

外部 DOM 集成：`createAuroraGlassSurface(element, { role: 'navigation' })` 返回 `{ update(options), destroy() }`。调用方负责在元素移除前调用 `destroy()`；组件库不扫描或修改宿主编辑器内部节点。
