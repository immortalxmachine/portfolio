import { getProjects } from "@/lib/github";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { WorkExplorer } from "@/components/projects/work-explorer";
import { Research } from "@/components/sections/research";
import { Timeline } from "@/components/sections/timeline";
import { Contact } from "@/components/sections/contact";

/** ISR: regenerate the home page at most once an hour; on-demand revalidation
 *  via POST /api/revalidate refreshes it within seconds on a repo push. */
export const revalidate = 3600;

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <>
      <Hero />
      <About />
      <WorkExplorer projects={projects} />
      <Research />
      <Timeline />
      <Contact />
    </>
  );
}
