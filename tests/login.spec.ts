import { test, expect } from '@playwright/test';

test.describe('User login to Demobank', () => {
  const url = 'https://demo-bank.vercel.app/';

  test('successful login with correct username', async ({ page }) => {
    const username = 'test1234';
    const password = 'password';
    const expectedUsername = 'Jan Demobankowy';

    await page.goto(url);
    await page.getByTestId('login-input').fill(username);
    await page.getByTestId('password-input').fill(password);
    await page.getByTestId('login-button').click();
    await page.getByTestId('user-name').click();

    await expect(page.getByTestId('user-name')).toHaveText(expectedUsername);
  });

  test('unsuccessful login with too short username', async ({ page }) => {
    const username = 'test';
    const password = 'password';
    const expectedErrorMessage = 'identyfikator ma min. 8 znaków';

    await page.goto(url);
    await page.getByTestId('login-input').fill(username);
    await page.getByTestId('password-input').fill(password);

    await expect(page.getByTestId('error-login-id')).toHaveText(
      expectedErrorMessage,
    );
  });

  test('unsuccessful login with too short password', async ({ page }) => {
    const username = 'test1234';
    const password = 'Pass';
    const expectedErrorMessage = 'hasło ma min. 8 znaków';

    await page.goto(url);
    await page.getByTestId('login-input').fill(username);
    await page.getByTestId('password-input').fill(password);
    await page.getByTestId('password-input').blur();

    await expect(page.getByTestId('error-login-password')).toHaveText(
      expectedErrorMessage,
    );
  });
});
