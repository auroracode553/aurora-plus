import { withInstall } from '../../utils/install.js';
import Collapse from './AuCollapse.vue';
import CollapseItem from './AuCollapseItem.vue';

export const AuCollapse = withInstall(Collapse, 'AuCollapse');
export const AuCollapseItem = withInstall(CollapseItem, 'AuCollapseItem');
