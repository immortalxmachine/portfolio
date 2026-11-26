import type { Metadata } from "next";
import { Download, ExternalLink } from "lucide-react";

import { profile } from "../../../content/profile";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${profile.name} — ${profile.roleLine}.`,
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Résumé</h1>
          <p className="mt-1 text-muted-foreground">
            {profile.name} — {profile.roleLine}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <a href={profile.resumePath} download>
              <Download className="size-4" aria-hidden />
              Download PDF
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={profile.resumePath} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" aria-hidden />
              Open in new tab
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-muted">
        <object
          data={`${profile.resumePath}#view=FitH`}
          type="application/pdf"
          className="h-[80vh] w-full"
          aria-label={`Résumé of ${profile.name}`}
        >
          <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <p className="text-muted-foreground">
              Your browser can’t display the PDF inline.
            </p>
            <Button asChild>
              <a href={profile.resumePath} download>
                <Download className="size-4" aria-hidden />
                Download the résumé
              </a>
            </Button>
          </div>
        </object>
      </div>
    </div>
  );
}
