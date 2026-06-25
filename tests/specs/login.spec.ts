import { test as baseTest, expect } from '../fixtures/fixtures';
import { attachNetworkCapture } from 'postman-playwright';

const test = attachNetworkCapture(baseTest);

test.describe('Login functionality', () => {
    test('user can login with valid credentials', async ({ loginPage, validCredentials }) => {
        await loginPage.goto();
        await loginPage.login(validCredentials.email, validCredentials.password);
    });
    test('user sees error with invalid credentials', async ({ loginPage, invalidCredentials }) => {
        await loginPage.goto();
        await loginPage.loginWithInvalidCredentials(invalidCredentials.email, invalidCredentials.password);
        await expect(loginPage.errorMessage).toContainText('Incorrect username or password.');
    });
});