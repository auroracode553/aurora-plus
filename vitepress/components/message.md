<script setup>
import DemoBlock from '../.vitepress/theme/components/DemoBlock.vue';
import MessageBasic from '../.vitepress/theme/examples/message/MessageBasic.vue';
import messageBasicSource from '../.vitepress/theme/examples/message/MessageBasic.vue?demo-source';
</script>

# Message 消息提示

在页面顶部展示非阻塞反馈。

## 基础用法

<DemoBlock
  title="消息类型与合并"
  :source="messageBasicSource"
>
  <MessageBasic />
</DemoBlock>

## 调用方式

```js
import { AuMessage } from 'aurora-plus';

const handler = AuMessage.success('保存成功');
handler.close();

AuMessage.warning({
  message: '请检查输入内容',
  duration: 3000,
  showClose: true,
});
```

## Message API

### 方法

| 方法 | 参数 | 返回值 | 说明 |
| --- | --- | --- | --- |
| AuMessage(options) | string / number / AuMessageOptions | AuMessageHandler | 打开消息；未指定类型时为 info |
| AuMessage.success(options) | 同上 | AuMessageHandler | 打开成功消息 |
| AuMessage.warning(options) | 同上 | AuMessageHandler | 打开警告消息 |
| AuMessage.info(options) | 同上 | AuMessageHandler | 打开信息消息 |
| AuMessage.error(options) | 同上 | AuMessageHandler | 打开错误消息 |
| AuMessage.closeAll() | — | void | 关闭当前全部消息 |

### Options

| 配置 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| message | 消息正文 | string / number | 必填 |
| type | 消息类型 | success / warning / info / error | info |
| duration | 显示时长，单位 ms；0 表示常驻 | number | 2000 |
| showClose | 是否显示关闭按钮 | boolean | false |
| grouping | 是否合并相同类型与正文并累加次数 | boolean | false |
| offset | 消息容器距视口顶部的距离，单位 px | number | 20 |
| onClose | 消息关闭后的回调 | () =&gt; void | — |
