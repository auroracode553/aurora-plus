<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import InputBasic from '../.vitepress/theme/examples/input/InputBasic.vue';
import inputBasicSource from '../.vitepress/theme/examples/input/InputBasic.vue?demo-source';
import InputSizes from '../.vitepress/theme/examples/input/InputSizes.vue';
import inputSizesSource from '../.vitepress/theme/examples/input/InputSizes.vue?demo-source';
</script>

# Input 输入框

`AuInput` 通过 `type` 统一提供普通输入、搜索、密码和 `textarea` 多行输入。

## 基础用法

<DemoBlock
  title="常用输入状态"
  :source="inputBasicSource"
>
  <InputBasic />
</DemoBlock>

## 尺寸

单行输入框的 `small`、`default`、`large` 高度分别为 28、36、44px。视口宽度不超过 640px，或设备主要使用无悬停能力的触屏时，分别为 36、44、48px，输入文字为 16px。多行输入框仍由 `rows` 和内容高度决定。

<DemoBlock title="三种尺寸" :source="inputSizesSource">
  <InputSizes />
</DemoBlock>

## Input API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前输入值 | string / number | '' |
| type | 输入形态；textarea 渲染多行控件，其余值作为原生 input 类型 | string | text |
| size | 尺寸，可选 small / default / large | string | default |
| placeholder | 占位文字 | string | '' |
| disabled | 是否禁用 | boolean | false |
| loading | 是否处于加载中；开启时输入框不可编辑 | boolean | false |
| readonly | 是否只读 | boolean | false |
| clearable | 有内容时是否显示清除按钮 | boolean | false |
| showPasswordToggle | type="password" 时是否显示显示/隐藏切换 | boolean | false |
| clearableWhenReadonly | 原生输入只读时是否仍允许独立的清空操作 | boolean | false |
| replaceSuffixOnClear | 有内容且可清空时，是否用清除按钮替换后缀内容 | boolean | false |
| prefixIcon | 前缀图标组件 | Component | null |
| suffixIcon | 后缀图标组件 | Component | null |
| maxlength | 原生最大字符数 | number / string | null |
| rows | textarea 的初始行数 | number / string | 3 |
| resize | textarea 缩放方向：none / both / horizontal / vertical | string | vertical |
| showWordLimit | 设置 maxlength 后是否显示字数 | boolean | false |
| invalid | 是否手动显示错误状态；FormItem 的错误状态会自动合并 | boolean | false |
| validateEvent | 是否在输入和失焦时通知所属 FormItem 校验 | boolean | true |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 输入值变化 | (value) |
| input | 完成一次有效输入 | (value, event) |
| change | 触发原生 change | (value, event) |
| clear | 点击清除按钮 | () |
| focus | 输入框获得焦点 | (event) |
| blur | 输入框失去焦点 | (event) |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| prefix | 自定义前缀，优先于 prefixIcon |
| suffix | 自定义后缀，优先于 suffixIcon |

### Exposes

| 属性或方法 | 说明 |
| --- | --- |
| focus(options?) | 聚焦原生输入框 |
| blur() | 移除焦点 |
| select() | 选中全部文字 |
| inputRef | 原生 input 元素引用 |
