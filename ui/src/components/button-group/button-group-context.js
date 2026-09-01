import { inject } from 'vue';

export const BUTTON_GROUP_CONTEXT = Symbol('au-button-group-context');

export function useButtonGroupContext() {
  return inject(BUTTON_GROUP_CONTEXT, null);
}
