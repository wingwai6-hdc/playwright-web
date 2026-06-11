import { Page, Locator } from '@playwright/test';
export class Modal {
    private page: Page;
    private container: Locator;
    constructor(page: Page) {
        this.page = page;
        this.container = page.getByRole('dialog');
    }
    get title(): Locator {
        return this.container.getByRole('heading');
    }
    get closeButton(): Locator {
        return this.container.getByRole('button', { name: 'Close' });
    }
    get confirmButton(): Locator {
        return this.container.getByRole('button', { name: 'Confirm' });
    }
    get cancelButton(): Locator {
        return this.container.getByRole('button', { name: 'Cancel' });
    }
    async close(): Promise<void> {
        await this.closeButton.click();
    }
    async confirm(): Promise<void> {
        await this.confirmButton.click();
    }
}