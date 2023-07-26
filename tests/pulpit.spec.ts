import { expect, test } from '@playwright/test';

test.describe(' Pulpit tests ', () => {
  test('account money transfer', async ({ page }) => {
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
    await page.goto('https://demo-bank.vercel.app/');
    await page.getByTestId('login-input').fill('test1234');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('user-name')).toHaveText('Jan Demobankowy');

    await page.locator('#widget_1_topup_receiver').selectOption('500 xxx xxx');
    await page.locator('#widget_1_topup_amount').fill('11');
    await page.locator('#widget_1_topup_agreement').check();

    await expect(
      page.locator('#widget_1_topup_agreement').isChecked(),
    ).toBeTruthy();

    await page.getByRole('button', { name: 'doładuj telefon' }).click();
    await page.getByTestId('close-button').click();

    await expect(page.getByTestId('message-text')).toHaveText(
      'Doładowanie wykonane! 11,00PLN na numer 500 xxx xxx',
    );
  });

  test('mobile top-up warning test', async ({ page }) => {
    await page.goto('https://demo-bank.vercel.app/');
    await page.getByTestId('login-input').fill('test1234');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('user-name')).toHaveText('Jan Demobankowy');

    await page.getByRole('button', { name: 'doładuj telefon' }).click();

    await expect(page.getByTestId('error-widget-1-topup-receiver')).toHaveText(
      'pole wymagane',
    );
    await expect(page.getByTestId('error-widget-1-topup-amount')).toHaveText(
      'pole wymagane',
    );
    await expect(page.getByTestId('error-widget-1-topup-agreement')).toHaveText(
      'pole wymagane',
    );

    await page.locator('#widget_1_topup_receiver').selectOption('500 xxx xxx');
    await page.locator('#widget_1_topup_amount').fill('11');
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
    await page.goto('https://demo-bank.vercel.app/');
    await page.getByTestId('login-input').fill('test1234');
    await page.getByTestId('password-input').fill('password');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('user-name')).toHaveText('Jan Demobankowy');

    await page.locator('#widget_1_topup_receiver').selectOption('500 xxx xxx');
    await page.locator('#widget_1_topup_amount').fill('1');
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toHaveText('kwota musi być większa lub równa 5');

    await page.locator('#widget_1_topup_amount').fill('5');
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toBeHidden();

    await page.locator('#widget_1_topup_amount').fill('150');
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toBeHidden();

    await page.locator('#widget_1_topup_amount').fill('151');
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toHaveText('kwota musi być mniejsza lub równa 150');

    await page.locator('#widget_1_topup_amount').fill('50,01');
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toHaveText('kwota musi być bez groszy');

    await page.locator('#widget_1_topup_amount').fill('50,,01');
    await page.locator('#widget_1_topup_amount').blur();

    await expect
      .soft(page.getByTestId('error-widget-1-topup-amount'))
      .toHaveText('podana kwota jest niepoprawna');
  });
});
