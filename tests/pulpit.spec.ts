import {expect, test} from "@playwright/test";

test.describe(' Pulpit tests ',() => {

    test('test', async ({ page }) => {
        await page.goto('https://demo-bank.vercel.app/');
        await page.getByTestId('login-input').fill('test1234');
        await page.getByTestId('password-input').fill('password');
        await page.getByTestId('login-button').click();

        await expect(page.getByTestId('user-name')).toHaveText('Jan Demobankowy');

        await page.locator('#widget_1_transfer_receiver').selectOption('2');
        await page.locator('#widget_1_transfer_amount').fill('123');
        await page.locator('#widget_1_transfer_title').fill('pizza');
        await page.getByRole('button', { name: 'wykonaj' }).click();
        await page.getByTestId('close-button').click();

        await expect(page.locator('#show_messages')).toHaveText('Przelew wykonany! Chuck Demobankowy - 123,00PLN - pizza ');
    });
});