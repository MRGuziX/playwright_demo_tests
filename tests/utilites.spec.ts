import { expect, test } from "@playwright/test";

const username = "test1234";
const password = "password";

test.beforeAll(async ({ page }) => {
  await page.goto("https://demo-bank.vercel.app/");
  await page.getByTestId("login-input").fill(username);
  await page.getByTestId("password-input").fill(password);
  await page.getByTestId("login-button").click();

  await expect(page.getByTestId("user-name")).toHaveText("Jan Demobankowy");
});

test.afterAll(async ({ page }) => {
  await page.close();
});
