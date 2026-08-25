import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'zh-CN',
  title: 'Aurora UI',
  description: '从 Aurora Editor 抽离的 Vue 3 通用组件库',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#409eff' }],
  ],
  vite: {
    resolve: {
      alias: {
        'aurora-ui': fileURLToPath(new URL('../../src/index.js', import.meta.url)),
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
      { text: '组件', link: '/components/overview' },
      { text: '开发', link: '/development/architecture' },
      { text: 'v0.1.0', items: [{ text: '更新记录', link: '/development/changelog' }] },
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
        text: '组件',
        items: [
          { text: '组件总览', link: '/components/overview' },
          { text: '基础组件', link: '/components/basic' },
          { text: '反馈组件', link: '/components/feedback' },
          { text: '虚拟列表', link: '/components/virtual-list' },
          { text: '右键菜单', link: '/components/context-menu' },
          { text: '浮动工具条', link: '/components/floating-toolbar' },
        ],
      },
      {
        text: '开发说明',
        items: [
          { text: '代码架构', link: '/development/architecture' },
          { text: '抽离清单', link: '/development/extraction-audit' },
          { text: '更新记录', link: '/development/changelog' },
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
