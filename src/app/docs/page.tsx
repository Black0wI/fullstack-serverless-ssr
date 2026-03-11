import { readFileSync } from "fs";
import { join } from "path";
import { createElement, Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import "./docs.css";

export const metadata: Metadata = {
  title: "Documentation | Next.js SST Boilerplate",
  description:
    "Documentation for the Next.js SST boilerplate: architecture, setup, commands, and deployment workflow.",
};

interface MarkdownNode {
  type: string;
  value?: string;
  depth?: number;
  lang?: string | null;
  ordered?: boolean;
  url?: string;
  alt?: string;
  children?: MarkdownNode[];
  align?: Array<"left" | "right" | "center" | null>;
}

function renderChildren(
  children: MarkdownNode[] | undefined,
  keyPrefix: string,
): ReactNode[] {
  return (children ?? []).map((child, index) =>
    renderNode(child, `${keyPrefix}-${index}`),
  );
}

function renderLink(node: MarkdownNode, key: string): ReactNode {
  const href = node.url ?? "#";
  const isExternal = /^https?:\/\//.test(href);

  return (
    <a
      key={key}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {renderChildren(node.children, key)}
    </a>
  );
}

function renderTable(node: MarkdownNode, key: string): ReactNode {
  const rows = node.children ?? [];
  const [header, ...body] = rows;

  return (
    <table key={key}>
      {header && <thead>{renderNode(header, `${key}-head`) as ReactNode}</thead>}
      {body.length > 0 && (
        <tbody>{body.map((row, index) => renderNode(row, `${key}-body-${index}`))}</tbody>
      )}
    </table>
  );
}

function renderNode(node: MarkdownNode, key: string): ReactNode {
  switch (node.type) {
    case "root":
      return <Fragment key={key}>{renderChildren(node.children, key)}</Fragment>;
    case "heading":
      return createElement(
        `h${Math.min(Math.max(node.depth ?? 1, 1), 6)}`,
        { key },
        renderChildren(node.children, key),
      );
    case "paragraph":
      return <p key={key}>{renderChildren(node.children, key)}</p>;
    case "text":
      return node.value ?? "";
    case "strong":
      return <strong key={key}>{renderChildren(node.children, key)}</strong>;
    case "emphasis":
      return <em key={key}>{renderChildren(node.children, key)}</em>;
    case "delete":
      return <del key={key}>{renderChildren(node.children, key)}</del>;
    case "inlineCode":
      return <code key={key}>{node.value ?? ""}</code>;
    case "code":
      return (
        <pre key={key}>
          <code className={node.lang ? `language-${node.lang}` : undefined}>
            {node.value ?? ""}
          </code>
        </pre>
      );
    case "blockquote":
      return <blockquote key={key}>{renderChildren(node.children, key)}</blockquote>;
    case "list":
      return node.ordered ? (
        <ol key={key}>{renderChildren(node.children, key)}</ol>
      ) : (
        <ul key={key}>{renderChildren(node.children, key)}</ul>
      );
    case "listItem":
      return <li key={key}>{renderChildren(node.children, key)}</li>;
    case "link":
      return renderLink(node, key);
    case "image":
      // README badges and inline docs images are rendered as-is from markdown content.
      // eslint-disable-next-line @next/next/no-img-element
      return <img key={key} src={node.url} alt={node.alt ?? ""} />;
    case "thematicBreak":
      return <hr key={key} />;
    case "break":
      return <br key={key} />;
    case "table":
      return renderTable(node, key);
    case "tableRow":
      return <tr key={key}>{renderChildren(node.children, key)}</tr>;
    case "tableCell":
      return <td key={key}>{renderChildren(node.children, key)}</td>;
    case "tableHeader":
      return <th key={key}>{renderChildren(node.children, key)}</th>;
    case "html":
    case "definition":
      return null;
    default:
      return node.children ? (
        <Fragment key={key}>{renderChildren(node.children, key)}</Fragment>
      ) : null;
  }
}

function normalizeTables(node: MarkdownNode): MarkdownNode {
  if (node.type === "table" && node.children) {
    return {
      ...node,
      children: node.children.map((row, index) => ({
        ...normalizeTables(row),
        children: (row.children ?? []).map((cell) => ({
          ...normalizeTables(cell),
          type: index === 0 ? "tableHeader" : "tableCell",
        })),
      })),
    };
  }

  if (!node.children) {
    return node;
  }

  return {
    ...node,
    children: node.children.map((child) => normalizeTables(child)),
  };
}

function renderMarkdown(markdown: string): ReactNode {
  const tree = remark().use(remarkGfm).parse(markdown) as MarkdownNode;
  return renderNode(normalizeTables(tree), "doc");
}

export default function DocsPage() {
  const readmePath = join(process.cwd(), "README.md");
  const readme = readFileSync(readmePath, "utf-8");

  return (
    <div className="docs">
      <div className="container">
        <article className="docs__content">{renderMarkdown(readme)}</article>
      </div>
    </div>
  );
}
