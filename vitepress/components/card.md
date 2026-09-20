<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import CardBasic from '../.vitepress/theme/examples/card/CardBasic.vue';
import cardBasicSource from '../.vitepress/theme/examples/card/CardBasic.vue?demo-source';
import CardVariants from '../.vitepress/theme/examples/card/CardVariants.vue';
import cardVariantsSource from '../.vitepress/theme/examples/card/CardVariants.vue?demo-source';
</script>

# Card 卡片

`AuCard` 是内容容器组件，提供材质表面、圆角、可选边框/阴影和内边距。默认 `outlined` 变体用细边框配轻阴影勾勒轮廓，卡片在浅色背景上边界清晰；`flat` 提供无边框无阴影的极简表面。

## 基础用法

<DemoBlock
  title="空卡片容器"
  description="内容完全由插槽提供，组件不解析任何业务字段。"
  :source="cardBasicSource"
>
  <CardBasic />
</DemoBlock>

## 变体

<DemoBlock
  title="三种表面层级"
  description="outlined 为默认细边框 + 轻阴影；flat 无边框无阴影；elevated 用更明显的阴影浮起。"
  :source="cardVariantsSource"
>
  <CardVariants />
</DemoBlock>

- `outlined`（默认）：细边框 + 轻阴影，轮廓清晰，适合日常卡片、列表与看板场景。
- `flat`：无边框、无阴影的极简表面，适合已经有明确容器边界或需要完全平面的场景。
- `elevated`：细边框 + 更明显的阴影，让卡片从背景中浮起，适合可拖拽或悬浮的场景。

## 设计边界

- 卡片只做表面容器，不承载选中、禁用等业务语义。
- 阴影仅使用全局语义阴影，禁止高光渐变、内发光、反射层与厚重阴影。
- 卡片列表的间距由使用方容器控制（如 `display: grid; gap`），组件自身不注入外边距。
- 静态分组内容优先使用 `AuCard`；需要明确头部、主体、尾部和主体滚动时使用 `AuPanel`。
- 浮层（如 `AuPopover`）内使用卡片时设置 `:surface="false"`，避免重复材质层。

## API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `tag` | 根元素或动态组件 | `string / Component` | `div` |
| `variant` | 表面层级，可选 `outlined / flat / elevated` | `string` | `outlined` |
| `padding` | 内容留白，可选 `none / compact / default / comfortable` | `string` | `default` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 卡片内容 |
