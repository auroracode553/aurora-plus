<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import PanelBasic from '../.vitepress/theme/examples/panel/PanelBasic.vue';
import panelBasicSource from '../.vitepress/theme/examples/panel/PanelBasic.vue?demo-source';
</script>

# Panel 通用面板

`AuPanel` 只提供材质表面、边框、深度、尺寸、滚动能力和三个渲染插槽，不定义标题、状态、菜单或业务数据结构。

## 基础用法

<DemoBlock
  title="完全由插槽渲染的面板"
  :source="panelBasicSource"
>
  <PanelBasic />
</DemoBlock>

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

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `header` | 用户自定义头部内容 |
| `default` | 用户自定义主体内容 |
| `footer` | 用户自定义尾部内容 |
