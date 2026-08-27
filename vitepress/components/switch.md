<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import SwitchBasic from '../.vitepress/theme/examples/switch/SwitchBasic.vue';
import switchBasicSource from '../.vitepress/theme/examples/switch/SwitchBasic.vue?demo-source';
</script>

# Switch 开关

用于在两个互斥状态之间快速切换。

## 基础用法

<DemoBlock
  title="开关与自定义值"
  description="支持文字状态、异步前的 loading 状态，以及不局限于 true/false 的业务值。"
  :source="switchBasicSource"
>
  <SwitchBasic />
</DemoBlock>

## 使用建议

- 开关表示立即生效的二元设置；需要确认后再执行的操作应使用 `AuCheckbox` 或按钮。
- `activeValue` 和 `inactiveValue` 可以映射为字符串、数字等业务值。
- 请求进行中使用 `loading`，它会同时阻止重复切换；不可操作时使用 `disabled`。
- 只有图形没有文字时，请通过透传的 `aria-label` 为开关提供名称。

## Switch API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `modelValue` | 当前值 | `boolean / string / number` | `false` |
| `activeValue` | 开启时写入的值 | `boolean / string / number` | `true` |
| `inactiveValue` | 关闭时写入的值 | `boolean / string / number` | `false` |
| `activeText` | 开启时显示的文字 | `string` | `''` |
| `inactiveText` | 关闭时显示的文字 | `string` | `''` |
| `size` | 控件尺寸 | `string` | `default` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `loading` | 是否处于切换中 | `boolean` | `false` |

`size` 可选 `small`、`default`、`large`。未声明的原生属性会透传到按钮，例如 `aria-label`、`name` 和 `id`。

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 切换后更新绑定值 | `(value)` |
| `change` | 切换完成后触发 | `(value)` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义状态文字；存在时优先于 `activeText` / `inactiveText` |

组件渲染为原生 `button[role="switch"]`，键盘 Enter 和 Space 均可切换，并同步 `aria-checked`。
