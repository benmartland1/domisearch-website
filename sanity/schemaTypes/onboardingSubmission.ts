import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * A client onboarding questionnaire, from onboarding.domisearch.com.
 *
 * Written by the API routes, not by hand. Everything here is read-only in the
 * Studio: the client owns these answers, and an accidental edit in the Studio
 * would silently rewrite what they actually told us. Corrections belong in the
 * notes field at the bottom.
 */
export const onboardingSubmission = defineType({
  name: "onboardingSubmission",
  title: "Onboarding submission",
  type: "document",
  groups: [
    { name: "answers", title: "Answers", default: true },
    { name: "meta", title: "Details" },
  ],
  fields: [
    defineField({
      name: "submissionId",
      title: "Submission ID",
      type: "string",
      group: "meta",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "meta",
      readOnly: true,
      options: {
        list: [
          { title: "In progress", value: "draft" },
          { title: "Submitted", value: "submitted" },
        ],
      },
    }),
    defineField({ name: "companyName", title: "Company", type: "string", group: "meta", readOnly: true }),
    defineField({ name: "contactName", title: "Contact", type: "string", group: "meta", readOnly: true }),
    defineField({ name: "contactEmail", title: "Contact email", type: "string", group: "meta", readOnly: true }),
    defineField({ name: "websiteUrl", title: "Website", type: "url", group: "meta", readOnly: true }),
    defineField({
      name: "clientSlug",
      title: "Client slug",
      type: "string",
      group: "meta",
      readOnly: true,
      description: "The ?client= value the welcome email used to prefill this form.",
    }),

    defineField({
      name: "sections",
      title: "Answers",
      type: "array",
      group: "answers",
      readOnly: true,
      of: [
        defineArrayMember({
          type: "object",
          name: "onboardingSection",
          title: "Section",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({
              name: "items",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "onboardingItem",
                  fields: [
                    defineField({ name: "question", type: "string" }),
                    defineField({ name: "answer", type: "text", rows: 4 }),
                    defineField({ name: "links", type: "array", of: [defineArrayMember({ type: "string" })] }),
                    defineField({
                      name: "status",
                      title: "Access status",
                      type: "string",
                      options: {
                        list: [
                          { title: "Done", value: "done" },
                          { title: "Needs help", value: "help" },
                          { title: "Not applicable", value: "na" },
                        ],
                      },
                    }),
                  ],
                  preview: {
                    select: { title: "question", subtitle: "answer", status: "status" },
                    prepare: ({ title, subtitle, status }) => ({
                      title: title as string,
                      subtitle: (status ? `[${status}] ` : "") + String(subtitle ?? "").slice(0, 120),
                    }),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "title", items: "items" },
            prepare: ({ title, items }) => ({
              title: title as string,
              subtitle: `${(items as unknown[] | undefined)?.length ?? 0} answers`,
            }),
          },
        }),
      ],
    }),

    defineField({
      name: "files",
      title: "Uploads",
      type: "array",
      group: "answers",
      readOnly: true,
      of: [
        defineArrayMember({
          type: "object",
          name: "onboardingFile",
          fields: [
            defineField({ name: "question", type: "string" }),
            defineField({ name: "name", type: "string" }),
            defineField({ name: "url", type: "url" }),
            defineField({ name: "size", type: "number" }),
          ],
          preview: {
            select: { title: "name", subtitle: "question" },
          },
        }),
      ],
    }),

    defineField({
      name: "answersJson",
      title: "Raw answers (JSON)",
      type: "text",
      rows: 12,
      group: "meta",
      readOnly: true,
      description:
        "The lossless copy the resume link restores from. The Answers list above is a rendered snapshot and drops anything left blank.",
    }),

    defineField({ name: "startedAt", title: "Started", type: "datetime", group: "meta", readOnly: true }),
    defineField({ name: "updatedAt", title: "Last saved", type: "datetime", group: "meta", readOnly: true }),
    defineField({ name: "submittedAt", title: "Submitted", type: "datetime", group: "meta", readOnly: true }),
    defineField({
      name: "resumeEmailSentTo",
      title: "Resume link sent to",
      type: "string",
      group: "meta",
      readOnly: true,
    }),

    defineField({
      name: "notes",
      title: "Internal notes",
      type: "text",
      rows: 5,
      group: "meta",
      description: "The only editable field. Anything the client said elsewhere, or corrections after the call.",
    }),
  ],

  preview: {
    select: { title: "companyName", contact: "contactName", status: "status", submittedAt: "submittedAt" },
    prepare: ({ title, contact, status, submittedAt }) => ({
      // Without a `?client=` slug there is no company name, so the person is
      // the only thing that tells two submissions apart in the list.
      title: (title as string) || (contact as string) || "Untitled submission",
      subtitle: [
        status === "submitted" ? "Submitted" : "In progress",
        contact,
        submittedAt ? new Date(submittedAt as string).toLocaleDateString("en-GB") : null,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
