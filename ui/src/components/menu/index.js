import { withInstall } from '../../utils/install.js';
import Menu from './AuMenu.vue';
import MenuItem from './AuMenuItem.vue';

export const AuMenu = withInstall(Menu, 'AuMenu');
export const AuMenuItem = withInstall(MenuItem, 'AuMenuItem');
