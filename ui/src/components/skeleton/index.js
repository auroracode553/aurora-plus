import { withInstall } from '../../utils/install.js';
import Skeleton from './AuSkeleton.vue';
import SkeletonItem from './AuSkeletonItem.vue';

export const AuSkeleton = withInstall(Skeleton, 'AuSkeleton');
export const AuSkeletonItem = withInstall(SkeletonItem, 'AuSkeletonItem');
