import './theme/index.css';

import { AuButton } from './components/button/index.js';
import { AuCloseButton } from './components/close-button/index.js';
import { AuContextMenu } from './components/context-menu/index.js';
import { AuDialog } from './components/dialog/index.js';
import { AuFloatingToolbar } from './components/floating-toolbar/index.js';
import { AuIcon, getIconSource, registerIcons, unregisterIcon } from './components/icon/index.js';
import { AuTooltip } from './components/tooltip/index.js';
import { AuVirtualList } from './components/virtual-list/index.js';
import { AuMessage } from './services/message/index.js';
import { AuMessageBox } from './services/message-box/index.js';

const components = [
  AuButton,
  AuCloseButton,
  AuContextMenu,
  AuDialog,
  AuFloatingToolbar,
  AuIcon,
  AuTooltip,
  AuVirtualList,
];

export const version = '0.1.0';

export const AuroraUI = {
  version,
  install(app, options = {}) {
    if (options.icons) registerIcons(options.icons);
    components.forEach((component) => app.component(component.componentName, component));
    app.config.globalProperties.$message = AuMessage;
    app.config.globalProperties.$messageBox = AuMessageBox;
    app.config.globalProperties.$confirm = AuMessageBox.confirm;
  },
};

export {
  AuButton,
  AuCloseButton,
  AuContextMenu,
  AuDialog,
  AuFloatingToolbar,
  AuIcon,
  AuMessage,
  AuMessageBox,
  AuTooltip,
  AuVirtualList,
  getIconSource,
  registerIcons,
  unregisterIcon,
};

export default AuroraUI;
