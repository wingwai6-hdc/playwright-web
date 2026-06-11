import { test, expect } from '../fixtures/fixtures';

test.describe('Login functionality', () => {
    test('user can login with valid credentials', async ({ loginPage }) => {
        await loginPage.goto();
        await loginPage.login('valid@example.com', 'password123');
    });
    test('user sees error with invalid credentials', async ({ loginPage }) => {
        await loginPage.goto();
        await loginPage.loginWithInvalidCredentials('invalid@example.com', 'wrong');
        await expect(loginPage.errorMessage).toContainText('Incorrect username or password.');
    });
});