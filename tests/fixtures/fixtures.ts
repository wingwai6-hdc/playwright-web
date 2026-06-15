import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export type Credentials = {
    email: string;
    password: string;
};

type MyFixtures = {
    loginPage: LoginPage;
    validCredentials: Credentials;
    invalidCredentials: Credentials;
};

export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    validCredentials: async ({}, use, testInfo) => {
        const email = process.env.TEST_USER_EMAIL;
        const password = process.env.TEST_USER_PASSWORD;

        if (!email || !password) {
            testInfo.skip(true, 'Set TEST_USER_EMAIL and TEST_USER_PASSWORD to run login tests');
        }

        await use({ email, password });
    },
    invalidCredentials: async ({}, use) => {
        await use({
            email: process.env.TEST_INVALID_EMAIL ?? 'invalid@example.com',
            password: process.env.TEST_INVALID_PASSWORD ?? 'wrongpassword',
        });
    },
});
export { expect } from '@playwright/test';