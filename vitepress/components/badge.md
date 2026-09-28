<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import BadgeBasic from '../.vitepress/theme/examples/badge/BadgeBasic.vue';
import badgeBasicSource from '../.vitepress/theme/examples/badge/BadgeBasic.vue?demo-source';
</script>

# Badge 徽章

在按钮、图标等内容的右上角显示数量或状态，也可以单独作为行内标记。

## 基础用法

<DemoBlock
  title="方形与圆形主体"
  :source="badgeBasicSource"
>
  <BadgeBasic />
</DemoBlock>

## 自定义内容

```vue
<AuBadge :value="3" type="primary">
  <AuButton>通知</AuButton>
  <template #content="{ value }">{{ value }} 条</template>
</AuBadge>
```

## Badge API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 标记内容；空字符串时不显示 | string / number | '' |
| max | 数字超过此值时显示 {max}+ | number | 99 |
| isDot | 显示状态点，优先于内容 | boolean | false |
| hidden | 隐藏标记 | boolean | false |
| showZero | 值为数字零时是否显示 | boolean | true |
| type | 语义色：primary、success、warning、danger、info | string | danger |
| color | 自定义背景色 | string | '' |
| offset | 相对右上角向左、向下的偏移，单位 px | [number, number] | [0, 0] |
| badgeClass | 标记元素附加类名 | string | '' |
| badgeStyle | 标记元素附加样式 | object | {} |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 被标记的内容；省略时徽章独立显示 |
| content | 自定义标记内容，插槽参数为 { value } |
