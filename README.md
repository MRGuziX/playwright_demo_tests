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
- run Trace Viewer on ZIP file while being in a folder with this ZIP:  
  `npx playwright show-trace trace.zip`

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

  ## Package.json modifications

- config file `package.json`  
  'npm' instead of npx when you want to run script within other script
  ```json
  {
    "scripts": {
      "test": "npx playwright test",
      "test:headed": "npx playwright test --headed",
      "test:pulpit:headed": "npm run test tests/pulpit.spec.ts -- --headed"
    }
  }
  ```

## Playwright snippets

- running one test: `test.only`
- creating Test Suite:

```javascript
test.describe(' [ test suite name ] ', () => {});
```

- test:

```javascript
test(' [ test name ] ', () => {});
```
