import { Mail } from "lucide-react";

import { profile } from "../../../content/profile";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

/** Site footer — server component (no interactivity). */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-semibold tracking-tight">{profile.name}</p>
          <p className="text-sm text-muted-foreground">{profile.roleLine}</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" aria-hidden />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <LinkedinIcon className="size-4" aria-hidden />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <Mail className="size-4" aria-hidden />
          </a>
        </div>
      </div>

      <div className="container-page flex flex-col gap-1 border-t border-border py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {profile.name}. Built with Next.js, TypeScript &amp; Tailwind.
        </p>
        <p>Projects update automatically from GitHub.</p>
      </div>
    </footer>
  );
}
