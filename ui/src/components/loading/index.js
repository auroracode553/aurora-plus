import { withInstall } from '../../utils/install.js';
import Loading from './AuLoading.vue';
import LoadingSpinner from './AuLoadingSpinner.vue';
import loadingService, { AuLoadingDirective } from '../../services/loading/loading.js';

export const AuLoading = withInstall(Loading, 'AuLoading');
export const AuLoadingSpinner = LoadingSpinner;
export const vLoading = AuLoadingDirective;

// 与 Element Plus 一致，通过组件命名空间提供命令式服务。
AuLoading.service = loadingService;

