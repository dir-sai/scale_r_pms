import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should complete a one-time payment successfully', async ({ page }) => {
    // Navigate to payments page
    await page.goto('/payments/new');
    
    // Fill payment details
    await page.fill('input[name="amount"]', '1000');
    await page.selectOption('select[name="currency"]', 'GHS');
    await page.fill('textarea[name="description"]', 'Rent payment for January 2024');
    
    // Select payment method
    await page.click('button:has-text("Mobile Money")');
    await page.fill('input[name="phone"]', '0201234567');
    await page.selectOption('select[name="provider"]', 'MTN');
    
    // Submit payment
    await page.click('button:has-text("Pay Now")');
    
    // Verify success message
    await expect(page.locator('.payment-success')).toBeVisible();
    await expect(page.locator('.payment-success')).toContainText('Payment successful');
    
    // Verify payment record in history
    await page.goto('/payments/history');
    const latestPayment = page.locator('.payment-record').first();
    await expect(latestPayment).toContainText('GHS 1,000.00');
    await expect(latestPayment).toContainText('Rent payment for January 2024');
    await expect(latestPayment).toContainText('Completed');
  });

  test('should set up recurring payment successfully', async ({ page }) => {
    // Navigate to recurring payments page
    await page.goto('/payments/recurring/new');
    
    // Fill payment details
    await page.fill('input[name="amount"]', '1000');
    await page.selectOption('select[name="currency"]', 'GHS');
    await page.fill('textarea[name="description"]', 'Monthly rent payment');
    
    // Set up recurring schedule
    await page.click('button:has-text("Monthly")');
    await page.fill('input[name="startDate"]', '2024-01-01');
    await page.fill('input[name="totalPayments"]', '12');
    
    // Select payment method
    await page.click('button:has-text("Mobile Money")');
    await page.fill('input[name="phone"]', '0201234567');
    await page.selectOption('select[name="provider"]', 'MTN');
    
    // Submit recurring payment setup
    await page.click('button:has-text("Set Up Recurring Payment")');
    
    // Verify success message
    await expect(page.locator('.setup-success')).toBeVisible();
    await expect(page.locator('.setup-success')).toContainText('Recurring payment set up successfully');
    
    // Verify recurring payment in list
    await page.goto('/payments/recurring');
    const latestRecurring = page.locator('.recurring-payment').first();
    await expect(latestRecurring).toContainText('GHS 1,000.00');
    await expect(latestRecurring).toContainText('Monthly rent payment');
    await expect(latestRecurring).toContainText('Monthly');
    await expect(latestRecurring).toContainText('Active');
  });

  test('should handle payment failure gracefully', async ({ page }) => {
    // Navigate to payments page
    await page.goto('/payments/new');
    
    // Fill payment details with test failure amount
    await page.fill('input[name="amount"]', '999'); // Test amount that triggers failure
    await page.selectOption('select[name="currency"]', 'GHS');
    await page.fill('textarea[name="description"]', 'Failed payment test');
    
    // Select payment method
    await page.click('button:has-text("Mobile Money")');
    await page.fill('input[name="phone"]', '0201234567');
    await page.selectOption('select[name="provider"]', 'MTN');
    
    // Submit payment
    await page.click('button:has-text("Pay Now")');
    
    // Verify error message
    await expect(page.locator('.payment-error')).toBeVisible();
    await expect(page.locator('.payment-error')).toContainText('Payment failed');
    
    // Verify payment not in history
    await page.goto('/payments/history');
    await expect(page.locator('text=Failed payment test')).not.toBeVisible();
  });
}); 