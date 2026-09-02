"use client";

import type { AnswerValue, Answers, Question } from "@/lib/onboarding/types";
import { asFiles, asList, asRows, asText } from "@/lib/onboarding/validation";
import { AccessCard } from "./fields/AccessCard";
import { ChoiceList } from "./fields/ChoiceList";
import { FieldGroup } from "./fields/FieldGroup";
import { FileDrop } from "./fields/FileDrop";
import { LinkList } from "./fields/LinkList";
import { LongText } from "./fields/LongText";
import { Repeater } from "./fields/Repeater";
import { TextInput } from "./fields/TextInput";

/**
 * One question, one screen.
 *
 * The control is chosen from the question definition rather than written per
 * question, so adding a question is a data change. The heading is the label —
 * inputs are associated with it by `aria-labelledby`, which keeps the visible
 * question and the accessible name the same string.
 */
export function QuestionScreen({
  question,
  answers,
  onAnswer,
  onAdvance,
  error,
  index,
  total,
}: {
  question: Question;
  answers: Answers;
  onAnswer: (id: string, value: AnswerValue) => void;
  onAdvance: () => void;
  error: string | null;
  index: number;
  total: number;
}) {
  const labelId = `q-${question.id}-label`;
  const helperId = question.helper ? `q-${question.id}-helper` : undefined;
  const errorId = error ? `q-${question.id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;
  const value = answers[question.id];
  const groupValue =
    typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};

  return (
    <div className="flex flex-col gap-7">
      {/* Not a <header>: this is the question itself, not a banner for the page. */}
      <div className="flex flex-col gap-3">
        {/* Only the four required questions are marked. Labelling the other
            twenty-odd "Optional" is twenty-odd reminders that they could skip. */}
        <p className="ob-index">
          {index} of {total}
          {question.required && (
            <span className="ml-2 normal-case tracking-normal text-[color:var(--ob-muted)]">Required</span>
          )}
        </p>
        <h2 id={labelId} className="ob-question">
          {question.label}
        </h2>
        {question.helper && (
          <p id={helperId} className="ob-helper">
            {question.helper}
          </p>
        )}
      </div>

      <div>
        {question.input.type === "text" && (
          <TextInput
            value={asText(value)}
            onChange={(next) => onAnswer(question.id, next)}
            onAdvance={onAdvance}
            inputType={question.input.inputType}
            placeholder={question.input.placeholder}
            autoComplete={question.input.autoComplete}
            maxLength={question.input.maxLength}
            autoFocus
            invalid={Boolean(error)}
            labelledBy={labelId}
            describedBy={describedBy}
          />
        )}

        {question.input.type === "longtext" && (
          <LongText
            value={asText(value)}
            onChange={(next) => onAnswer(question.id, next)}
            onAdvance={onAdvance}
            placeholder={question.input.placeholder}
            rows={question.input.rows}
            maxLength={question.input.maxLength}
            autoFocus
            labelledBy={labelId}
            describedBy={describedBy}
          />
        )}

        {question.input.type === "single" && (
          <ChoiceList
            name={question.id}
            options={question.input.options}
            value={asText(value) ? [asText(value)] : []}
            onChange={(next) => onAnswer(question.id, next[0] ?? "")}
            onAdvance={onAdvance}
            labelledBy={labelId}
            describedBy={describedBy}
          />
        )}

        {question.input.type === "multi" && (
          <ChoiceList
            multi
            name={question.id}
            options={question.input.options}
            max={question.input.max}
            value={asList(value)}
            onChange={(next) => onAnswer(question.id, next)}
            labelledBy={labelId}
            describedBy={describedBy}
          />
        )}

        {question.input.type === "group" && (
          <FieldGroup
            fields={question.input.fields}
            value={groupValue}
            onChange={(next) => onAnswer(question.id, next)}
            onAdvance={onAdvance}
            labelledBy={labelId}
          />
        )}

        {question.input.type === "repeater" && (
          <Repeater
            fields={question.input.fields}
            rows={asRows(value)}
            onChange={(next) => onAnswer(question.id, next)}
            addLabel={question.input.addLabel}
            seed={question.input.seed}
            max={question.input.max}
            autoFocus
            labelledBy={labelId}
            describedBy={describedBy}
          />
        )}

        {question.input.type === "links" && (
          <LinkList
            idPrefix={question.id}
            links={asList(value)}
            onChange={(next) => onAnswer(question.id, next)}
            addLabel={question.input.addLabel}
            max={question.input.max}
            placeholder={question.input.placeholder}
            autoFocus
            labelledBy={labelId}
            describedBy={describedBy}
          />
        )}

        {question.input.type === "access" && (
          <AccessCard
            platform={question.input.platform}
            answers={answers}
            value={asText(value)}
            onChange={(next) => onAnswer(question.id, next)}
            onAdvance={onAdvance}
            labelledBy={labelId}
          />
        )}
      </div>

      {question.links && (
        <div>
          <p className="ob-label">{question.links.label}</p>
          <LinkList
            idPrefix={question.links.key}
            links={asList(answers[question.links.key])}
            onChange={(next) => onAnswer(question.links!.key, next)}
            addLabel="Add another link"
            max={question.links.max}
            placeholder={question.links.placeholder}
          />
        </div>
      )}

      {question.attachments && (
        <FileDrop
          label={question.attachments.label}
          accept={question.attachments.accept}
          files={asFiles(answers[question.attachments.key])}
          onChange={(next) => onAnswer(question.attachments!.key, next)}
        />
      )}

      {error && (
        <p id={errorId} className="ob-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
