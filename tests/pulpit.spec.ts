import { expect, test } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';

test.describe(' Pulpit tests ', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const expectedUsername = 'Jan Demobankowy';

    await page.goto('/');
    await loginPage.loginInput.fill(loginData.username);
    await loginPage.passwordInput.fill(loginData.password);
    await loginPage.loginButton.click();

    await expect(page.getByTestId('user-name')).toHaveText(expectedUsername);
  });

  test('account money transfer', async ({ page }) => {
    const receiverId = '2';
    const transferAmount = '123';
    const transferTitle = 'pizza';
    const expectedTransferReceiver = 'Chuck Demobankowy';

    await page.locator('#widget_1_transfer_receiver').selectOption(receiverId);
    await page.locator('#widget_1_transfer_amount').fill(transferAmount);
    await page.locator('#widget_1_transfer_title').fill(transferTitle);
    await page.getByRole('button', { name: 'wykonaj' }).click();
    await page.getByTestId('close-button').click();

    await expect(page.locator('#show_messages')).toHaveText(
      `Przelew wykonany! ${expectedTransferReceiver} - ${transferAmount},00PLN - ${transferTitle} `,
    );
  });

  test('mobile money transfer', async ({ page }) => {
    const topUpReceiver = '500 xxx xxx';
    const topUpAmount = '10';
    const expectedTopUpMessage = `Doładowanie wykonane! ${topUpAmount},00PLN na numer ${topUpReceiver}`;

    await page.locator('#widget_1_topup_receiver').selectOption(topUpReceiver);
    await page.locator('#widget_1_topup_amount').fill(topUpAmount);
    await page.locator('#widget_1_topup_agreement').check();

    await expect(
      page.locator('#widget_1_topup_agreement').isChecked(),
    ).toBeTruthy();

    await page.getByRole('button', { name: 'doładuj telefon' }).click();
    await page.getByTestId('close-button').click();

    await expect(page.getByTestId('message-text')).toHaveText(
      expectedTopUpMessage,
    );
  });

  test('mobile top-up warning test', async ({ page }) => {
    const requiredFieldWarning = 'pole wymagane';

    await page.getByRole('button', { name: 'doładuj telefon' }).click();

    await expect(page.getByTestId('error-widget-1-topup-receiver')).toHaveText(
      requiredFieldWarning,
    );
    await expect(page.getByTestId('error-widget-1-topup-amount')).toHaveText(
      requiredFieldWarning,
    );
    await expect(page.getByTestId('error-widget-1-topup-agreement')).toHaveText(
      requiredFieldWarning,
    );

    const topUpReceiver = '500 xxx xxx';
    const topUpAmount = '10';

    await page.locator('#widget_1_topup_receiver').selectOption(topUpReceiver);
    await page.locator('#widget_1_topup_amount').fill(topUpAmount);
    await page.locator('#widget_1_topup_agreement').check();

    await expect(
      page.locator('#widget_1_topup_agreement').isChecked(),
    ).toBeTruthy();
    await expect(
      page.getByTestId('error-widget-1-topup-receiver'),
    ).toBeHidden();
    await expect(page.getByTestId('error-widget-1-topup-amount')).toBeHidden();
    await expect(
      page.getByTestId('error-widget-1-topup-agreement'),
    ).toBeHidden();
  });

  test('mobile top-up amount warning test', async ({ page }) => {
    const topUpReceiver = '500 xxx xxx';
    let topUpAmount = '1';
    const amountIsHigherThan5 = 'kwota musi być większa lub równa 5';

    await page.locator('#widget_1_topup_receiver').selectOption(topUpReceiver);
    await page.locator('#widget_1_topup_amount').fill(topUpAmount);
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toHaveText(amountIsHigherThan5);

    topUpAmount = '5';

    await page.locator('#widget_1_topup_amount').fill(topUpAmount);
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toBeHidden();

    topUpAmount = '150';

    await page.locator('#widget_1_topup_amount').fill(topUpAmount);
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toBeHidden();

    topUpAmount = '151';
    const amountIsHigherThan150 = 'kwota musi być mniejsza lub równa 150';

    await page.locator('#widget_1_topup_amount').fill(topUpAmount);
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toHaveText(amountIsHigherThan150);

    topUpAmount = '50,01';
    const amountWithoutPennies = 'kwota musi być bez groszy';

    await page.locator('#widget_1_topup_amount').fill(topUpAmount);
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toHaveText(amountWithoutPennies);

    topUpAmount = '50,,01';
    const amountIsIncorrect = 'podana kwota jest niepoprawna';

    await page.locator('#widget_1_topup_amount').fill(topUpAmount);
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toHaveText(amountIsIncorrect);
  });

  test('correct balance after sucessful mobile top-up', async ({ page }) => {
    const topUpReceiver = '500 xxx xxx';
    const topUpAmount = '10';
    const initialBalance = await page.locator('#money_value').innerText();
    const expectedBalance = Number(initialBalance) - Number(topUpAmount);

    await page.locator('#widget_1_topup_receiver').selectOption(topUpReceiver);
    await page.locator('#widget_1_topup_amount').fill(topUpAmount);
    await page.locator('#widget_1_topup_agreement').check();
    await page.getByRole('button', { name: 'doładuj telefon' }).click();
    await page.getByTestId('close-button').click();

    await expect(page.locator('#money_value')).toHaveText(`${expectedBalance}`);
  });
});
