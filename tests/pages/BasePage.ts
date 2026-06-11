import { Page, Locator } from '@playwright/test';
export abstract class BasePage {
    protected page: Page;
    constructor(page: Page) {
        this.page = page;
    }
    async goto(): Promise<void> {
        await this.page.goto(this.url);
    }
    abstract get url(): string;
    // Common elements across all pages
    get header(): Locator {
        return this.page.getByRole('banner');
    }
    get footer(): Locator {
        return this.page.getByRole('contentinfo');
    }
    // Common actions
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }
}