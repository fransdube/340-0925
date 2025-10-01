from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Navigate to the inventory management page
    page.goto("http://localhost:5000/inv")

    # Select a classification from the list
    classification_list = page.locator("#classificationList")
    expect(classification_list).to_be_visible()
    classification_list.select_option(label="Sport")

    # Wait for the table to be populated with data
    inventory_display = page.locator("#inventoryDisplay")
    # Wait for the first row in the table body to be visible
    expect(inventory_display.locator("tbody tr").first).to_be_visible(timeout=5000)

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/inventory_management.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)