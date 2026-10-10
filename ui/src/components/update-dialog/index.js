import { withInstall } from '../../utils/install.js';
import UpdateDialog from './AuUpdateDialog.vue';

export const AuUpdateDialog = withInstall(UpdateDialog, 'AuUpdateDialog');
export { useUpdateCheck } from './use-update-check.js';
