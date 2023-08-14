import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';

test.describe('User login to Demobank', () => {
  test('successful login with correct username', async ({ page }) => {
    const expectedUsername = 'Jan Demobankowy';
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await loginPage.loginInput.fill(loginData.username);
    await loginPage.passwordInput.fill(loginData.password);
    await loginPage.loginButton.click();

    await expect(page.getByTestId('user-name')).toHaveText(expectedUsername);
  });

  test('unsuccessful login with too short username', async ({ page }) => {
    const expectedErrorMessage = 'identyfikator ma min. 8 znaków';
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await loginPage.loginInput.fill(loginData.incorrectUsername);
    await loginPage.passwordInput.fill(loginData.password);

    await expect(page.getByTestId('error-login-id')).toHaveText(
      expectedErrorMessage,
    );
  });

  test('unsuccessful login with too short password', async ({ page }) => {
    const expectedErrorMessage = 'hasło ma min. 8 znaków';
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await loginPage.loginInput.fill(loginData.username);
    await loginPage.passwordInput.fill(loginData.incorrectPassword);
    await loginPage.passwordInput.blur();

    await expect(page.getByTestId('error-login-password')).toHaveText(
      expectedErrorMessage,
    );
  });
});
