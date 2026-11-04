<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import SwitchBasic from '../.vitepress/theme/examples/switch/SwitchBasic.vue';
import switchBasicSource from '../.vitepress/theme/examples/switch/SwitchBasic.vue?demo-source';
</script>

# Switch 开关

用于在两个互斥状态之间快速切换。

实体滑块在普通切换时平滑移动，拖动时直接跟随指针；松手以行程中点吸附，再触发一次绑定值更新。纵向滚动接管、取消或进入禁用/加载态时恢复受控值。点击标签与键盘操作沿用同一提交入口，RTL 下拖动方向反转。

## 基础用法

<DemoBlock
  title="开关与自定义值"
  :source="switchBasicSource"
>
  <SwitchBasic />
</DemoBlock>

## Switch API

### Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前值 | boolean / string / number | false |
| activeValue | 开启时写入的值 | boolean / string / number | true |
| inactiveValue | 关闭时写入的值 | boolean / string / number | false |
| activeText | 开启时显示的文字 | string | '' |
| inactiveText | 关闭时显示的文字 | string | '' |
| size | 控件尺寸 | string | default |
| disabled | 是否禁用 | boolean | false |
| loading | 是否处于切换中 | boolean | false |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| update:modelValue | 切换后更新绑定值 | (value) |
| change | 切换完成后触发 | (value) |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义状态文字；存在时优先于 activeText / inactiveText |
