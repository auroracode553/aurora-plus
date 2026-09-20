<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import CardBasic from '../.vitepress/theme/examples/card/CardBasic.vue';
import cardBasicSource from '../.vitepress/theme/examples/card/CardBasic.vue?demo-source';
import CardVariants from '../.vitepress/theme/examples/card/CardVariants.vue';
import cardVariantsSource from '../.vitepress/theme/examples/card/CardVariants.vue?demo-source';
</script>

# Card 卡片

`AuCard` 是内容容器组件，提供材质表面、圆角、可选边框/阴影和内边距。通过 `type` 切换卡片外观，类似按钮的类型封装。

## 基础用法

<DemoBlock
  title="空卡片容器"
  description="内容完全由插槽提供，组件不解析任何业务字段。"
  :source="cardBasicSource"
>
  <CardBasic />
</DemoBlock>

## 类型

<DemoBlock
  title="四种卡片类型"
  description="default 为白卡细边框 + 轻阴影；flat 纯白无边框；elevated 浮起；subtle 浅灰面。"
  :source="cardVariantsSource"
>
  <CardVariants />
</DemoBlock>

- `default`（默认）：白卡 + 细边框 + 轻阴影，轮廓清晰，适合日常卡片与看板。
- `flat`：纯白表面，无边框无阴影，适合已有明确容器边界的场景。
- `elevated`：细边框 + 更明显的阴影，让卡片从背景中浮起。
- `subtle`：浅灰表面，无边框无阴影，适合次级信息分组与内容分区。

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
| `type` | 卡片类型，可选 `default / flat / elevated / subtle` | `string` | `default` |
| `padding` | 内容留白，可选 `none / compact / default / comfortable` | `string` | `default` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 卡片内容 |
