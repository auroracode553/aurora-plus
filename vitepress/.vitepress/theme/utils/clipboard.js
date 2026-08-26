/**
 * 将文本写入剪贴板，并在旧浏览器中使用临时 textarea 回退。
 */
export async function writeTextToClipboard(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === 'undefined') throw new Error('Clipboard API is unavailable.');

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  let copiedSuccessfully = false;
  try {
    copiedSuccessfully = document.execCommand('copy');
  } finally {
    textarea.remove();
  }

  if (!copiedSuccessfully) throw new Error('Copy command failed.');
}
