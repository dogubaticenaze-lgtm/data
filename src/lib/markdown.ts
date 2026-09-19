/**
 * Minimal, dependency-free markdown subset for admin-authored posts.
 * Supports: # / ## / ### headings, paragraphs, - lists, 1. lists, **bold**, *italic*,
 * [text](https://link), > quotes, --- rules. Everything is HTML-escaped first, so
 * raw HTML in the source is shown literally rather than executed.
 */
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inline(s: string) {
  let out = esc(s);
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*|mailto:[^\s)]+|tel:[^\s)]+)\)/g, (_m, text, href) => {
    const external = /^https?:/.test(href);
    return `<a href="${href}"${external ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
  });
  return out;
}

export function renderMarkdown(src: string): string {
  const lines = src.replace(/\r\n?/g, "\n").split("\n");
  const html: string[] = [];
  let para: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) {
      html.push(`<p>${inline(para.join(" "))}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      html.push(`<${list.type}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.type}>`);
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      flushPara();
      flushList();
      const level = h[1].length + 1; // # → h2 (page title is h1)
      html.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      flushPara();
      flushList();
      html.push("<hr>");
      continue;
    }
    const q = /^>\s?(.*)$/.exec(line);
    if (q) {
      flushPara();
      flushList();
      html.push(`<blockquote><p>${inline(q[1])}</p></blockquote>`);
      continue;
    }
    const ul = /^[-*]\s+(.*)$/.exec(line);
    const ol = /^\d+[.)]\s+(.*)$/.exec(line);
    if (ul || ol) {
      flushPara();
      const type = ul ? "ul" : "ol";
      if (!list || list.type !== type) {
        flushList();
        list = { type, items: [] };
      }
      list.items.push((ul ?? ol)![1]);
      continue;
    }
    flushList();
    para.push(line.trim());
  }
  flushPara();
  flushList();
  return html.join("\n");
}

export function slugify(input: string) {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", İ: "i" };
  return input
    .replace(/['’ʼ`]/g, "")
    .toLowerCase()
    .replace(/[çğıöşüİ]/g, (c) => map[c] ?? c)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9Ѐ-ӿ؀-ۿ]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
