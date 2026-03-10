"use client";

import { useActionState } from "react";
import { submitFeedback, type FeedbackState } from "./actions";

const initialState: FeedbackState = {
  success: false,
  message: "",
};

/**
 * Interactive feedback form using Server Actions + useActionState.
 *
 * Demonstrates:
 * - Server Actions (no API routes needed)
 * - Zod schema validation (server-side)
 * - useActionState for pending/error states
 * - Progressive enhancement (works without JS)
 */
export function FeedbackForm() {
  const [state, formAction, isPending] = useActionState(submitFeedback, initialState);

  return (
    <div className="example-card glass">
      <div className="example-card__header">
        <span className="example-card__icon">⚡</span>
        <h3 className="example-card__title">Server Actions + Zod</h3>
      </div>
      <p className="example-card__description">
        Form processed entirely on the server via Server Actions. Input validated with Zod
        schema. No API route needed.
      </p>

      <form action={formAction} className="example-form">
        <div className="example-form__field">
          <label htmlFor="feedback-name">Name</label>
          <input
            id="feedback-name"
            name="name"
            type="text"
            placeholder="Your name"
            required
            disabled={isPending}
          />
          {state.errors?.name && (
            <span className="example-form__error">{state.errors.name[0]}</span>
          )}
        </div>

        <div className="example-form__field">
          <label htmlFor="feedback-email">Email</label>
          <input
            id="feedback-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            disabled={isPending}
          />
          {state.errors?.email && (
            <span className="example-form__error">{state.errors.email[0]}</span>
          )}
        </div>

        <div className="example-form__field">
          <label htmlFor="feedback-rating">Rating</label>
          <select
            id="feedback-rating"
            name="rating"
            defaultValue="5"
            disabled={isPending}
          >
            <option value="1">⭐ 1 — Poor</option>
            <option value="2">⭐⭐ 2 — Fair</option>
            <option value="3">⭐⭐⭐ 3 — Good</option>
            <option value="4">⭐⭐⭐⭐ 4 — Great</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 — Excellent</option>
          </select>
        </div>

        <div className="example-form__field">
          <label htmlFor="feedback-message">Message</label>
          <textarea
            id="feedback-message"
            name="message"
            placeholder="Tell us what you think..."
            rows={3}
            required
            disabled={isPending}
          />
          {state.errors?.message && (
            <span className="example-form__error">{state.errors.message[0]}</span>
          )}
        </div>

        <button type="submit" className="btn btn--primary" disabled={isPending}>
          {isPending ? "Sending..." : "Send Feedback"}
        </button>

        {state.message && (
          <div
            className={`example-form__status ${state.success ? "example-form__status--success" : "example-form__status--error"}`}
          >
            {state.message}
          </div>
        )}
      </form>
    </div>
  );
}
