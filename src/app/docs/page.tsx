import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import "./docs.css";

export const metadata: Metadata = {
  title: "Documentation | Tech Portal",
  description:
    "Complete documentation for the Tech Portal Next.js boilerplate — architecture, setup, commands, and deployment guide.",
};

/**
 * Zero-dependency markdown-to-HTML converter.
 * Handles: headings, tables, code blocks, inline code, links,
 * images, bold, italic, blockquotes, lists, horizontal rules.
 */
function markdownToHtml(md: string): string {
  // Extract code blocks first to protect them from other replacements
  const codeBlocks: string[] = [];
  let result = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
    const escaped = code
      .trim()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(`<pre><code>${escaped}</code></pre>`);
    return placeholder;
  });

  // Escape HTML in the rest
  result = result.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Inline code
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Images
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // Links
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // Bold & italic
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");

  // Blockquotes
  result = result.replace(/^&gt; (.+)$/gm, "<blockquote><p>$1</p></blockquote>");

  // Tables
  result = result.replace(
    /^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/gm,
    (_match: string, header: string, _sep: string, body: string) => {
      const headerCells = header
        .split("|")
        .filter((c: string) => c.trim())
        .map((c: string) => `<th>${c.trim()}</th>`)
        .join("");
      const rows = body
        .trim()
        .split("\n")
        .map((row: string) => {
          const cells = row
            .split("|")
            .filter((c: string) => c.trim())
            .map((c: string) => `<td>${c.trim()}</td>`)
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");
      return `<table><thead><tr>${headerCells}</tr></thead><tbody>${rows}</tbody></table>`;
    },
  );

  // Headings
  result = result.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  result = result.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  result = result.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Horizontal rules
  result = result.replace(/^---$/gm, "<hr />");

  // Lists
  result = result.replace(/^- (.+)$/gm, "<li>$1</li>");
  result = result.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Restore code blocks
  codeBlocks.forEach((block, i) => {
    result = result.replace(`__CODE_BLOCK_${i}__`, block);
  });

  // Paragraphs — wrap remaining text blocks
  result = result
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<")) return trimmed;
      if (trimmed.startsWith("__CODE_BLOCK_")) return trimmed;
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  return result;
}

export default function DocsPage() {
  const readmePath = join(process.cwd(), "README.md");
  const readme = readFileSync(readmePath, "utf-8");
  const html = markdownToHtml(readme);

  return (
    <div className="docs">
      <div className="container">
        <article className="docs__content" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
