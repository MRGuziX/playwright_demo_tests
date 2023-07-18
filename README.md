## Commands
- check `NodeJS` version  
  `node -v`
- new project with Playwright  
  `npm init playwright@latest`
- record tests for given site  
  `npx playwright codegen https://demo-bank.vercel.app/`
- run tests without browser GUI  
  `npx playwright test`
- run tests with browser GUI  
  `npx playwright test --headed`
- view report  
  `npx playwright show-report`

## Playwright Config modifications
- config file `playwright.config.ts`
- disable browsers, i.e. Firefox
    ```javascript
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // },
    ```
  
## Playwright snippets
- running one test: `test.only`
- creating Test Suite:
```javascript
  test.describe(' [ test suite name ] ',() => {   
  
  });
```
- test:
```javascript
  test(' [ test name ] ',() => {   
  
  });
```