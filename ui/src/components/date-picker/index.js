import { withInstall } from '../../utils/install.js';
import DatePicker from './AuDatePicker.vue';
import DatePickerPane from './AuDatePickerPane.vue';

export const AuDatePicker = withInstall(DatePicker, 'AuDatePicker');
export const AuDatePickerPane = withInstall(DatePickerPane, 'AuDatePickerPane');
