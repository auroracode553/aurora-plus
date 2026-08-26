import { env } from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitepress';
import { demoSourcePlugin } from './demo-source-plugin.js';

const siteBase = env.VITEPRESS_BASE || '/';

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
    plugins: [demoSourcePlugin()],
    resolve: {
      alias: {
        'aurora-ui': fileURLToPath(new URL('../../ui/src/index.js', import.meta.url)),
      },
      dedupe: ['vue'],
    },
    server: {
      fs: {
        allow: [fileURLToPath(new URL('../..', import.meta.url))],
      },
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
          { text: '主题定制', link: '/guide/theme' },
        ],
      },
      {
        text: '基础组件',
        items: [
          { text: 'Button 按钮', link: '/components/button' },
          { text: 'ButtonGroup 按钮组', link: '/components/button-group' },
          { text: 'Icon 图标', link: '/components/icon' },
          { text: 'Tooltip 文字提示', link: '/components/tooltip' },
        ],
      },
      {
        text: '反馈组件',
        items: [
          { text: 'Message 消息提示', link: '/components/message' },
          { text: 'MessageBox 消息确认框', link: '/components/message-box' },
          { text: 'Dialog 对话框', link: '/components/dialog' },
        ],
      },
      {
        text: '数据与浮层',
        items: [
          { text: 'Card 卡片', link: '/components/card' },
          { text: '虚拟列表', link: '/components/virtual-list' },
          { text: '右键菜单', link: '/components/context-menu' },
          { text: '浮动工具条', link: '/components/floating-toolbar' },
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
