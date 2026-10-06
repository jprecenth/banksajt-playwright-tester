import { test, expect } from '@playwright/test';

test("Ny användare kan logga in, sätta in pengar, och se historik", async ({ page }) => {
    // 1. En ny användare kan registrera sig
    await page.goto("/register");
    
    await page.locator("#username").fill("PTester10");
    await page.locator("#password").fill("PTester10PW");
    await page.getByText("Skapa konto!").click();
    
    await expect(page.getByText("Konto skapat!")).toBeVisible();
    
    // 2. Logga in 
    await page.goto("/login");
    await page.locator("#username").fill("PTester10");
    await page.locator("#password").fill("PTester10PW");
    await page.getByText("Logga in!").click();
    await expect(page).toHaveURL(/\/account$/);
    
    // 3. Sätta in ett belopp
    await page.locator("#amount").fill("240");
    await page.getByText("Sätt in").click();
    await expect(page.getByText("Insättning validerad!")).toBeVisible();
    
    // 4. Se rätt nytt saldo
    await expect(page.locator("#yourBalance")).toHaveText("240");

    // 5. Se insättningen i historiken
    await page.getByText("här").click();
    await expect(page).toHaveURL(/\/history$/);
    await expect(page.getByRole("table").getByRole("row").nth(1).getByText("240")).toBeVisible()
});