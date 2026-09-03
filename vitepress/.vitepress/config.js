import { fileURLToPath, URL } from 'node:url';
import { env } from 'node:process';
import { defineConfig } from 'vitepress';
import { demoSourcePlugin } from './demo-source-plugin.js';
import { iconMetadataPlugin } from './icon-metadata-plugin.js';

const siteBase = env.VITEPRESS_BASE || '/';
const useAuroraPlusDist = env.AURORA_PLUS_USE_DIST === 'true';
const docsRoot = fileURLToPath(new URL('..', import.meta.url));
const auroraPlusRoot = fileURLToPath(new URL('../../ui', import.meta.url));
const auroraPlusSourceAliases = useAuroraPlusDist
  ? []
  : [
      {
        find: /^aurora-plus$/,
        replacement: fileURLToPath(
          new URL('../../ui/src/index.js', import.meta.url),
        ),
      },
      {
        find: /^aurora-plus\/style\.css$/,
        replacement: fileURLToPath(
          new URL('../../ui/src/theme/index.scss', import.meta.url),
        ),
      },
    ];

export default defineConfig({
  base: siteBase,
  lang: 'zh-CN',
  title: 'Aurora Plus',
  description: '从 Aurora Editor 抽离的 Vue 3 通用组件库',
  cleanUrls: true,
  lastUpdated: false,
  head: [
    ['meta', { name: 'theme-color', content: '#409eff' }],
  ],
  vite: {
    plugins: [demoSourcePlugin(), iconMetadataPlugin()],
    resolve: {
      alias: auroraPlusSourceAliases,
      dedupe: ['vue'],
    },
    server: useAuroraPlusDist
      ? undefined
      : {
          fs: {
            // 源码位于文档根目录之外，需要显式允许开发服务器读取。
            allow: [docsRoot, auroraPlusRoot],
          },
        },
    optimizeDeps: {
      // 避免源码别名被依赖预构建缓存，保留组件修改后的即时更新。
      exclude: ['aurora-plus'],
    },
  },
  themeConfig: {
    siteTitle: 'Aurora Plus',
    outline: {
      level: [2, 3],
      label: '本页内容',
    },
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      {
        text: '设计',
        items: [
          { text: 'Color 颜色', link: '/guide/colors' },
          { text: 'Theme 主题配置', link: '/guide/theme' },
        ],
      },
      { text: '组件', link: '/components/button' },
    ],
    sidebar: [
      {
        text: '开始使用',
        items: [
          { text: '介绍', link: '/guide/introduction' },
          { text: '快速开始', link: '/guide/getting-started' },
        ],
      },
      {
        text: 'Design 设计基础',
        items: [
          { text: 'Color 颜色', link: '/guide/colors' },
          { text: 'Theme 主题配置', link: '/guide/theme' },
        ],
      },
      {
        text: 'Basic 基础组件',
        items: [
          { text: 'Button 按钮', link: '/components/button' },
          { text: 'ButtonGroup 按钮组', link: '/components/button-group' },
          { text: 'Divider 分割线', link: '/components/divider' },
          { text: 'Link 文字链接', link: '/components/link' },
          { text: 'Icon 图标', link: '/components/icon' },
        ],
      },
      {
        text: 'Form 表单组件',
        items: [
          { text: 'Input 输入框', link: '/components/input' },
          { text: 'Textarea 多行输入框', link: '/components/textarea' },
          { text: 'Select 选择器', link: '/components/select' },
          { text: 'TreeSelect 树形选择', link: '/components/tree-select' },
          { text: 'DatePicker 日期选择器', link: '/components/date-picker' },
          { text: 'TimePicker 时间选择器', link: '/components/time-picker' },
          { text: 'ColorPicker 颜色选择器', link: '/components/color-picker' },
          { text: 'Slider 滑块', link: '/components/slider' },
          { text: 'Switch 开关', link: '/components/switch' },
          { text: 'Checkbox 多选框', link: '/components/checkbox' },
          { text: 'Form 表单', link: '/components/form' },
        ],
      },
      {
        text: 'Data 数据展示',
        items: [
          { text: 'Panel 通用面板', link: '/components/panel' },
          { text: 'Card 卡片', link: '/components/card' },
          { text: 'ImagePreview 图片预览', link: '/components/image-preview' },
          { text: 'VirtualList 虚拟列表', link: '/components/virtual-list' },
          { text: 'VirtualTable 虚拟表格', link: '/components/virtual-table' },
        ],
      },
      {
        text: 'Navigation 导航',
        items: [
          { text: 'Pagination 分页', link: '/components/pagination' },
          { text: 'Dropdown 下拉菜单', link: '/components/dropdown' },
          { text: 'Menu 导航菜单', link: '/components/menu' },
          { text: 'MenuBar 应用菜单栏', link: '/components/menu-bar' },
          { text: 'MenuList 菜单列表', link: '/components/menu-list' },
          { text: 'Tabs 标签页', link: '/components/tabs' },
          { text: 'Tree 树形导航', link: '/components/tree' },
          { text: 'ContextMenu 右键菜单', link: '/components/context-menu' },
        ],
      },
      {
        text: 'Feedback 反馈组件',
        items: [
          { text: 'Popover 弹出层', link: '/components/popover' },
          { text: 'Popconfirm 气泡确认框', link: '/components/popconfirm' },
          { text: 'Tooltip 文字提示', link: '/components/tooltip' },
          { text: 'Dialog 对话框', link: '/components/dialog' },
          { text: 'Drawer 抽屉', link: '/components/drawer' },
          { text: 'Message 消息提示', link: '/components/message' },
          { text: 'MessageBox 消息确认框', link: '/components/message-box' },
        ],
      },
      {
        text: 'Application 应用组件',
        items: [
          { text: 'FloatingToolbar 浮动工具条', link: '/components/floating-toolbar' },
          { text: 'WindowTitleBar 窗口标题栏', link: '/components/window-title-bar' },
        ],
      },
    ],
    socialLinks: [],
    footer: {
      message: 'Aurora Plus · Vue 3 Component Library',
      copyright: 'Released for the Aurora Plus ecosystem',
    },
    search: {
      provider: 'local',
    },
  },
});
