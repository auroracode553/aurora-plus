<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import MessageBoxBasic from '../.vitepress/theme/examples/message-box/MessageBoxBasic.vue';
import messageBoxBasicSource from '../.vitepress/theme/examples/message-box/MessageBoxBasic.vue?demo-source';
</script>

# MessageBox 消息确认框

命令式确认框，返回 `Promise<boolean>`。适合删除、发布等必须先获得用户选择的流程；多个调用会按先入先出顺序排队。

## 基础用法

<DemoBlock
  title="数据驱动的确认动作"
  description="发布与删除配置来自 confirmActions 数组，点击后展示不同的确认配置。"
  :source="messageBoxBasicSource"
>
  <MessageBoxBasic />
</DemoBlock>

## 异步关闭校验

`beforeClose` 可同步或异步返回 `false` 阻止关闭，适合提交前校验或保存：

```js
const confirmed = await AuMessageBox.confirm({
  title: '保存并发布',
  message: '确认提交当前版本吗？',
  async beforeClose(action) {
    if (action !== 'confirm') return true;
    return await validateRelease();
  },
});
```

## MessageBox API

### 方法

| 方法 | 参数 | 返回值 | 说明 |
| --- | --- | --- | --- |
| `AuMessageBox(options)` | `string / number / AuMessageBoxOptions` | `Promise<boolean>` | 打开确认框 |
| `AuMessageBox.confirm(options)` | 同上 | `Promise<boolean>` | 语义更明确的等价调用 |
| `AuMessageBox.close()` | — | `void` | 关闭当前确认框并以 `false` 完成 Promise |

点击确定返回 `true`；点击取消、关闭按钮、遮罩或按 Escape 返回 `false`。`beforeClose` 抛出的错误会使 Promise reject。

### Options

| 配置 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 标题 | `string` | `''` |
| `message` | 正文 | `string / number` | 必填 |
| `width` | 确认框宽度 | `string / number` | `min(420px, calc(100vw - 32px))` |
| `confirmButtonText` | 确定按钮文案 | `string` | `确定` |
| `cancelButtonText` | 取消按钮文案 | `string` | `取消` |
| `confirmText` | `confirmButtonText` 的兼容别名 | `string` | — |
| `cancelText` | `cancelButtonText` 的兼容别名 | `string` | — |
| `confirmButtonType` | 确定按钮的 `AuButton` 类型 | `AuButtonType` | `primary` |
| `showCancelButton` | 是否显示取消按钮 | `boolean` | `true` |
| `showClose` | 是否显示右上角关闭按钮 | `boolean` | `true` |
| `closeLabel` | 关闭按钮的无障碍名称与提示 | `string` | `关闭` |
| `closeOnClickModal` | 是否允许点击遮罩关闭 | `boolean` | `false` |
| `closeOnPressEscape` | 是否允许按 Escape 关闭 | `boolean` | `true` |
| `beforeClose` | 关闭前守卫 | `(action, options) => boolean \| Promise<boolean>` | — |

`action` 的可选值为 `confirm`、`cancel`、`close`。
