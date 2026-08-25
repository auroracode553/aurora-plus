<script setup>
import ContextMenuDemo from '../.vitepress/theme/components/ContextMenuDemo.vue';
</script>

# 右键菜单

`AuContextMenu` 只负责菜单展示与交互，业务确认通过 `beforeSelect` 注入。

<ContextMenuDemo />

```vue
<AuContextMenu
  v-model="visible"
  :items="sections"
  :position="position"
  :before-select="beforeSelect"
  @select="runCommand"
/>
```

```js
async function beforeSelect(item) {
  if (!item.confirmMessage) return true;
  return AuMessageBox.confirm(item.confirmMessage);
}
```

## Section 类型

| type | 说明 |
| --- | --- |
| `button` / `item` | 单个菜单项 |
| `button-group` / `group` | 普通菜单项组 |
| `icon-row` | 单行图标按钮 |
| `icon-grid` | 图标网格 |
| `submenu` | 二级菜单 |
| `separator` | 分隔线 |

`select` 和兼容事件 `action` 都会返回被点击的 item；`beforeSelect` 返回 `false` 时触发 `cancel`。
