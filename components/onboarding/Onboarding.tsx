"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clearLocal, readLocal, writeLocal } from "@/lib/onboarding/local";
import { buildSteps, QUESTIONS } from "@/lib/onboarding/questions";
import { summarise } from "@/lib/onboarding/summary";
import type { AnswerValue, Answers, Step } from "@/lib/onboarding/types";
import { asText } from "@/lib/onboarding/validation";
import { ProgressRail } from "./ProgressRail";
import { QuestionScreen } from "./QuestionScreen";
import { ScreenShell } from "./ScreenShell";
import { DoneScreen, IntroScreen, ReviewScreen, WelcomeScreen } from "./StaticScreens";

type SaveState = "idle" | "saving" | "saved" | "offline";

const AUTOSAVE_DELAY_MS = 900;

export function Onboarding({
  initialAnswers,
  initialId,
  initialToken,
  clientSlug,
  alreadySubmitted,
  resumed,
}: {
  initialAnswers: Answers;
  initialId: string | null;
  initialToken: string | null;
  clientSlug: string | null;
  alreadySubmitted: boolean;
  resumed: boolean;
}) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [stepId, setStepId] = useState<string>(alreadySubmitted ? "done" : "welcome");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const idRef = useRef<string | null>(initialId);
  const tokenRef = useRef<string | null>(initialToken);
  const [token, setToken] = useState<string | null>(initialToken);
  const dirtyRef = useRef(false);
  /** The answers the server has already accepted, so navigation doesn't re-post them. */
  const lastSavedRef = useRef<string>("");
  /** Told back to the server so it can skip a lookup once the resume email has gone. */
  const resumeEmailSentRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const steps = useMemo(() => buildSteps(answers), [answers]);
  const stepIndex = Math.max(0, steps.findIndex((s) => s.id === stepId));
  const step: Step = steps[stepIndex] ?? steps[0];

  const questionSteps = useMemo(() => steps.filter((s) => s.kind === "question"), [steps]);
  const questionNumber = questionSteps.findIndex((s) => s.id === step.id) + 1;

  // -------------------------------------------------------------- restoring

  // A local draft is only offered when the page didn't already arrive with
  // server answers — a resume link is the better copy and must win.
  useEffect(() => {
    if (alreadySubmitted || resumed || initialId) return;
    const local = readLocal();
    if (!local) return;
    const hasSomething = Object.values(local.answers).some((v) =>
      typeof v === "string" ? v.trim() : Array.isArray(v) ? v.length > 0 : Boolean(v),
    );
    if (!hasSomething) return;

    idRef.current = local.id;
    tokenRef.current = local.token;
    setToken(local.token);
    setAnswers((current) => ({ ...local.answers, ...current }));
    if (local.stepId) setStepId(local.stepId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------- saving

  const persist = useCallback(
    async (next: Answers, currentStepId: string) => {
      // The on-device copy is written on every call, including plain
      // navigation, so returning to the tab lands on the right screen.
      writeLocal({ id: idRef.current, token: tokenRef.current, answers: next, stepId: currentStepId });

      const payload = JSON.stringify(next);
      if (payload === lastSavedRef.current) return;
      lastSavedRef.current = payload;

      setSaveState("saving");
      try {
        const response = await fetch("/api/onboarding/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: idRef.current ?? undefined,
            answers: next,
            clientSlug: clientSlug ?? undefined,
            resumeEmailSent: resumeEmailSentRef.current,
          }),
        });
        if (!response.ok) throw new Error(String(response.status));
        const body = (await response.json()) as { id?: string; token?: string; resumeEmailSent?: boolean };
        if (body.id) idRef.current = body.id;
        if (body.resumeEmailSent) resumeEmailSentRef.current = true;
        if (body.token) {
          tokenRef.current = body.token;
          setToken(body.token);
        }
        writeLocal({ id: idRef.current, token: tokenRef.current, answers: next, stepId: currentStepId });
        setSaveState("saved");
      } catch {
        // The browser copy already went in above, so nothing is lost. Say
        // "saved on this device" rather than raising an error the client can
        // do nothing about — and clear the marker so the next change retries.
        lastSavedRef.current = "";
        setSaveState("offline");
      }
    },
    [clientSlug],
  );

  // Debounced autosave. Answers change on every keystroke; the server does not
  // need to hear about every keystroke.
  useEffect(() => {
    if (!dirtyRef.current) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      void persist(answers, stepId);
    }, AUTOSAVE_DELAY_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [answers, stepId, persist]);

  /**
   * Save now rather than in 900ms. Takes the step the client is moving *to*:
   * `stepId` is still the old value at this point in the render, and storing
   * that would resume them one screen behind the answer they just gave.
   */
  const flush = useCallback(
    (targetStepId: string) => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      void persist(answers, targetStepId);
    },
    [answers, persist],
  );

  // ------------------------------------------------------------ navigation

  const setAnswer = useCallback((id: string, value: AnswerValue) => {
    dirtyRef.current = true;
    setError(null);
    setAnswers((current) => ({ ...current, [id]: value }));
  }, []);

  const goTo = useCallback(
    (nextStepId: string, dir: 1 | -1) => {
      setDirection(dir);
      setStepId(nextStepId);
      setError(null);
      flush(nextStepId);
    },
    [flush],
  );

  const next = useCallback(() => {
    if (step.kind === "question") {
      const problem = step.question.validate?.(answers) ?? null;
      if (problem) {
        setError(problem);
        return;
      }
    }
    const target = steps[stepIndex + 1];
    if (target) goTo(target.id, 1);
  }, [answers, goTo, step, stepIndex, steps]);

  const back = useCallback(() => {
    const target = steps[stepIndex - 1];
    if (target) goTo(target.id, -1);
  }, [goTo, stepIndex, steps]);

  // Move focus to the new screen's heading so a screen reader announces the
  // question rather than leaving the user on a button that no longer exists.
  useEffect(() => {
    headingRef.current?.focus();
  }, [stepId]);

  // ------------------------------------------------------------- submitting

  const missing = useMemo(
    () =>
      QUESTIONS.filter((question) => {
        if (!question.required) return false;
        if (question.when && !question.when(answers)) return false;
        return Boolean(question.validate?.(answers) ?? (asText(answers[question.id]) ? null : "blank"));
      }).map((question) => ({ id: question.id, label: question.emailLabel ?? question.label })),
    [answers],
  );

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    if (timerRef.current) window.clearTimeout(timerRef.current);

    try {
      const response = await fetch("/api/onboarding/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idRef.current ?? undefined, answers, clientSlug: clientSlug ?? undefined }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
        questionId?: string;
        id?: string;
        token?: string;
      };

      if (!response.ok) {
        setSubmitError(body.error ?? "We couldn't file that. Give it another go.");
        setSubmitting(false);
        return;
      }
      if (body.id) idRef.current = body.id;
      if (body.token) {
        tokenRef.current = body.token;
        setToken(body.token);
      }

      clearLocal();
      dirtyRef.current = false;
      setDirection(1);
      setStepId("done");
    } catch {
      setSubmitError(
        "That didn't go through — check your connection and try again. Nothing is lost; your answers are saved.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ---------------------------------------------------------------- render

  const showChrome = step.kind !== "welcome" && step.kind !== "done";
  const ratio = steps.length > 1 ? stepIndex / (steps.length - 1) : 0;
  const firstName = asText(answers.fullName).split(/\s+/)[0] ?? "";

  return (
    <div className="ob-shell relative flex min-h-[100dvh] flex-col">
      <div
        className="glow"
        aria-hidden
        style={{ top: "-14rem", left: "50%", width: "36rem", height: "26rem", transform: "translateX(-50%)", background: "var(--color-pine)", opacity: 0.3 }}
      />

      <header className="relative z-10 mx-auto w-full max-w-3xl px-5 pt-6 sm:px-8">
        {showChrome ? (
          <ProgressRail currentSection={"section" in step ? step.section : null} ratio={ratio} saveState={saveState} />
        ) : (
          <div className="h-[1.9rem]" />
        )}
      </header>

      {/* The bottom padding clears the sticky footer. Without it a long screen
          scrolls its last control underneath the bar and it can't be reached. */}
      <main
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 pt-10 sm:px-8 sm:pt-14"
        style={{ paddingBottom: showChrome ? "6.5rem" : "2.5rem" }}
      >
        <div ref={headingRef} tabIndex={-1} className="ob-screen">
          <ScreenShell screenKey={step.id} direction={direction}>
            {step.kind === "welcome" && (
              <WelcomeScreen
                resumed={resumed}
                onStart={() => {
                  const target = steps[1];
                  if (target) goTo(target.id, 1);
                }}
              />
            )}

            {step.kind === "intro" && (
              <IntroScreen title={step.title} body={step.body} onContinue={next} />
            )}

            {step.kind === "question" && (
              <QuestionScreen
                question={step.question}
                answers={answers}
                onAnswer={setAnswer}
                onAdvance={next}
                error={error}
                index={questionNumber}
                total={questionSteps.length}
              />
            )}

            {step.kind === "review" && (
              <ReviewScreen
                sections={summarise(answers)}
                missing={missing}
                submitting={submitting}
                error={submitError}
                onSubmit={() => void submit()}
                onJumpTo={(questionId) => goTo(questionId, -1)}
              />
            )}

            {step.kind === "done" && <DoneScreen token={token} firstName={firstName} />}
          </ScreenShell>
        </div>
      </main>

      {showChrome && (
        <footer className="sticky bottom-0 z-20 border-t border-[color:var(--ob-line)] bg-[color:var(--color-charcoal)]/85 backdrop-blur">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
            <button
              type="button"
              className="ob-icon-btn"
              onClick={back}
              disabled={stepIndex === 0}
              aria-label="Previous question"
            >
              <span aria-hidden>←</span>
            </button>

            {/* Enter belongs to the paragraph on a long-text screen, so the
                hint has to say the other thing there. */}
            <p className="hidden text-xs text-[color:var(--ob-muted)] sm:block">
              Press{" "}
              <kbd className="rounded border border-[color:var(--ob-line)] px-1.5 py-0.5">
                {step.kind === "question" && step.question.input.type === "longtext" ? "⌘ + Enter" : "Enter"}
              </kbd>{" "}
              to continue
            </p>

            {/* The intro and review screens carry their own primary button in
                the content, so the footer would be a second one saying the
                same thing. */}
            {step.kind === "question" ? (
              <button type="button" className="btn btn-primary text-sm" onClick={next}>
                {step.question.required ? "Continue" : "Next"}
                <span aria-hidden>→</span>
              </button>
            ) : (
              <span className="w-11" aria-hidden />
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
