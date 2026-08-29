<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import PanelBasic from '../.vitepress/theme/examples/panel/PanelBasic.vue';
import panelBasicSource from '../.vitepress/theme/examples/panel/PanelBasic.vue?demo-source';
</script>

# Panel 通用面板

`AuPanel` 只提供材质表面、边框、深度、尺寸、滚动能力和三个渲染插槽，不定义标题、状态、菜单或业务数据结构。用户可以在插槽中组合任意 Vue 内容。

## 基础用法

<DemoBlock
  title="完全由插槽渲染的面板"
  description="标题、说明、操作和反馈均由使用者提供，Panel 不解析任何业务字段。"
  :source="panelBasicSource"
  default-expanded
>
  <PanelBasic />
</DemoBlock>

## 设计边界

- `header`、`default`、`footer` 只提供区域位置，不生成标题或按钮。
- 普通静态内容容器使用 `AuCard`；需要明确头部、主体、尾部和主体滚动时使用 `AuPanel`。
- 锚定触发器显示时，在外层使用 `AuPopover` 并设置 `:surface="false"`。
- 操作入口可以使用 `AuMenuList` 与 `AuMenuListItem`；表单、图表或其他内容也可以直接放入插槽，没有组件绑定关系。

## API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `tag` | 根元素或动态组件 | `string / Component` | `section` |
| `padding` | 内容留白，可选 `none / compact / default / comfortable` | `string` | `default` |
| `depth` | 深度，可选 `none / surface / overlay` | `string` | `surface` |
| `bordered` | 是否显示材质边框 | `boolean` | `true` |
| `scrollable` | 主体区域是否独立滚动 | `boolean` | `false` |
| `width` | 面板宽度，数字自动转为 px | `string / number` | `''` |
| `maxHeight` | 最大高度，数字自动转为 px | `string / number` | `''` |
| `role` | 可选的无障碍角色 | `string` | `''` |
| `ariaLabel` | 面板无障碍名称 | `string` | `''` |
| `ariaLabelledby` | 标题元素 ID | `string` | `''` |
| `ariaDescribedby` | 说明元素 ID | `string` | `''` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `header` | 用户自定义头部内容 |
| `default` | 用户自定义主体内容 |
| `footer` | 用户自定义尾部内容 |
