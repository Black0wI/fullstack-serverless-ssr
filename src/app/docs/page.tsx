import { readFileSync } from "fs";
import { join } from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import "./docs.css";

export const metadata: Metadata = {
  title: "Documentation | Tech Portal",
  description:
    "Complete documentation for the Tech Portal Next.js boilerplate — architecture, setup, commands, and deployment guide.",
};

export default function DocsPage() {
  const readmePath = join(process.cwd(), "README.md");
  const readme = readFileSync(readmePath, "utf-8");

  return (
    <div className="docs">
      <div className="container">
        <article className="docs__content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
