from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the edit view for a specific vehicle
    # Using a known inventory ID, for example, '1'
    page.goto("http://localhost:5000/inv/edit/1")

    # Check that the heading is correct
    expect(page.locator("h1")).to_contain_text("Edit")

    # Check that the form is populated
    # We expect the 'Make' input to have a value.
    expect(page.locator("#inv_make")).not_to_be_empty()

    # Check that the submit button is disabled initially
    expect(page.locator('button[type="submit"]')).to_be_disabled()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/edit-inventory-view.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)