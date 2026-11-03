// 框架外浮层的静态样式适配器；内置组件直接使用公共 CSS，不创建逐实例绘制器。
export function createAuroraGlassSurface(element, initialOptions = {}) {
  let options = { role: 'navigation', enabled: true, ...initialOptions };
  const original = new Map();
  const written = new Map();
  const hadControlClass = element.classList.contains('au-motion-control');

  function write(property, value) {
    if (!original.has(property)) original.set(property, element.style[property]);
    if (element.style[property] !== value) element.style[property] = value;
    written.set(property, element.style[property]);
  }

  function apply() {
    const enabled = options.enabled !== false;
    const filter = !enabled || options.sample === false || options.role === 'button' ? 'none'
      : options.role === 'dialog' ? 'blur(var(--au-glass-dialog-blur)) saturate(1.5)'
        : 'blur(var(--au-surface-blur)) saturate(var(--au-surface-saturation))';
    write('backdropFilter', filter);
    write('webkitBackdropFilter', filter);
    if (options.role === 'button') {
      write('boxShadow', enabled && options.shadow !== false ? 'var(--au-shadow-control)' : 'none');
    }
    element.classList.toggle('au-motion-control', hadControlClass || Boolean(enabled && options.interactive));
  }

  apply();
  return {
    update(nextOptions = {}) { options = { ...options, ...nextOptions }; apply(); },
    destroy() {
      if (!hadControlClass) element.classList.remove('au-motion-control');
      written.forEach((value, property) => {
        if (element.style[property] === value) element.style[property] = original.get(property);
      });
    },
  };
}
