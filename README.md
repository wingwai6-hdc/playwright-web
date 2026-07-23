# Playwright Web Project

## Project Structure

The project contains the following main directories and files:

- `tests/` - Test files
- `playwright.config.ts` - Playwright configuration file
- `package.json` - File containing project dependencies and scripts

## Debugging Tips

Here are some useful debugging tips:

- **Run in Headed Mode**: `npx playwright test --headed`
- **Run in UI Mode**: `npx playwright test --ui`
- **Debug a Single Test**: `npx playwright test --debug tests/login.spec.ts`
- **Generate Code**: `npx playwright codegen https://example.com`
- **View Trace**: `npx playwright show-trace test-results/trace.zip`
- **Use test.only**: Isolate a single test during development.
- **Use await page.pause()**: Pause execution and inspect the page.
