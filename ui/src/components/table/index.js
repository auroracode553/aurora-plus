import { withInstall } from '../../utils/install.js';
import Table from './AuTable.vue';
import { AuTableColumn } from './AuTableColumn.js';

export const AuTable = withInstall(Table, 'AuTable');
export { AuTableColumn };
