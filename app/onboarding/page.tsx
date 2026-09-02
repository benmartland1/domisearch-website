import { Onboarding } from "@/components/onboarding/Onboarding";
import { prefillFor } from "@/lib/onboarding/clients";
import { loadSubmission } from "@/lib/onboarding/store";
import { resumeToken, verifyResumeToken } from "@/lib/onboarding/token";
import type { Answers } from "@/lib/onboarding/types";

export const dynamic = "force-dynamic";

/**
 * onboarding.domisearch.com.
 *
 * Two ways in:
 *   ?client=acme-ltd  — a fresh start with the company name already filled in
 *   ?resume=<token>   — signed link from the save email, restoring everything
 *
 * Both are resolved here rather than in the browser so the first paint is
 * already personalised and there is no flash of an empty form.
 */
export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const one = (key: string): string | null => {
    const value = params[key];
    return typeof value === "string" && value.trim() ? value.trim() : null;
  };

  const resume = one("resume");
  const clientSlug = one("client");

  let initialAnswers: Answers = prefillFor(clientSlug, { name: one("name"), email: one("email") });
  let initialId: string | null = null;
  let initialToken: string | null = null;
  let alreadySubmitted = false;
  let resumed = false;

  if (resume) {
    const id = verifyResumeToken(resume);
    if (id) {
      try {
        const submission = await loadSubmission(id);
        if (submission) {
          initialAnswers = submission.answers;
          initialId = submission.id;
          initialToken = resumeToken(submission.id);
          alreadySubmitted = submission.status === "submitted";
          resumed = true;
        }
      } catch (err) {
        // A Sanity outage shouldn't be a locked door. Fall through to a fresh
        // form; the browser's local copy still restores on the client.
        console.error("[onboarding] resume failed", err);
      }
    }
  }

  return (
    <Onboarding
      initialAnswers={initialAnswers}
      initialId={initialId}
      initialToken={initialToken}
      clientSlug={clientSlug}
      alreadySubmitted={alreadySubmitted}
      resumed={resumed}
    />
  );
}
