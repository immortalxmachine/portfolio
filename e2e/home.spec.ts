import { expect, test } from "@playwright/test";

test("home loads with the hero name and project grid", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /ADHITHYAA V P/i })).toBeVisible();

  // Projects render (from GitHub or the committed fallback snapshot).
  await expect(page.getByRole("heading", { name: "parcelflow" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "docutrack-ai" })).toBeVisible();
});

test("category filter narrows the project grid", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Software", exact: true }).click();

  await expect(page.getByRole("heading", { name: "shipsense" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "parcelflow" })).toBeHidden();
});

test("command palette opens", async ({ page }) => {
  await page.goto("/");
  // Open via the nav button (deterministic; the ⌘K shortcut is wired too).
  await page.getByRole("button", { name: "Open command menu" }).click();
  await expect(
    page.getByPlaceholder(/Jump to a section, project, or action/i),
  ).toBeVisible();
  // Escape closes it.
  await page.keyboard.press("Escape");
  await expect(
    page.getByPlaceholder(/Jump to a section, project, or action/i),
  ).toBeHidden();
});

test("a project detail page renders its header", async ({ page }) => {
  await page.goto("/projects/parcelflow");
  await expect(
    page.getByRole("heading", { level: 1, name: "parcelflow", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /View on GitHub/i })).toBeVisible();
});

test("resume is linked for download from the hero", async ({ page }) => {
  await page.goto("/");
  const resumeLink = page.getByRole("link", { name: /Download Résumé/i });
  await expect(resumeLink).toHaveAttribute("href", /Adhithyaa_VP_Resume\.pdf$/);
});
