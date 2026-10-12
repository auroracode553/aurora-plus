import { withInstall } from '../../utils/install.js';
import Loading from './AuLoading.vue';
import LoadingSpinner from './AuLoadingSpinner.vue';
import loadingService, { AuLoadingDirective } from '../../services/loading/loading.js';

export const AuLoading = withInstall(Loading, 'AuLoading');
export const AuLoadingSpinner = withInstall(LoadingSpinner, 'AuLoadingSpinner');
export const vLoading = AuLoadingDirective;

AuLoading.service = loadingService;
