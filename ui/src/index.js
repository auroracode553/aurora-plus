import './theme/index.css';

import { AuButton } from './components/button/index.js';
import { AuButtonGroup } from './components/button-group/index.js';
import { AuCard } from './components/card/index.js';
import { AuCheckbox } from './components/checkbox/index.js';
import { AuColorPicker } from './components/color-picker/index.js';
import { AuContextMenu } from './components/context-menu/index.js';
import { AuDialog } from './components/dialog/index.js';
import { AuDropdown } from './components/dropdown/index.js';
import { AuFloatingToolbar } from './components/floating-toolbar/index.js';
import { AuIcon } from './components/icon/index.js';
import { AuInput } from './components/input/index.js';
import { AuMenu, AuMenuItem } from './components/menu/index.js';
import { AuMenuBar } from './components/menu-bar/index.js';
import { AuMenuList, AuMenuListItem } from './components/menu-list/index.js';
import { AuSelect } from './components/select/index.js';
import { AuSwitch } from './components/switch/index.js';
import { AuTabs } from './components/tabs/index.js';
import { AuTextarea } from './components/textarea/index.js';
import { AuTooltip } from './components/tooltip/index.js';
import { AuTree } from './components/tree/index.js';
import { AuVirtualList } from './components/virtual-list/index.js';
import { AuWindowTitleBar } from './components/window-title-bar/index.js';
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
  AuColorPicker,
  AuContextMenu,
  AuDialog,
  AuDropdown,
  AuFloatingToolbar,
  AuIcon,
  AuInput,
  AuMenu,
  AuMenuItem,
  AuMenuBar,
  AuMenuList,
  AuMenuListItem,
  AuSelect,
  AuSwitch,
  AuTabs,
  AuTextarea,
  AuTooltip,
  AuTree,
  AuVirtualList,
  AuWindowTitleBar,
];

export const version = '0.1.0';

export const AuroraUI = {
  version,
  install(app, options = {}) {
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
  AuColorPicker,
  AuContextMenu,
  AuDialog,
  AuDropdown,
  AuFloatingToolbar,
  AuIcon,
  AuInput,
  AuMenu,
  AuMenuItem,
  AuMenuBar,
  AuMenuList,
  AuMenuListItem,
  AuMessage,
  AuMessageBox,
  AuSelect,
  AuSwitch,
  AuTabs,
  AuTextarea,
  AuTooltip,
  AuTree,
  AuVirtualList,
  AuWindowTitleBar,
  AURORA_MATERIALS,
  DEFAULT_AURORA_MATERIAL,
  getAuroraMaterial,
  isAuroraMaterial,
  setAuroraMaterial,
};

// Aurora UI 统一暴露 Tabler 图标，业务侧无需直接依赖图标包的导入路径。
export * from '@tabler/icons-vue';

export default AuroraUI;
