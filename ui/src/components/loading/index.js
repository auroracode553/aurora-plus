import { withInstall } from '../../utils/install.js';
import Loading from './AuLoading.vue';
import LoadingSpinner from './AuLoadingSpinner.vue';
import { AuLoadingDirective, AuLoadingService } from '../../services/loading/loading.js';

export const AuLoading = withInstall(Loading, 'AuLoading');
export const AuLoadingSpinner = LoadingSpinner;
export const vLoading = AuLoadingDirective;
export { AuLoadingDirective, AuLoadingService };

// 与 Element Plus 的命令式调用保持相近的入口：AuLoading.service(options)。
AuLoading.service = AuLoadingService;

