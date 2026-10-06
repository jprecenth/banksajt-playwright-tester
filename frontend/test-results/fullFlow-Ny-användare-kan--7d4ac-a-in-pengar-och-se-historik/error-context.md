# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fullFlow.spec.js >> Ny användare kan logga in, sätta in pengar, och se historik
- Location: tests\fullFlow.spec.js:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Konto skapat!')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Konto skapat!') with timeout 5000ms
  - waiting for getByText('Konto skapat!')

```

```yaml
- text: BankSajt.se
- paragraph: Välkommen till BankSajt.se
- paragraph: – Sajten för Din Bank
- main:
  - link "Startsida":
    - /url: /
  - link "Logga In":
    - /url: /login
  - link "Skapa Konto":
    - /url: /register
  - paragraph:
    - link "Hem":
      - /url: /
    - text: /Skapa konto
  - text: "Skapa ett BankSajt-konto och kom ett steg närmare din ekonomi! Välj ditt användarnamn:"
  - textbox "Välj ditt användarnamn:":
    - /placeholder: Användarnamn
    - text: PTester10
  - text: "Skapa ett lösenord:"
  - textbox "Skapa ett lösenord:":
    - /placeholder: Lösenord
    - text: PTester10PW
  - button "Skapa konto!"
  - paragraph: Något gick fel, försök igen!
  - img "Piggy Bank Logo"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test("Ny användare kan logga in, sätta in pengar, och se historik", async ({ page }) => {
  4  |     // 1. En ny användare kan registrera sig
  5  |     await page.goto("/register");
  6  |     
  7  |     await page.locator("#username").fill("PTester10");
  8  |     await page.locator("#password").fill("PTester10PW");
  9  |     await page.getByText("Skapa konto!").click();
  10 |     
> 11 |     await expect(page.getByText("Konto skapat!")).toBeVisible();
     |                                                   ^ Error: expect(locator).toBeVisible() failed
  12 |     
  13 |     // 2. Logga in 
  14 |     await page.goto("/login");
  15 |     await page.locator("#username").fill("PTester10");
  16 |     await page.locator("#password").fill("PTester10PW");
  17 |     await page.getByText("Logga in!").click();
  18 |     await expect(page).toHaveURL(/\/account$/);
  19 |     
  20 |     // 3. Sätta in ett belopp
  21 |     await page.locator("#amount").fill("240");
  22 |     await page.getByText("Sätt in").click();
  23 |     await expect(page.getByText("Insättning validerad!")).toBeVisible();
  24 |     
  25 |     // 4. Se rätt nytt saldo
  26 |     await expect(page.locator("#yourBalance")).toHaveText("240");
  27 | 
  28 |     // 5. Se insättningen i historiken
  29 |     await page.getByText("här").click();
  30 |     await expect(page).toHaveURL(/\/history$/);
  31 |     await expect(page.getByRole("table").getByRole("row").nth(1).getByText("240")).toBeVisible()
  32 | });
```