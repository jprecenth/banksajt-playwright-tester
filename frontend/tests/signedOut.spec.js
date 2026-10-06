import { test, expect } from '@playwright/test';

test("En användare utan konto kan inte komma åt inloggningsbegränsade sidor", async ({ page }) => {

    // 1. ingen användare är inloggad
    await page.goto("/");
    await expect(page.getByText("Logga ut")).toBeHidden();
    await expect(page.getByText("Logga in")).toBeVisible();

    // 2. Användare utan konto kan inte öppna /account
    await page.goto("/account");
    await expect(page.getByText("Logga in för att se ditt saldo")).toBeVisible();

    // 3. Användare utan konto kan inte öppna /history
    await page.goto("/history");
    await expect(page.getByText("Logga in för att se din transaktionshistorik.")).toBeVisible();
});