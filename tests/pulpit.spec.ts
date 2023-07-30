import { expect, test } from '@playwright/test';

test.describe(' Pulpit tests ', () => {
  test.beforeEach(async ({ page }) => {
    const url = 'https://demo-bank.vercel.app/';
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
    const topupReceiver = '500 xxx xxx';
    const topupAmout = '10';
    const expectedTopupMessage = `Doładowanie wykonane! ${topupAmout},00PLN na numer ${topupReceiver}`;

    await page.locator('#widget_1_topup_receiver').selectOption(topupReceiver);
    await page.locator('#widget_1_topup_amount').fill(topupAmout);
    await page.locator('#widget_1_topup_agreement').check();

    await expect(
      page.locator('#widget_1_topup_agreement').isChecked(),
    ).toBeTruthy();

    await page.getByRole('button', { name: 'doładuj telefon' }).click();
    await page.getByTestId('close-button').click();

    await expect(page.getByTestId('message-text')).toHaveText(
      expectedTopupMessage,
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

    const topupReceiver = '500 xxx xxx';
    const topupAmount = '10';

    await page.locator('#widget_1_topup_receiver').selectOption(topupReceiver);
    await page.locator('#widget_1_topup_amount').fill(topupAmount);
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
    const topupReceiver = '500 xxx xxx';
    let topupAmount = '1';
    const amountIsHigherThan5 = 'kwota musi być większa lub równa 5';

    await page.locator('#widget_1_topup_receiver').selectOption(topupReceiver);
    await page.locator('#widget_1_topup_amount').fill(topupAmount);
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toHaveText(amountIsHigherThan5);

    topupAmount = '5';

    await page.locator('#widget_1_topup_amount').fill(topupAmount);
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toBeHidden();

    topupAmount = '150';

    await page.locator('#widget_1_topup_amount').fill(topupAmount);
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toBeHidden();

    topupAmount = '151';
    const amountIsHigherThan150 = 'kwota musi być mniejsza lub równa 150';

    await page.locator('#widget_1_topup_amount').fill(topupAmount);
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toHaveText(amountIsHigherThan150);

    topupAmount = '50,01';
    const amountWithoutPennies = 'kwota musi być bez groszy';

    await page.locator('#widget_1_topup_amount').fill(topupAmount);
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toHaveText(amountWithoutPennies);

    topupAmount = '50,,01';
    const amountIsIncorrect = 'podana kwota jest niepoprawna';

    await page.locator('#widget_1_topup_amount').fill(topupAmount);
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toHaveText(amountIsIncorrect);
  });
});
