
import { test, expect } from '@playwright/test';

test('check for console errors', async ({ page }) => {
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });

  await page.goto('http://localhost:8000/simulation.html');
  await page.waitForTimeout(2000); // Wait for animations and scripts to run

  console.log('--- Captured Console Messages ---');
  consoleMessages.forEach(msg => {
    console.log(`[${msg.type.toUpperCase()}] ${msg.text}`);
  });
  console.log('---------------------------------');

  const errors = consoleMessages.filter(msg => msg.type === 'error');
  expect(errors.length).toBe(0);
});
