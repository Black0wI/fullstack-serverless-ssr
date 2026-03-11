import type { Metadata } from "next";
import { FeedbackForm } from "./FeedbackForm";
import { CacheDemo } from "./CacheDemo";
import "./examples.css";

export const metadata: Metadata = {
  title: "Examples | Next.js SST Boilerplate",
  description:
    "Illustrative examples showcasing Next.js 16 patterns included with the boilerplate.",
};

/**
 * Examples page — showcases Next.js 16 features with interactive demos.
 *
 * - Server Actions: form processing without API routes
 * - use cache: granular server-side caching
 * - Both patterns work seamlessly on AWS Lambda via SST
 */
export default function ExamplesPage() {
  return (
    <div className="examples">
      <div className="container">
        <header className="examples__header animate-fade-in-up">
          <span className="badge">
            <span className="badge__dot" />
            Interactive
          </span>
          <h1 className="examples__title">
            Next.js 16 <span className="hero__title-gradient">Features</span>
          </h1>
          <p className="examples__subtitle">
            Illustrative demos of Server Actions and caching patterns. Use them as a
            starting point, not as drop-in production features.
          </p>
        </header>

        <div className="examples__grid">
          <div className="animate-fade-in-up animate-delay-1">
            <FeedbackForm />
          </div>
          <div className="animate-fade-in-up animate-delay-2">
            <CacheDemo />
          </div>
        </div>

        <section className="examples__code-section animate-fade-in-up animate-delay-3">
          <h2 className="examples__section-title">How it works</h2>
          <div className="examples__code-grid">
            <div className="hero__code-window">
              <div className="hero__code-header">
                <span className="hero__code-dot hero__code-dot--red" />
                <span className="hero__code-dot hero__code-dot--yellow" />
                <span className="hero__code-dot hero__code-dot--green" />
              </div>
              <div className="hero__code-body">
                <div>
                  <span className="string">&quot;use server&quot;</span>;
                </div>
                <br />
                <div>
                  <span className="keyword">export async function</span>{" "}
                  <span className="function">submitFeedback</span>(
                </div>
                <div>
                  {"  "}formData: <span className="function">FormData</span>
                </div>
                <div>
                  {")"} {"{"}
                </div>
                <div>
                  {"  "}
                  <span className="keyword">const</span> result ={" "}
                  <span className="function">schema</span>.
                  <span className="function">safeParse</span>(formData);
                </div>
                <div>
                  {"  "}
                  <span className="comment">
                    {"// Runs on Lambda — no API route needed"}
                  </span>
                </div>
                <div>{"}"}</div>
              </div>
            </div>

            <div className="hero__code-window">
              <div className="hero__code-header">
                <span className="hero__code-dot hero__code-dot--red" />
                <span className="hero__code-dot hero__code-dot--yellow" />
                <span className="hero__code-dot hero__code-dot--green" />
              </div>
              <div className="hero__code-body">
                <div>
                  <span className="keyword">async function</span>{" "}
                  <span className="function">getData</span>() {"{"}
                </div>
                <div>
                  {"  "}
                  <span className="string">&quot;use cache&quot;</span>;
                </div>
                <br />
                <div>
                  {"  "}
                  <span className="keyword">const</span> data ={" "}
                  <span className="keyword">await</span>{" "}
                  <span className="function">fetch</span>(
                  <span className="string">&quot;/api&quot;</span>);
                </div>
                <div>
                  {"  "}
                  <span className="comment">
                    {"// Cached on server, served instantly"}
                  </span>
                </div>
                <div>
                  {"  "}
                  <span className="keyword">return</span> data;
                </div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
