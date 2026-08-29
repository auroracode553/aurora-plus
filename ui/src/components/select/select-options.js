function hasBooleanAttribute(value) {
  return value !== false && value != null;
}

function resolveChildren(children) {
  if (Array.isArray(children)) return children;
  if (typeof children?.default === 'function') return children.default();
  return children == null ? [] : [children];
}

function extractText(children) {
  if (children == null || typeof children === 'boolean') return '';
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (typeof children === 'object') return extractText(resolveChildren(children.children));
  return '';
}

/** 将 option/optgroup 插槽节点转换为不依赖 DOM 的列表数据。 */
export function normalizeSelectOptionNodes(nodes) {
  const groups = [];
  let optionSeed = 0;
  let groupSeed = 0;
  let looseGroup = null;

  function createGroup(node, label = '', disabled = false) {
    const group = {
      key: node?.key ?? `group-${++groupSeed}`,
      label: String(label ?? '').trim(),
      disabled,
      options: [],
    };
    groups.push(group);
    return group;
  }

  function appendOption(node, parentGroup) {
    const optionProps = node.props || {};
    const label = String(optionProps.label ?? extractText(node.children)).trim();
    const hasValue = Object.prototype.hasOwnProperty.call(optionProps, 'value');
    const group = parentGroup || looseGroup || (looseGroup = createGroup(null));

    group.options.push({
      key: node.key ?? `option-${++optionSeed}`,
      label,
      value: hasValue ? optionProps.value : label,
      disabled: group.disabled || hasBooleanAttribute(optionProps.disabled),
      hidden: hasBooleanAttribute(optionProps.hidden),
      title: optionProps.title == null ? undefined : String(optionProps.title),
    });
  }

  function visit(children, parentGroup = null) {
    for (const node of resolveChildren(children)) {
      if (Array.isArray(node)) {
        visit(node, parentGroup);
        continue;
      }
      if (!node || typeof node !== 'object') continue;

      // Vue Fragment、template 与条件渲染节点只承担分组作用。
      if (typeof node.type !== 'string') {
        visit(node.children, parentGroup);
        continue;
      }

      const tagName = node.type.toLowerCase();
      if (tagName === 'option') {
        appendOption(node, parentGroup);
        continue;
      }
      if (tagName !== 'optgroup') continue;

      looseGroup = null;
      const groupProps = node.props || {};
      const group = createGroup(
        node,
        groupProps.label,
        hasBooleanAttribute(groupProps.disabled),
      );
      visit(node.children, group);
      looseGroup = null;
    }
  }

  visit(nodes);
  return groups.filter((group) => group.options.length > 0);
}

/** 原生 select 按字符串比较并提交 option value，这里保持原有兼容行为。 */
export function toSelectValue(value) {
  return value == null ? '' : String(value);
}

export function isSameSelectValue(left, right) {
  return toSelectValue(left) === toSelectValue(right);
}

export function findAdjacentEnabledOption(options, currentIndex, direction) {
  if (options.length === 0) return -1;

  const step = direction < 0 ? -1 : 1;
  let index = currentIndex;
  for (let visited = 0; visited < options.length; visited += 1) {
    index = index < 0
      ? (step > 0 ? 0 : options.length - 1)
      : (index + step + options.length) % options.length;
    const option = options[index];
    if (!option.disabled && !option.hidden) return index;
  }
  return -1;
}
