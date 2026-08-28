import { withInstall } from '../../utils/install.js';
import ColorPicker from './AuColorPicker.vue';
import ColorSwatch from './AuColorSwatch.vue';

export const AuColorPicker = withInstall(ColorPicker, 'AuColorPicker');
export const AuColorSwatch = withInstall(ColorSwatch, 'AuColorSwatch');
