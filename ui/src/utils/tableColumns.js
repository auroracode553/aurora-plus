import { computed, Fragment } from 'vue';

function readColumnProp(props, name, kebabName = name) {
  return props?.[name] ?? props?.[kebabName];
}

function collectColumns(nodes, output) {
  for (const node of nodes || []) {
    if (!node) continue;
    if (Array.isArray(node)) { collectColumns(node, output); continue; }
    if (node.type === Fragment) { collectColumns(node.children, output); continue; }
    if (node.type?.componentName !== 'AuTableColumn') continue;

    const props = node.props || {};
    const prop = readColumnProp(props, 'prop') || '';
    const slot = node.children && !Array.isArray(node.children) ? node.children : {};
    output.push({
      key: node.key ?? (prop || `column-${output.length}`),
      type: readColumnProp(props, 'type') || 'default',
      dataKey: prop,
      title: readColumnProp(props, 'label') ?? '',
      width: readColumnProp(props, 'width'),
      minWidth: readColumnProp(props, 'minWidth', 'min-width'),
      maxWidth: readColumnProp(props, 'maxWidth', 'max-width'),
      flexGrow: readColumnProp(props, 'flexGrow', 'flex-grow'),
      align: readColumnProp(props, 'align'),
      fixed: readColumnProp(props, 'fixed') === '' ? true : readColumnProp(props, 'fixed'),
      sortable: readColumnProp(props, 'sortable') === '' || readColumnProp(props, 'sortable') === true,
      selectable: readColumnProp(props, 'selectable'),
      sortMethod: readColumnProp(props, 'sortMethod', 'sort-method'),
      formatter: readColumnProp(props, 'formatter'),
      class: readColumnProp(props, 'columnClass', 'column-class'),
      renderHeader: slot.header,
      renderCell: slot.default,
    });
  }
}

// 在表格渲染时读取声明式列，保留 v-if / v-for 的真实顺序。
export function useTableColumns(slots) {
  return computed(() => {
    const columns = [];
    collectColumns(slots.default?.(), columns);
    return columns;
  });
}
