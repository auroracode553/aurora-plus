// 获取相对定位容器的布局尺寸；独立 scale/translate 不参与选中层和列表定位。
export function getLayoutBox(element, container) {
  let x = element.offsetLeft;
  let y = element.offsetTop;
  for (let parent = element.offsetParent; parent && parent !== container; parent = parent.offsetParent) {
    x += parent.offsetLeft + parent.clientLeft - parent.scrollLeft;
    y += parent.offsetTop + parent.clientTop - parent.scrollTop;
  }
  const computed = getComputedStyle(element);
  const borderBox = computed.boxSizing === 'border-box';
  const extra = (properties) => borderBox ? 0 : properties.reduce((sum, key) => sum + (Number.parseFloat(computed[key]) || 0), 0);
  const width = Number.parseFloat(computed.width) + extra(['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth']);
  const height = Number.parseFloat(computed.height) + extra(['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth']);
  return { x, y, width: Number.isFinite(width) ? width : element.offsetWidth, height: Number.isFinite(height) ? height : element.offsetHeight };
}
