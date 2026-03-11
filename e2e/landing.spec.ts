import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should load and display hero section", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".header")).toBeVisible();
    await expect(page.locator(".header__logo-text")).toHaveText(
      "Next.js SST Boilerplate",
    );
    await expect(page.locator(".hero__title")).toContainText("Build");
    await expect(page.locator(".hero__title")).toContainText("Serverless");
    await expect(page.locator(".badge")).toContainText("Production-Ready Foundation");
    await expect(page.locator(".hero__actions .btn--primary")).toBeVisible();
    await expect(page.locator(".hero__actions .btn--ghost")).toBeVisible();
  });

  test("should display all feature cards", async ({ page }) => {
    await page.goto("/");

    const cards = page.locator(".feature-card");
    await expect(cards).toHaveCount(6);

    await expect(page.getByRole("heading", { name: "Full-Stack SSR" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "SST v4 Ion" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "CLI Direct Deploy" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI-Ready" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "TypeScript Strict" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Premium Design System" }),
    ).toBeVisible();
  });

  test("should display footer", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".footer")).toBeVisible();
    await expect(page.locator(".footer__copy")).toContainText("MIT License");
  });

  test("should have correct meta title", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page).toHaveTitle(/Next\.js SST Boilerplate/);
  });
});

test.describe("Navigation", () => {
  test("should navigate to features section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Explore Features" }).click();
    await expect(page.locator(".features")).toBeInViewport();
  });

  test("should open examples page from header navigation", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop navigation only");
    await page.goto("/");
    await page.getByRole("link", { name: "Examples" }).click();
    await expect(page).toHaveURL(/\/examples\/?$/);
    await expect(
      page.getByRole("heading", { name: /Next\.js 16 Features/i }),
    ).toBeVisible();
    await expect(page.getByText("Server Actions + Zod")).toBeVisible();
    await expect(page.getByRole("heading", { name: "use cache" })).toBeVisible();
  });
});

test.describe("Responsive", () => {
  test("should hide desktop nav on mobile", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile-only test");
    await page.goto("/");
    await expect(page.locator(".header__nav")).not.toBeVisible();
  });
});
