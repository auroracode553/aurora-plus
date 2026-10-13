<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import AvatarBasic from '../.vitepress/theme/examples/avatar/AvatarBasic.vue';
import exampleSource from '../.vitepress/theme/examples/avatar/AvatarBasic.vue?demo-source';
</script>

# Avatar 头像

`AuAvatar` 展示图片头像、姓名缩写或自定义内容。姓名缩写使用主题语义色，颜色随姓名保持稳定。

## 基础用法

<DemoBlock :source="exampleSource">
  <AvatarBasic />
</DemoBlock>

图片加载失败时显示默认插槽或姓名缩写。中文姓名取末两字，英文姓名取首尾单词首字母；空姓名显示 `?`。

## Avatar API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址 | string | '' |
| name | 姓名，用于缩写和默认图片说明 | string | '' |
| alt | 图片说明 | string | '' |
| size | small（24px）/ default（32px）/ large（40px），或正数像素值 | string \| number | default |
| shape | 形状：circle / square | string | circle |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| error | 图片加载失败 | (event) |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 无图片或加载失败时的替代内容 |
