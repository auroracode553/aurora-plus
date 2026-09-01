import './theme/index.scss';

import { AuButton } from './components/button/index.js';
import { AuButtonGroup, AuButtonGroupItem } from './components/button-group/index.js';
import { AuCard } from './components/card/index.js';
import { AuCheckbox } from './components/checkbox/index.js';
import { AuColorPicker, AuColorSwatch } from './components/color-picker/index.js';
import { AuContextMenu } from './components/context-menu/index.js';
import { AuDatePicker, AuDatePickerPane, AuDateRangePicker } from './components/date-picker/index.js';
import { AuDateTimePicker } from './components/date-time-picker/index.js';
import { AuDialog } from './components/dialog/index.js';
import { AuDivider } from './components/divider/index.js';
import { AuDropdown } from './components/dropdown/index.js';
import { AuFloatingToolbar } from './components/floating-toolbar/index.js';
import { AuForm, AuFormItem } from './components/form/index.js';
import { AuIcon } from './components/icon/index.js';
import { AuImagePreview } from './components/image-preview/index.js';
import { AuInput } from './components/input/index.js';
import { AuLink } from './components/link/index.js';
import { AuMenu, AuMenuGroup, AuMenuItem } from './components/menu/index.js';
import { AuMenuBar } from './components/menu-bar/index.js';
import { AuMenuList, AuMenuListItem } from './components/menu-list/index.js';
import { AuPanel } from './components/panel/index.js';
import { AuPagination } from './components/pagination/index.js';
import { AuPopconfirm } from './components/popconfirm/index.js';
import { AuPopover } from './components/popover/index.js';
import { AuSelect } from './components/select/index.js';
import { AuSlider } from './components/slider/index.js';
import { AuSwitch } from './components/switch/index.js';
import { AuTabs } from './components/tabs/index.js';
import { AuTextarea } from './components/textarea/index.js';
import { AuTimePicker } from './components/time-picker/index.js';
import { AuTooltip } from './components/tooltip/index.js';
import { AuTree } from './components/tree/index.js';
import { AuTreeSelect } from './components/tree-select/index.js';
import { AuVirtualList } from './components/virtual-list/index.js';
import { AuVirtualTable } from './components/virtual-table/index.js';
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
import {
  AURORA_THEMES,
  DEFAULT_AURORA_THEME,
  getAuroraTheme,
  isAuroraTheme,
  setAuroraTheme,
} from './utils/theme.js';

const components = [
  AuButton,
  AuButtonGroup,
  AuButtonGroupItem,
  AuCard,
  AuCheckbox,
  AuColorPicker,
  AuColorSwatch,
  AuContextMenu,
  AuDatePicker,
  AuDatePickerPane,
  AuDateRangePicker,
  AuDateTimePicker,
  AuDialog,
  AuDivider,
  AuDropdown,
  AuFloatingToolbar,
  AuForm,
  AuFormItem,
  AuIcon,
  AuImagePreview,
  AuInput,
  AuLink,
  AuMenu,
  AuMenuGroup,
  AuMenuItem,
  AuMenuBar,
  AuMenuList,
  AuMenuListItem,
  AuPanel,
  AuPagination,
  AuPopconfirm,
  AuPopover,
  AuSelect,
  AuSlider,
  AuSwitch,
  AuTabs,
  AuTextarea,
  AuTimePicker,
  AuTooltip,
  AuTree,
  AuTreeSelect,
  AuVirtualList,
  AuVirtualTable,
  AuWindowTitleBar,
];

export const version = '0.1.0';

export const AuroraUI = {
  version,
  install(app, options = {}) {
    if (options.theme) setAuroraTheme(options.theme);
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
  AuButtonGroupItem,
  AuCard,
  AuCheckbox,
  AuColorPicker,
  AuColorSwatch,
  AuContextMenu,
  AuDatePicker,
  AuDatePickerPane,
  AuDateRangePicker,
  AuDateTimePicker,
  AuDialog,
  AuDivider,
  AuDropdown,
  AuFloatingToolbar,
  AuForm,
  AuFormItem,
  AuIcon,
  AuImagePreview,
  AuInput,
  AuLink,
  AuMenu,
  AuMenuGroup,
  AuMenuItem,
  AuMenuBar,
  AuMenuList,
  AuMenuListItem,
  AuPanel,
  AuPagination,
  AuPopover,
  AuPopconfirm,
  AuMessage,
  AuMessageBox,
  AuSelect,
  AuSlider,
  AuSwitch,
  AuTabs,
  AuTextarea,
  AuTimePicker,
  AuTooltip,
  AuTree,
  AuTreeSelect,
  AuVirtualList,
  AuVirtualTable,
  AuWindowTitleBar,
  AURORA_MATERIALS,
  AURORA_THEMES,
  DEFAULT_AURORA_MATERIAL,
  DEFAULT_AURORA_THEME,
  getAuroraMaterial,
  getAuroraTheme,
  isAuroraMaterial,
  isAuroraTheme,
  setAuroraMaterial,
  setAuroraTheme,
};

// Aurora UI 统一暴露 Tabler 图标，业务侧无需直接依赖图标包的导入路径。
export * from '@tabler/icons-vue';

export default AuroraUI;
