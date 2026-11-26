import { expect, test } from "@playwright/test";

// Assertions target stable slugs/URLs, not display titles — so they pass
// whether project data comes from GitHub (portfolio.json titles) or the
// committed fallback snapshot.

test("home loads with the hero name and project grid", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /ADHITHYAA V P/i })).toBeVisible();

  // Projects render (link by stable slug).
  await expect(page.locator('a[href="/projects/parcelflow"]').first()).toBeVisible();
  await expect(page.locator('a[href="/projects/docutrack-ai"]').first()).toBeVisible();
});

test("category filter narrows the project grid", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Software", exact: true }).click();

  await expect(page.locator('a[href="/projects/shipsense"]').first()).toBeVisible();
  await expect(page.locator('a[href="/projects/parcelflow"]')).toHaveCount(0);
});

test("command palette opens", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open command menu" }).click();
  await expect(
    page.getByPlaceholder(/Jump to a section, project, or action/i),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByPlaceholder(/Jump to a section, project, or action/i),
  ).toBeHidden();
});

test("a project detail page renders its header", async ({ page }) => {
  await page.goto("/projects/parcelflow");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /View on GitHub/i })).toBeVisible();
});

test("resume is linked for download from the hero", async ({ page }) => {
  await page.goto("/");
  const resumeLink = page.getByRole("link", { name: /Download Résumé/i });
  await expect(resumeLink).toHaveAttribute("href", /Adhithyaa_VP_Resume\.pdf$/);
});
