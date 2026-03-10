import { z } from "zod";

const stringArrayField = z.array(z.string().trim().min(1)).default([]);

export const generatedOutputContentSchema = z.object({
  smartstoreCopy: z.string().default(""),
  websiteCopy: z.string().default(""),
  blogDraft: z.string().default(""),
  instagramCopy: z.string().default(""),
  faqItems: stringArrayField,
  ctaVariants: stringArrayField,
});

export type GeneratedOutputContentValues = z.infer<
  typeof generatedOutputContentSchema
>;
