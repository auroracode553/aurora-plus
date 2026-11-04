import { nativeTheme } from 'electron';

/** 自定义标题区域配合 Windows 原生控件，保留 Win11 悬停贴靠布局。 */
export function createElectronWindowTitleBar({ nativeTitleBar = false } = {}) {
  const usesNativeControls = process.platform === 'win32' && !nativeTitleBar;
  const windowOptions = {
    frame: nativeTitleBar,
    ...(usesNativeControls ? {
      titleBarStyle: 'hidden',
      titleBarOverlay: getOverlayAppearance(),
    } : {}),
  };

  return {
    windowOptions,
    bind(win, { onCloseRequested = () => {} } = {}) {
      return usesNativeControls ? bindNativeControls(win, onCloseRequested) : () => {};
    },
  };
}

function getOverlayAppearance() {
  return {
    color: '#00000000',
    symbolColor: nativeTheme.shouldUseDarkColors ? '#ffffff' : '#000000',
    height: 32,
  };
}

function bindNativeControls(win, onCloseRequested) {
  let nativeCloseRequested = false;
  let closeButtonPressed = false;
  let resetCloseIntent = null;

  const requestClose = () => {
    nativeCloseRequested = true;
    clearImmediate(resetCloseIntent);
    resetCloseIntent = setImmediate(() => { nativeCloseRequested = false; });
  };
  const onWindowClose = () => {
    if (nativeCloseRequested) onCloseRequested();
  };
  const updateAppearance = () => win.setTitleBarOverlay(getOverlayAppearance());

  // HTCLOSE 的鼠标释放与 SC_CLOSE（系统菜单 / Alt+F4）属于用户关闭。
  // 普通 WM_CLOSE 不转换成用户意图，交由应用决定外部关闭的恢复规则。
  const messageHooks = [
    [0x00a1, (wParam) => { closeButtonPressed = wParam.readUInt32LE(0) === 20; }],
    [0x00a2, (wParam) => {
      if (wParam.readUInt32LE(0) === 20) requestClose();
      closeButtonPressed = false;
    }],
    // 原生控件捕获鼠标后，释放也可能通过客户区 WM_LBUTTONUP 到达。
    [0x0202, () => {
      if (closeButtonPressed) requestClose();
      closeButtonPressed = false;
    }],
    [0x0215, () => { closeButtonPressed = false; }],
    [0x0112, (wParam) => {
      if ((wParam.readUInt32LE(0) & 0xfff0) === 0xf060) requestClose();
    }],
  ];
  for (const [message, handler] of messageHooks) win.hookWindowMessage(message, handler);
  win.on('close', onWindowClose);
  nativeTheme.on('updated', updateAppearance);

  const dispose = () => {
    clearImmediate(resetCloseIntent);
    nativeTheme.removeListener('updated', updateAppearance);
    win.removeListener('close', onWindowClose);
    win.removeListener('closed', dispose);
    if (!win.isDestroyed()) {
      for (const [message] of messageHooks) win.unhookWindowMessage(message);
    }
  };
  win.once('closed', dispose);
  return dispose;
}
