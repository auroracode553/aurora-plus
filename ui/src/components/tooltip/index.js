import { withInstall } from '../../utils/install.js';
import Tooltip from './AuTooltip.vue';
import HelpTooltip from './AuHelpTooltip.vue';

export const AuTooltip = withInstall(Tooltip, 'AuTooltip');
export const AuHelpTooltip = withInstall(HelpTooltip, 'AuHelpTooltip');
