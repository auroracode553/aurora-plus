import { withInstall } from '../../utils/install.js';
import MenuList from './AuMenuList.vue';
import MenuListItem from './AuMenuListItem.vue';

export const AuMenuList = withInstall(MenuList, 'AuMenuList');
export const AuMenuListItem = withInstall(MenuListItem, 'AuMenuListItem');
