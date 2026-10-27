import { withInstall } from '../../utils/install.js';
import Transition from './AuTransition.vue';
import TransitionGroup from './AuTransitionGroup.vue';

export const AuTransition = withInstall(Transition, 'AuTransition');
export const AuTransitionGroup = withInstall(TransitionGroup, 'AuTransitionGroup');
