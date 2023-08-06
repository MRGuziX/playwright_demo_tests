import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';

test.describe('User login to Demobank', () => {
  test('successful login with correct username', async ({ page }) => {
    const expectedUsername = 'Jan Demobankowy';

    await page.goto('/');
    await page.getByTestId('login-input').fill(loginData.username);
    await page.getByTestId('password-input').fill(loginData.password);
    await page.getByTestId('login-button').click();
    await page.getByTestId('user-name').click();

    await expect(page.getByTestId('user-name')).toHaveText(expectedUsername);
  });

  test('unsuccessful login with too short username', async ({ page }) => {
    const expectedErrorMessage = 'identyfikator ma min. 8 znaków';

    await page.goto('/');
    await page.getByTestId('login-input').fill(loginData.incorrectUsername);
    await page.getByTestId('password-input').fill(loginData.password);

    await expect(page.getByTestId('error-login-id')).toHaveText(
      expectedErrorMessage,
    );
  });

  test('unsuccessful login with too short password', async ({ page }) => {
    const expectedErrorMessage = 'hasło ma min. 8 znaków';

    await page.goto('/');
    await page.getByTestId('login-input').fill(loginData.username);
    await page.getByTestId('password-input').fill(loginData.incorrectPassword);
    await page.getByTestId('password-input').blur();

    await expect(page.getByTestId('error-login-password')).toHaveText(
      expectedErrorMessage,
    );
  });
});
