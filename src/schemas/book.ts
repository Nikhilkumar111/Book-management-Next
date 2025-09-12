import { z } from "zod";

export const bookSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(20, "Title must be less than 20 characters"),

  author: z
    .string()
    .min(2, "Author must be at least 2 characters")
    .max(15, "Author must be less than 15 characters"),

  genre: z
    .string()
    .min(3, "Genre must be at least 3 characters")
    .max(15, "Genre must be less than 15 characters"),

  price: z
    .number()
    .nonnegative("Price must be 0 or greater"),

  publishedAt: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Invalid date format")
    .transform((val) => (val ? new Date(val) : undefined)), // <-- transform to Date
});

export type BookInput = z.infer<typeof bookSchema>;
