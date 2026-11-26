/** Cache tag used for all GitHub-backed project data. Revalidating this tag
 *  (via POST /api/revalidate) refreshes every project fetch at once. */
export const PROJECTS_TAG = "projects";
