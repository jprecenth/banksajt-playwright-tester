# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: staticTransactions.spec.js >> Ett kontos transaktioner består efter ut- och inloggning
- Location: tests\staticTransactions.spec.js:3:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('#yourBalance')
Expected: "240"
Received: "480"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" locator('#yourBalance') with timeout 5000ms
  - waiting for locator('#yourBalance')
    14 × locator resolved to <span id="yourBalance">480</span>
       - unexpected value "480"

```

```yaml
- text: "480"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test("Ett kontos transaktioner består efter ut- och inloggning", async ({ page }) => {
  4  |     // 1. Testkontot kan logga in 
  5  |     await page.goto("/login");
  6  |     await page.locator("#username").fill("PTester1001");
  7  |     await page.locator("#password").fill("PTester1001");
  8  |     await page.getByText("Logga in!").click();
  9  |     await expect(page).toHaveURL(/\/account$/);
  10 | 
  11 |     // 2. Sätta in ett belopp
  12 |     await page.locator("#amount").fill("240");
  13 |     await page.getByText("Sätt in").click();
  14 |     await expect(page.getByText("Insättning validerad!")).toBeVisible();
  15 | 
  16 |     // 3. Se rätt nytt saldo
> 17 |     await expect(page.locator("#yourBalance")).toHaveText("240");
     |                                                ^ Error: expect(locator).toHaveText(expected) failed
  18 | 
  19 |     // 4. Kan logga ut och in igen
  20 |     await page.getByText("Logga ut").click();
  21 |     await page.goto("/login");
  22 |     await page.locator("#username").fill("PTester1001");
  23 |     await page.locator("#password").fill("PTester1001");
  24 |     await page.getByText("Logga in!").click();
  25 |     await expect(page).toHaveURL(/\/account$/);
  26 | 
  27 |     // 5. Samma saldo består
  28 |     await expect(page.locator("#yourBalance")).toHaveText("240");
  29 | 
  30 | });
  31 | 
  32 | test("Ogiltiga summor kan inte sättas in", async ({ page }) => {
  33 |     // 1. Testkontot kan logga in 
  34 |     await page.goto("/login");
  35 |     await page.locator("#username").fill("PTester100010");
  36 |     await page.locator("#password").fill("PTester100010");
  37 |     await page.getByText("Logga in!").click();
  38 |     await expect(page).toHaveURL(/\/account$/);
  39 | 
  40 |     // 2. Mata in ett icke-godkänt belopp
  41 |     await page.locator("#amount").fill("-5");
  42 |     await page.getByText("Sätt in").click();
  43 | 
  44 |     // 3. Få ett fel
  45 |     await expect(page.locator("#errorText")).toContainText("Otillåten insättning!");
  46 | 
  47 |     // 4. Ursprungliga saldot består
  48 |     await expect(page.locator("#yourBalance")).toHaveText("0");
  49 |     
  50 |     // 5. Historiken förblir tom
  51 |     await page.goto("/history");
  52 |     await expect(page.locator("#emptyText")).toContainText("Inga tidigare insättningar")
  53 | });
  54 | 
```