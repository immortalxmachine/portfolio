import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
      <p className="mt-3 max-w-md text-pretty text-muted-foreground">
        The page you’re looking for doesn’t exist or may have moved. Try the command
        menu (⌘K) or head back home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/#projects">View projects</Link>
        </Button>
      </div>
    </div>
  );
}
