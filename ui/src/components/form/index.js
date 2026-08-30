import { withInstall } from '../../utils/install.js';
import Form from './AuForm.vue';
import FormItem from './AuFormItem.vue';

export const AuForm = withInstall(Form, 'AuForm');
export const AuFormItem = withInstall(FormItem, 'AuFormItem');
