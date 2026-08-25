<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import ButtonBasic from '../.vitepress/theme/examples/button/ButtonBasic.vue';
import buttonBasicSource from '../.vitepress/theme/examples/button/ButtonBasic.vue?demo-source';
</script>

# Button 按钮

常用的操作触发器。支持六种视觉类型、三种尺寸、加载态、禁用态以及图标插槽。

## 基础用法

按钮列表、尺寸列表和交互状态都由示例脚本中的真实数据驱动。展开源码可以直接查看并复制 `buttonTypes`、`buttonSizes`、`saving` 和 `lastAction`。

<DemoBlock
  title="类型、状态与尺寸"
  description="点击类型按钮可查看事件结果；加载按钮展示 loading 对点击和禁用状态的影响。"
  :source="buttonBasicSource"
>
  <ButtonBasic />
</DemoBlock>

## 使用建议

- 一个操作区域通常只保留一个 `primary` 按钮，避免多个主操作争夺注意力。
- 异步提交期间使用 `loading`。加载状态会同时禁用按钮，防止重复提交。
- 只有图标的按钮应提供 `aria-label`，让读屏软件能够说明按钮用途。
- 表单内若不希望触发表单提交，保留默认的 `native-type="button"`。

## Button API

### Attributes

| 属性 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| `type` | 视觉类型 | `string` | `default / primary / success / info / warning / danger` | `default` |
| `size` | 按钮尺寸 | `string` | `small / default / large` | `default` |
| `nativeType` | 原生 `button` 的 `type` | `string` | `button / submit / reset` | `button` |
| `icon` | 已注册的图标名称 | `string` | — | `''` |
| `plain` | 是否使用朴素样式 | `boolean` | — | `false` |
| `round` | 是否使用胶囊圆角 | `boolean` | — | `false` |
| `circle` | 是否为圆形图标按钮 | `boolean` | — | `false` |
| `disabled` | 是否禁用 | `boolean` | — | `false` |
| `loading` | 是否显示加载状态；开启时按钮不可点击 | `boolean` | — | `false` |

未被组件声明的属性（例如 `aria-label`、`autofocus`、`form`）会透传到原生 `<button>`。

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `click` | 按钮可用且不处于加载状态时触发 | `(event: MouseEvent)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 按钮文字或其他内容 |
| `icon` | 覆盖 `icon` 属性对应的默认图标 |
| `loading` | 覆盖加载状态的默认旋转图标 |
