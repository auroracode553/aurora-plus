import { fileURLToPath, URL } from 'node:url';
import { env } from 'node:process';
import { defineConfig } from 'vitepress';
import { demoSourcePlugin } from './demo-source-plugin.js';
import { iconMetadataPlugin } from './icon-metadata-plugin.js';

const siteBase = env.VITEPRESS_BASE || '/';
const useAuroraDist = env.AURORA_UI_USE_DIST === 'true';
const docsRoot = fileURLToPath(new URL('..', import.meta.url));
const auroraRoot = fileURLToPath(new URL('../../ui', import.meta.url));
const auroraSourceAliases = useAuroraDist
  ? []
  : [
      {
        find: /^aurora-ui$/,
        replacement: fileURLToPath(
          new URL('../../ui/src/index.js', import.meta.url),
        ),
      },
      {
        find: /^aurora-ui\/style\.css$/,
        replacement: fileURLToPath(
          new URL('../../ui/src/theme/index.css', import.meta.url),
        ),
      },
    ];

export default defineConfig({
  base: siteBase,
  lang: 'zh-CN',
  title: 'Aurora UI',
  description: '从 Aurora Editor 抽离的 Vue 3 通用组件库',
  cleanUrls: true,
  lastUpdated: false,
  head: [
    ['meta', { name: 'theme-color', content: '#409eff' }],
  ],
  vite: {
    plugins: [demoSourcePlugin(), iconMetadataPlugin()],
    resolve: {
      alias: auroraSourceAliases,
      dedupe: ['vue'],
    },
    server: useAuroraDist
      ? undefined
      : {
          fs: {
            // 源码位于文档根目录之外，需要显式允许开发服务器读取。
            allow: [docsRoot, auroraRoot],
          },
        },
    optimizeDeps: {
      // 避免源码别名被依赖预构建缓存，保留组件修改后的即时更新。
      exclude: ['aurora-ui'],
    },
  },
  themeConfig: {
    siteTitle: 'Aurora UI',
    outline: {
      level: [2, 3],
      label: '本页内容',
    },
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: '组件', link: '/components/button' },
    ],
    sidebar: [
      {
        text: '开始使用',
        items: [
          { text: '介绍', link: '/guide/introduction' },
          { text: '快速开始', link: '/guide/getting-started' },
          { text: '主题配置', link: '/guide/theme' },
        ],
      },
      {
        text: 'Basic 基础组件',
        items: [
          { text: 'Button 按钮', link: '/components/button' },
          { text: 'ButtonGroup 按钮组', link: '/components/button-group' },
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
          { text: 'ColorPicker 颜色选择器', link: '/components/color-picker' },
          { text: 'Switch 开关', link: '/components/switch' },
          { text: 'Checkbox 多选框', link: '/components/checkbox' },
        ],
      },
      {
        text: 'Data 数据展示',
        items: [
          { text: 'Panel 通用面板', link: '/components/panel' },
          { text: 'Card 卡片', link: '/components/card' },
          { text: 'VirtualList 虚拟列表', link: '/components/virtual-list' },
        ],
      },
      {
        text: 'Navigation 导航',
        items: [
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
          { text: 'Tooltip 文字提示', link: '/components/tooltip' },
          { text: 'Dialog 对话框', link: '/components/dialog' },
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
      message: 'Aurora UI · Vue 3 Component Library',
      copyright: 'Released for the Aurora ecosystem',
    },
    search: {
      provider: 'local',
    },
  },
});
