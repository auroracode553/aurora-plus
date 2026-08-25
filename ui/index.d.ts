import type { Component, DefineComponent, Plugin } from 'vue';

export type AuComponent = Component & Plugin & { componentName?: string };
export type AuButtonType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger';
export type AuComponentSize = 'small' | 'default' | 'large';
export type AuTooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface AuButtonProps {
  type?: AuButtonType;
  size?: AuComponentSize;
  nativeType?: 'button' | 'submit' | 'reset';
  icon?: string;
  plain?: boolean;
  round?: boolean;
  circle?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export type AuButtonGroupVariant = 'default' | 'floating';
export type AuButtonGroupOrientation = 'horizontal' | 'vertical';

export interface AuButtonGroupProps {
  variant?: AuButtonGroupVariant;
  orientation?: AuButtonGroupOrientation;
  iconOnly?: boolean;
  ariaLabel?: string;
}

export interface AuIconProps {
  name?: string;
  source?: string;
  color?: string;
  size?: string | number;
  ariaLabel?: string;
}

export interface AuTooltipProps {
  content?: string | number;
  placement?: AuTooltipPlacement;
  offset?: number;
  showAfter?: number;
  hideAfter?: number;
  disabled?: boolean;
  maxWidth?: string | number;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
}

export interface AuDialogProps {
  modelValue?: boolean;
  title?: string;
  width?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  top?: string | number;
  modal?: boolean;
  lockScroll?: boolean;
  appendToBody?: boolean;
  closeOnClickModal?: boolean;
  closeOnOverlay?: boolean;
  closeOnPressEscape?: boolean;
  showClose?: boolean;
  closeLabel?: string;
  zIndex?: number;
}

export interface AuVirtualListProps<T = unknown> {
  items?: T[];
  itemHeight?: number;
  overscan?: number;
  keyField?: string;
  itemKey?: (item: T, index: number) => string | number;
}

export interface AuContextMenuItem {
  id?: string | number;
  label?: string;
  title?: string;
  icon?: string;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  kind?: 'separator';
  type?: string;
  [key: string]: unknown;
}

export interface AuContextMenuSection {
  id?: string | number;
  type: 'icon-row' | 'icon-grid' | 'button-group' | 'group' | 'button' | 'item' | 'submenu' | 'separator';
  label?: string;
  ariaLabel?: string;
  disabled?: boolean;
  item?: AuContextMenuItem;
  items?: AuContextMenuItem[];
}

export interface AuContextMenuProps {
  modelValue?: boolean;
  items?: AuContextMenuSection[];
  position?: { x: number; y: number };
  iconColor?: string;
  ariaLabel?: string;
  beforeSelect?: (item: AuContextMenuItem) => boolean | Promise<boolean>;
  hideOnSelect?: boolean;
  closeOnClickOutside?: boolean;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  zIndex?: number;
}

export interface AuFloatingToolbarProps {
  modelValue?: boolean | null;
  triggerRect?: DOMRect | Record<string, number> | null;
  placement?: 'auto' | 'top' | 'bottom';
  keepVisibleTarget?: string | HTMLElement;
  keepVisibleSelector?: string;
  refreshTarget?: string | HTMLElement;
  refreshSelector?: string;
  ariaLabel?: string;
  gap?: number;
  viewportPadding?: number;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  zIndex?: number;
}

export interface AuMessageOptions {
  message: string | number;
  type?: 'success' | 'warning' | 'info' | 'error';
  duration?: number;
  showClose?: boolean;
  grouping?: boolean;
  offset?: number;
  onClose?: () => void;
}

export interface AuMessageHandler {
  close: () => void;
}

export interface AuMessageFunction {
  (options: string | number | AuMessageOptions): AuMessageHandler;
  success(options: string | number | Omit<AuMessageOptions, 'type'>): AuMessageHandler;
  warning(options: string | number | Omit<AuMessageOptions, 'type'>): AuMessageHandler;
  info(options: string | number | Omit<AuMessageOptions, 'type'>): AuMessageHandler;
  error(options: string | number | Omit<AuMessageOptions, 'type'>): AuMessageHandler;
  closeAll(): void;
}

export type AuMessageBoxAction = 'confirm' | 'cancel' | 'close';

export interface AuMessageBoxOptions {
  title?: string;
  message: string | number;
  width?: string | number;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonType?: AuButtonType;
  showCancelButton?: boolean;
  showClose?: boolean;
  closeLabel?: string;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  beforeClose?: (action: AuMessageBoxAction, options: AuMessageBoxOptions) => boolean | Promise<boolean>;
}

export interface AuMessageBoxFunction {
  (options: string | number | AuMessageBoxOptions): Promise<boolean>;
  confirm(options: string | number | AuMessageBoxOptions): Promise<boolean>;
  close(): void;
}

export const AuButton: DefineComponent<AuButtonProps> & AuComponent;
export const AuButtonGroup: DefineComponent<AuButtonGroupProps> & AuComponent;
export const AuContextMenu: DefineComponent<AuContextMenuProps> & AuComponent;
export const AuDialog: DefineComponent<AuDialogProps> & AuComponent;
export const AuFloatingToolbar: DefineComponent<AuFloatingToolbarProps> & AuComponent;
export const AuIcon: DefineComponent<AuIconProps> & AuComponent;
export const AuTooltip: DefineComponent<AuTooltipProps> & AuComponent;
export const AuVirtualList: DefineComponent<AuVirtualListProps> & AuComponent;
export const AuMessage: AuMessageFunction;
export const AuMessageBox: AuMessageBoxFunction;

export function registerIcons(icons: Record<string, string>, options?: { overwrite?: boolean }): void;
export function unregisterIcon(name: string): void;
export function getIconSource(name: string): string;

export interface AuroraUIOptions {
  icons?: Record<string, string>;
}

export const version: string;
export const AuroraUI: Plugin & { version: string };
export default AuroraUI;

declare module 'vue' {
  export interface GlobalComponents {
    AuButton: typeof AuButton;
    AuButtonGroup: typeof AuButtonGroup;
    AuContextMenu: typeof AuContextMenu;
    AuDialog: typeof AuDialog;
    AuFloatingToolbar: typeof AuFloatingToolbar;
    AuIcon: typeof AuIcon;
    AuTooltip: typeof AuTooltip;
    AuVirtualList: typeof AuVirtualList;
  }

  export interface ComponentCustomProperties {
    $message: AuMessageFunction;
    $messageBox: AuMessageBoxFunction;
    $confirm: AuMessageBoxFunction['confirm'];
  }
}
