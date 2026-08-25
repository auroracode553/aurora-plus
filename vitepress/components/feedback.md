<script setup>
import FeedbackDemo from '../.vitepress/theme/components/FeedbackDemo.vue';
</script>

# 反馈组件

<FeedbackDemo />

## AuMessage

```js
import { AuMessage } from 'aurora-ui';

AuMessage.success('保存成功');
AuMessage.warning({
  message: '请检查输入内容',
  duration: 3000,
  showClose: true,
});
```

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `message` | `string / number` | 空 | 消息内容 |
| `type` | `success / warning / info / error` | `info` | 消息类型 |
| `duration` | `number` | `2000` | 持续毫秒数，`0` 表示常驻 |
| `showClose` | `boolean` | `false` | 显示关闭按钮 |
| `grouping` | `boolean` | `false` | 合并相同类型与文本 |
| `onClose` | `function` | 空 | 关闭回调 |

## AuMessageBox

```js
const confirmed = await AuMessageBox.confirm({
  title: '请确认',
  message: '是否删除当前记录？',
  confirmButtonType: 'danger',
});
```

多个命令式确认框会按调用顺序排队，不会覆盖前一个未完成 Promise。

## AuDialog

```vue
<AuDialog v-model="visible" title="设置" width="520px">
  对话框内容
  <template #footer>
    <AuButton @click="visible = false">取消</AuButton>
    <AuButton type="primary">确定</AuButton>
  </template>
</AuDialog>
```

`close` 事件参数会指出关闭来源：`api`、`overlay`、`escape` 或 `close-button`。
