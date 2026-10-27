import { Marked } from 'marked';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function resolveReleaseNotesUrl(value, image = false) {
  try {
    const url = new URL(value);
    const protocols = image ? ['http:', 'https:'] : ['http:', 'https:', 'mailto:'];
    return protocols.includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

// 使用独立解析器，避免调用方的 marked 配置影响组件；原始 HTML 仅作文本展示。
const releaseNotesParser = new Marked({
  async: false,
  breaks: true,
  gfm: true,
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const url = resolveReleaseNotesUrl(href);
      if (!url) return text;
      const titleAttribute = title ? ` title="${escapeHtml(title)}"` : '';
      return `<a href="${escapeHtml(url)}"${titleAttribute} target="_blank" rel="noopener noreferrer">${text}</a>`;
    },
    image({ href, title, text }) {
      const url = resolveReleaseNotesUrl(href, true);
      if (!url) return escapeHtml(text);
      const titleAttribute = title ? ` title="${escapeHtml(title)}"` : '';
      return `<img src="${escapeHtml(url)}" alt="${escapeHtml(text)}"${titleAttribute}>`;
    },
  },
});

function normalizeMarkdownIndentation(text) {
  let fence = null;
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const contentLines = [];
  const listIndents = [];
  lines.forEach((line, index) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      return;
    }
    if (fence) return;
    contentLines.push(index);
    const list = line.match(/^( *)(?:[-*+]|\d+[.)])\s+/);
    if (list) listIndents.push(list[1].length);
  });

  // 移除更新说明列表的共同缩进，同时保留嵌套列表与围栏代码块。
  const indent = listIndents.length ? Math.min(...listIndents) : 0;
  if (indent) {
    contentLines.forEach((index) => {
      if (lines[index].startsWith(' '.repeat(indent))) lines[index] = lines[index].slice(indent);
    });
  }
  return lines.join('\n').trim();
}

/** 将更新说明原文渲染为 HTML，支持字符串及 { note, version } 条目数组。 */
export function renderReleaseNotesMarkdown(notes) {
  const text = Array.isArray(notes)
    ? notes.map((entry) => typeof entry === 'string' ? entry : entry?.note || '').filter(Boolean).join('\n\n')
    : typeof notes === 'string' ? notes : '';
  const markdown = normalizeMarkdownIndentation(text);
  return markdown ? releaseNotesParser.parse(markdown) : '';
}

/** 对话框同时兼容 Markdown 原文和已有的纯文本分组格式。 */
export function normalizeReleaseNotes(notes) {
  return (Array.isArray(notes) ? notes : [notes]).map((entry) => {
    if (entry && Array.isArray(entry.items)) {
      return { title: entry.title || '', items: entry.items.map(String).filter(Boolean) };
    }
    return {
      title: typeof entry === 'object' ? entry?.version || '' : '',
      html: renderReleaseNotesMarkdown(typeof entry === 'string' ? entry : entry?.note),
    };
  }).filter((group) => group.html || group.items?.length);
}
