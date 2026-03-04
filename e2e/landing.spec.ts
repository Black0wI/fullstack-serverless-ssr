import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
    test("should load and display hero section", async ({ page }) => {
        await page.goto("/");

        // Header is visible
        await expect(page.locator(".header")).toBeVisible();
        await expect(page.locator(".header__logo-text")).toHaveText("Tech Portal");

        // Hero content
        await expect(page.locator(".hero__title")).toContainText("Edge");
        await expect(page.locator(".badge")).toContainText("Production Ready");

        // CTA buttons
        await expect(page.locator(".hero__actions .btn--primary")).toBeVisible();
        await expect(page.locator(".hero__actions .btn--ghost")).toBeVisible();
    });

    test("should display all feature cards", async ({ page }) => {
        await page.goto("/");

        const cards = page.locator(".feature-card");
        await expect(cards).toHaveCount(6);

        // Verify key feature titles
        await expect(cards.nth(0)).toContainText("Static Edge Delivery");
        await expect(cards.nth(1)).toContainText("Terraform IaC");
        await expect(cards.nth(2)).toContainText("GitHub Actions");
        await expect(cards.nth(3)).toContainText("Claude AI");
        await expect(cards.nth(4)).toContainText("TypeScript Strict");
        await expect(cards.nth(5)).toContainText("Premium Design System");
    });

    test("should display footer", async ({ page }) => {
        await page.goto("/");

        await expect(page.locator(".footer")).toBeVisible();
        await expect(page.locator(".footer__copy")).toContainText("MIT License");
    });

    test("should have correct meta title", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveTitle(/Tech Portal/);
    });
});

test.describe("Navigation", () => {
    test("should navigate to features section", async ({ page }) => {
        await page.goto("/");
        await page.click('a[href="#features"]');
        await expect(page.locator(".features")).toBeInViewport();
    });
});

test.describe("Responsive", () => {
    test("should hide desktop nav on mobile", async ({ page, isMobile }) => {
        test.skip(!isMobile, "Mobile-only test");
        await page.goto("/");
        await expect(page.locator(".header__nav")).not.toBeVisible();
    });
});
