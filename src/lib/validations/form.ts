import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import * as cheerio from "cheerio";

export const FORM_TITLE_MIN_LENGTH = 1;
export const FORM_TITLE_MAX_LENGTH = 100;
export const FORM_BODY_MIN_LENGTH = 1;
export const FORM_BODY_MAX_LENGTH = 20000;

export const createForumServerInput = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .trim()
    .min(FORM_TITLE_MIN_LENGTH, "Title is required")
    .max(
      FORM_TITLE_MAX_LENGTH,
      `Title must be at most ${FORM_TITLE_MAX_LENGTH.toLocaleString()} characters long`,
    ),
  body: z
    .string({
      required_error: "Body is required",
    })
    .trim()
    .min(FORM_BODY_MIN_LENGTH, "Body is required")
    .max(
      FORM_BODY_MAX_LENGTH,
      `Body must be at most ${FORM_BODY_MAX_LENGTH.toLocaleString()} characters, including formatting and spaces.`,
    )
    .transform((value) => {
      return sanitizeHtml(value, {
        allowedTags: [
          "p",
          // "h1",
          "h2",
          "strong",
          "em",
          "s",
          "ul",
          "ol",
          "li",
          "blockquote",
          "code",
          "pre",
          "br",
          "hr",
          "a",
        ],
        allowedAttributes: {
          a: ["href", "target", "rel"],
        },
        allowedSchemes: ["http", "https", "mailto"],
        transformTags: {
          a: sanitizeHtml.simpleTransform("a", {
            target: "_blank",
            rel: "noopener noreferrer",
          }),
        },
        selfClosing: ["br", "hr"],
        // allowedStyles: {
        //   "*": {
        //     "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
        //     color: [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/],
        //     "background-color": [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/],
        //   },
        // },
        parser: {
          lowerCaseTags: true,
        },
      });
    })
    .superRefine((value, ctx) => {
      const $ = cheerio.load(value);
      const text = $.text().trim();

      if (text.length < FORM_BODY_MIN_LENGTH) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Body is required",
        });
      }
    }),
});

export const updateForumServerInput = createForumServerInput.pick({
  body: true,
});
