import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    get url(): string {
        return '/login';
    }

    get emailInput(): Locator {
        return this.page.getByLabel('Email address');
    }
    get passwordInput(): Locator {
        return this.page.getByLabel('Password');
    }
    get submitButton(): Locator {
        return this.page.getByRole('button', { name: 'Sign in' });
    }
    get errorMessage(): Locator {
        return this.page.getByRole('alert');
    }
    get forgotPasswordLink(): Locator {
        return this.page.getByRole('link', { name: 'Forgot password?' });
    }

    // Actions
    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    async loginWithInvalidCredentials(email: string, password: string): Promise<void> {
        await this.login(email, password);
        await expect(this.errorMessage).toBeVisible();
    }
}