<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import CollapseBasic from '../.vitepress/theme/examples/collapse/CollapseBasic.vue';
import collapseBasicSource from '../.vitepress/theme/examples/collapse/CollapseBasic.vue?demo-source';
</script>

# Collapse 折叠面板

`AuCollapseItem` 提供紧凑的标题、摘要、展开入口与完整内容区域，可独立使用。`AuCollapse` 管理多个子项的展开状态；开启 `accordion` 后成为手风琴，同一时间只展开一项。

## 基础用法

<DemoBlock title="独立面板、多项展开与手风琴" :source="collapseBasicSource">
  <CollapseBasic />
</DemoBlock>

分组内的子项必须提供唯一 `name`，展开状态由 `AuCollapse` 控制，子项的 `v-model` 与 `default-open` 不参与分组状态。

## AuCollapse Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model-value / v-model | 当前展开名称；多项为数组，手风琴为单值或 null | array / string / number / null | 未指定 |
| default-value | 非受控时的初始展开名称 | array / string / number | [] |
| accordion | 是否只允许一项展开 | boolean | false |
| disabled | 是否禁止整组切换 | boolean | false |
| size | 子项默认尺寸：small / default | string | default |

## AuCollapseItem Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 分组内的唯一名称；独立使用可省略 | string / number | 未指定 |
| model-value / v-model | 独立使用时是否展开 | boolean | 未指定 |
| default-open | 独立非受控时的初始展开状态 | boolean | false |
| title | 标题 | string | 更多信息 |
| summary | 简短摘要 | string | '' |
| disabled | 是否禁止切换 | boolean | false |
| lazy | 是否延迟到首次展开再挂载 | boolean | false |
| destroy-on-close | 关闭时是否卸载正文 | boolean | false |
| fill | 填满具有确定高度的父容器，并独立滚动正文 | boolean | false |
| size | small / default；省略时继承分组尺寸 | string | default |
| variant | panel 表面 / plain 透明嵌入 | string | panel |

## Events

`change` 只在用户点击切换时触发；受控模式需回写 `v-model`，外部更新值不触发该事件。

| 组件 | 事件 | 参数 |
| --- | --- | --- |
| AuCollapse | update:modelValue、change | 多项为名称数组；手风琴为名称或 null |
| AuCollapseItem | update:modelValue | 独立使用时的下一展开布尔值 |
| AuCollapseItem | change | 下一展开布尔值 |

## Slots

`AuCollapse` 的默认插槽放置子项。`AuCollapseItem` 所有插槽均提供 `{ expanded }`。

| 子项插槽 | 说明 |
| --- | --- |
| title | 标题内容 |
| summary | 标题旁的摘要内容 |
| icon | 标题前的图标 |
| actions | 独立操作区，可放按钮；不会触发展开 |
| default | 完整正文 |

标题、摘要和图标位于展开按钮内，只放文字或非交互内容；其他操作放入 `actions`。
