from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:5500/inv")

    # Select the "Sport" classification (value is '2')
    page.select_option("#classificationList", "2")

    # Wait for the table to be populated
    expect(page.locator("#inventoryDisplay tbody tr")).to_have_count(3, timeout=5000)

    page.screenshot(path="jules-scratch/verification/inventory_verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)