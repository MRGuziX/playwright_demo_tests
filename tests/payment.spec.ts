import { expect, test } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';

test.describe('Payment tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const expectedUsername = 'Jan Demobankowy';

    await page.goto('/');
    await loginPage.loginInput.fill(loginData.username);
    await loginPage.passwordInput.fill(loginData.password);
    await loginPage.loginButton.click();

    await expect(page.getByTestId('user-name')).toHaveText(expectedUsername);
  });

  test('simple transition', async ({ page }) => {
    const transferAmount = '200';
    const transferTitle = 'Przelew za Pizze';
    const expectedTransferReceiver = 'John Bobas';
    const accountNumber = '11 2312 3123 1231 2312 3123 12313';
    const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN dla ${expectedTransferReceiver}`;

    await page.getByRole('link', { name: 'płatności' }).click();
    await page.getByTestId('transfer_receiver').fill(expectedTransferReceiver);
    await page.getByTestId('form_account_to').fill(accountNumber);
    await page.getByTestId('form_amount').fill(transferAmount);
    await page.getByText('tytułem').click();
    await page.getByTestId('form_title').fill(transferTitle);
    await page.getByRole('button', { name: 'wykonaj przelew' }).click();
    await page.getByTestId('close-button').click();

    await expect(page.locator('#show_messages')).toHaveText(expectedMessage);
  });
});
