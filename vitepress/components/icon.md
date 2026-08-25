<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import IconBasic from '../.vitepress/theme/examples/icon/IconBasic.vue';
import iconBasicSource from '../.vitepress/theme/examples/icon/IconBasic.vue?raw';
</script>

# Icon 图标

`AuIcon` 渲染内置或已注册的 SVG。组件库内置 `close`、`loading`、`chevron-right`，业务图标由应用显式注册，组件库不会扫描宿主项目目录。

## 基础用法

<DemoBlock
  title="名称、颜色、尺寸与 SVG 源码"
  description="前三个图标读取注册表，最后一个图标直接使用可信 source。"
  :source="iconBasicSource"
>
  <IconBasic />
</DemoBlock>

## 注册业务图标

建议在应用入口集中注册，组件内只使用稳定的图标名称：

```js
import saveIcon from './assets/save.svg?raw';
import { registerIcons } from 'aurora-ui';

registerIcons({ save: saveIcon });
```

完整安装时也可以通过插件选项注入：

```js
app.use(AuroraUI, {
  icons: { save: saveIcon },
});
```

::: warning 安全边界
`source` 和注册表中的 SVG 会通过 `v-html` 渲染。只允许传入项目内可信的 SVG 源码，不要传入用户输入或未经清洗的远程内容。
:::

## Icon API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `name` | 注册表中的图标名称 | `string` | `''` |
| `source` | 直接渲染的可信 SVG；优先级高于 `name` | `string` | `''` |
| `color` | 图标颜色，SVG 通常应使用 `currentColor` | `string` | `''` |
| `size` | 宽、高及字号；数字会转换为 px | `string / number` | `''` |
| `ariaLabel` | 图标的无障碍名称；为空时设置 `aria-hidden` | `string` | `''` |

其他 HTML 属性会透传到图标根节点 `<span>`。

### 图标注册方法

| 方法 | 参数 | 说明 |
| --- | --- | --- |
| `registerIcons(icons, options?)` | `Record<string, string>`, `{ overwrite?: boolean }` | 批量注册 SVG；`overwrite` 默认为 `true` |
| `unregisterIcon(name)` | `string` | 删除指定业务图标 |
| `getIconSource(name)` | `string` | 获取 SVG 字符串；不存在时返回空字符串 |

带命名空间的名称会自动取最后一段，例如 `mdi:close` 与 `close` 使用同一个注册键。
