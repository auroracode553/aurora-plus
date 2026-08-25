import { withInstall } from '../../utils/install.js';
import Icon from './AuIcon.vue';

export const AuIcon = withInstall(Icon, 'AuIcon');
export { getIconSource, registerIcons, unregisterIcon } from './icon-registry.js';
