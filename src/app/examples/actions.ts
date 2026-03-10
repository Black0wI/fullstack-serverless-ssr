"use server";

import { z } from "zod";

/**
 * Feedback form schema — validated server-side with Zod.
 */
const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be under 500 characters"),
  rating: z.coerce.number().min(1).max(5),
});

export type FeedbackState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

/**
 * Server Action — processes feedback form submission.
 *
 * This runs entirely on the server (Lambda). No API route needed.
 * Validates input with Zod schema, then processes the data.
 *
 * Usage in a client component:
 *   const [state, formAction] = useActionState(submitFeedback, initialState);
 */
export async function submitFeedback(
  _prevState: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    rating: formData.get("rating"),
  };

  const result = feedbackSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: "Validation failed. Please check your input.",
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // ── Process the validated data ──
  // In a real app: save to database, send email, etc.
  // Example: await db.feedback.create({ data: result.data });

  console.log("[Server Action] Feedback received:", result.data);

  return {
    success: true,
    message: `Thanks ${result.data.name}! Your feedback has been received.`,
  };
}
