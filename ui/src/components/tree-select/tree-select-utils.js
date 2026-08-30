function resolveChildren(node, childrenKey) {
  return Array.isArray(node?.[childrenKey]) ? node[childrenKey] : [];
}

export function findTreeNode(nodes, key, itemKey = 'id', childrenKey = 'children') {
  for (const node of nodes || []) {
    if (Object.is(node?.[itemKey], key)) return node;
    const childMatch = findTreeNode(resolveChildren(node, childrenKey), key, itemKey, childrenKey);
    if (childMatch) return childMatch;
  }
  return null;
}

export function collectParentKeys(nodes, itemKey = 'id', childrenKey = 'children') {
  const keys = [];
  function visit(items) {
    items.forEach((node) => {
      const children = resolveChildren(node, childrenKey);
      if (children.length > 0) {
        keys.push(node?.[itemKey]);
        visit(children);
      }
    });
  }
  visit(nodes || []);
  return keys;
}

export function collectAncestorKeys(
  nodes,
  targetKey,
  itemKey = 'id',
  childrenKey = 'children',
) {
  function visit(items, ancestors) {
    for (const node of items) {
      if (Object.is(node?.[itemKey], targetKey)) return ancestors;
      const result = visit(
        resolveChildren(node, childrenKey),
        [...ancestors, node?.[itemKey]],
      );
      if (result) return result;
    }
    return null;
  }
  return visit(nodes || [], []) || [];
}

export function flattenVisibleTree(nodes, options = {}) {
  const {
    itemKey = 'id',
    labelKey = 'label',
    childrenKey = 'children',
    disabledKey = 'disabled',
    expandedKeys = new Set(),
    query = '',
    leafOnly = false,
  } = options;
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const rows = [];

  function filterNode(node) {
    const children = resolveChildren(node, childrenKey);
    const filteredChildren = children.map(filterNode).filter(Boolean);
    const matches = String(node?.[labelKey] ?? '').toLocaleLowerCase().includes(normalizedQuery);
    return matches || filteredChildren.length > 0 ? { node, children: filteredChildren } : null;
  }

  function append(node, depth, filteredChildren = null) {
    const originalChildren = resolveChildren(node, childrenKey);
    const children = filteredChildren ?? originalChildren.map((child) => ({
      node: child,
      children: null,
    }));
    const hasChildren = originalChildren.length > 0;
    const expanded = normalizedQuery || expandedKeys.has(node?.[itemKey]);
    rows.push({
      ...node,
      displayDepth: depth,
      hasChildren,
      isCollapsed: hasChildren && !expanded,
      __disabled: Boolean(node?.[disabledKey]) || (leafOnly && hasChildren),
    });
    if (!hasChildren || !expanded) return;
    children.forEach((child) => append(child.node, depth + 1, child.children));
  }

  if (normalizedQuery) {
    (nodes || []).map(filterNode).filter(Boolean).forEach((entry) => append(entry.node, 0, entry.children));
  } else {
    (nodes || []).forEach((node) => append(node, 0));
  }
  return rows;
}
