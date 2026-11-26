import { z } from "zod";

/** Shared contact-form validation (client + server). Email is validated with a
 *  simple pattern to stay stable across zod versions. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z
    .string()
    .trim()
    .min(3, "Please enter your email")
    .max(200)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"),
  message: z.string().trim().min(10, "Message is a little short").max(2000),
  // Honeypot — real users never fill this; bots often do.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
