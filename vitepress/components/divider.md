<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import DividerBasic from '../.vitepress/theme/examples/divider/DividerBasic.vue';
import dividerBasicSource from '../.vitepress/theme/examples/divider/DividerBasic.vue?demo-source';
</script>

# Divider 分割线

<DemoBlock :source="dividerBasicSource">
  <DividerBasic />
</DemoBlock>

## Divider API

### Attributes

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| `orientation` | 分割线方向 | `string` | `horizontal / vertical` | `horizontal` |

未声明的原生属性会透传到根元素。
