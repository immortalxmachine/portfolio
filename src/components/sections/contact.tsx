"use client";

import * as React from "react";
import { Check, Copy, Mail, Send } from "lucide-react";
import { toast } from "sonner";

import { profile } from "../../../content/profile";
import { contactSchema } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "./section-heading";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function buildMailto(name: string, email: string, message: string) {
  const subject = encodeURIComponent(`Portfolio contact from ${name || "a visitor"}`);
  const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
  return `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

export function Contact() {
  const [values, setValues] = React.useState({ name: "", email: "", message: "", company: "" });
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const update = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const f = parsed.error.flatten().fieldErrors;
      setErrors({
        name: f.name?.[0],
        email: f.email?.[0],
        message: f.message?.[0],
      });
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as { ok: boolean; fallback?: boolean; error?: string };

      if (data.ok) {
        toast.success("Message sent — I'll get back to you soon!");
        setValues({ name: "", email: "", message: "", company: "" });
      } else if (data.fallback) {
        // No server email configured → open the visitor's mail client.
        toast.info("Opening your email app…");
        window.location.href = buildMailto(values.name, values.email, values.message);
      } else {
        toast.error(data.error ?? "Something went wrong. Please email me directly.");
      }
    } catch {
      toast.info("Opening your email app…");
      window.location.href = buildMailto(values.name, values.email, values.message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = (invalid?: string) =>
    cn(
      "w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-foreground",
      invalid ? "border-red-500/60" : "border-border",
    );

  return (
    <section id="contact" className="scroll-mt-16 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="06 / Contact"
          title="Get in touch"
          description="Open to internships and new-grad roles in AI, data and software. Let’s talk."
        />

        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
          {/* Direct links */}
          <Reveal className="space-y-3">
            <button
              type="button"
              onClick={copyEmail}
              className="group flex w-full items-center gap-3 rounded-xl border border-border p-4 text-left transition-colors hover:bg-accent"
            >
              <Mail className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">
                  Email
                </span>
                <span className="block truncate text-sm">{profile.email}</span>
              </span>
              {copied ? (
                <Check className="size-4 text-muted-foreground" aria-hidden />
              ) : (
                <Copy className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
              )}
            </button>

            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-accent"
            >
              <LinkedinIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              <span>
                <span className="block font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">
                  LinkedIn
                </span>
                <span className="block text-sm">Connect with me</span>
              </span>
            </a>

            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-accent"
            >
              <GithubIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
              <span>
                <span className="block font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground">
                  GitHub
                </span>
                <span className="block text-sm">@{profile.links.githubUser}</span>
              </span>
            </a>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              {/* Honeypot (visually hidden, off accessibility tree) */}
              <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label>
                  Company
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.company}
                    onChange={update("company")}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={update("name")}
                    className={inputClass(errors.name)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-err" : undefined}
                  />
                  {errors.name && (
                    <p id="name-err" className="mt-1 text-xs text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={update("email")}
                    className={inputClass(errors.email)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-err" : undefined}
                  />
                  {errors.email && (
                    <p id="email-err" className="mt-1 text-xs text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={update("message")}
                  className={cn(inputClass(errors.message), "resize-y")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-err" : undefined}
                />
                {errors.message && (
                  <p id="message-err" className="mt-1 text-xs text-red-500">
                    {errors.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                <Send className="size-4" aria-hidden />
                {submitting ? "Sending…" : "Send message"}
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
