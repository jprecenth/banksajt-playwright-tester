import { test, expect } from '@playwright/test';

test("Ett kontos transaktioner består efter ut- och inloggning", async ({ page }) => {
    // 1. Testkontot kan logga in 
    await page.goto("/login");
    await page.locator("#username").fill("PTester1001");
    await page.locator("#password").fill("PTester1001");
    await page.getByText("Logga in!").click();
    await expect(page).toHaveURL(/\/account$/);

    // 2. Sätta in ett belopp
    await page.locator("#amount").fill("240");
    await page.getByText("Sätt in").click();
    await expect(page.getByText("Insättning validerad!")).toBeVisible();

    // 3. Se rätt nytt saldo
    await expect(page.locator("#yourBalance")).toHaveText("240");

    // 4. Kan logga ut och in igen
    await page.getByText("Logga ut").click();
    await page.goto("/login");
    await page.locator("#username").fill("PTester1001");
    await page.locator("#password").fill("PTester1001");
    await page.getByText("Logga in!").click();
    await expect(page).toHaveURL(/\/account$/);

    // 5. Samma saldo består
    await expect(page.locator("#yourBalance")).toHaveText("240");

});

test("Ogiltiga summor kan inte sättas in", async ({ page }) => {
    // 1. Testkontot kan logga in 
    await page.goto("/login");
    await page.locator("#username").fill("PTester100010");
    await page.locator("#password").fill("PTester100010");
    await page.getByText("Logga in!").click();
    await expect(page).toHaveURL(/\/account$/);

    // 2. Mata in ett icke-godkänt belopp
    await page.locator("#amount").fill("-5");
    await page.getByText("Sätt in").click();

    // 3. Få ett fel
    await expect(page.locator("#errorText")).toContainText("Otillåten insättning!");

    // 4. Ursprungliga saldot består
    await expect(page.locator("#yourBalance")).toHaveText("0");
    
    // 5. Historiken förblir tom
    await page.goto("/history");
    await expect(page.locator("#emptyText")).toContainText("Inga tidigare insättningar")
});
