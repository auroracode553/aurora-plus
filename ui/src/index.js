import './theme/index.css';

import { AuButton } from './components/button/index.js';
import { AuButtonGroup } from './components/button-group/index.js';
import { AuCard } from './components/card/index.js';
import { AuCheckbox } from './components/checkbox/index.js';
import { AuContextMenu } from './components/context-menu/index.js';
import { AuDialog } from './components/dialog/index.js';
import { AuDropdown } from './components/dropdown/index.js';
import { AuFloatingToolbar } from './components/floating-toolbar/index.js';
import { AuIcon, getIconSource, registerIcons, unregisterIcon } from './components/icon/index.js';
import { AuSwitch } from './components/switch/index.js';
import { AuTooltip } from './components/tooltip/index.js';
import { AuVirtualList } from './components/virtual-list/index.js';
import { AuMessage } from './services/message/index.js';
import { AuMessageBox } from './services/message-box/index.js';
import {
  AURORA_MATERIALS,
  DEFAULT_AURORA_MATERIAL,
  getAuroraMaterial,
  isAuroraMaterial,
  setAuroraMaterial,
} from './utils/material.js';

const components = [
  AuButton,
  AuButtonGroup,
  AuCard,
  AuCheckbox,
  AuContextMenu,
  AuDialog,
  AuDropdown,
  AuFloatingToolbar,
  AuIcon,
  AuSwitch,
  AuTooltip,
  AuVirtualList,
];

export const version = '0.1.0';

export const AuroraUI = {
  version,
  install(app, options = {}) {
    if (options.icons) registerIcons(options.icons);
    if (options.material) setAuroraMaterial(options.material);
    components.forEach((component) => app.component(component.componentName, component));
    app.config.globalProperties.$message = AuMessage;
    app.config.globalProperties.$messageBox = AuMessageBox;
    app.config.globalProperties.$confirm = AuMessageBox.confirm;
  },
};

export {
  AuButton,
  AuButtonGroup,
  AuCard,
  AuCheckbox,
  AuContextMenu,
  AuDialog,
  AuDropdown,
  AuFloatingToolbar,
  AuIcon,
  AuMessage,
  AuMessageBox,
  AuSwitch,
  AuTooltip,
  AuVirtualList,
  getIconSource,
  registerIcons,
  unregisterIcon,
  AURORA_MATERIALS,
  DEFAULT_AURORA_MATERIAL,
  getAuroraMaterial,
  isAuroraMaterial,
  setAuroraMaterial,
};

export default AuroraUI;
