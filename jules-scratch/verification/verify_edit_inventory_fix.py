from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the edit view for a specific vehicle (ID 1)
    page.goto("http://localhost:5000/inv/edit/1")

    # Check that the heading is correct and contains the vehicle name
    expect(page.locator("h1")).to_contain_text("Edit")
    expect(page.locator("h1")).to_contain_text("Chevy Camaro")

    # Check that the form fields are populated with the correct data
    expect(page.locator("#inv_make")).to_have_value("Chevy")
    expect(page.locator("#inv_model")).to_have_value("Camaro")

    # Verify the submit button is initially disabled
    expect(page.locator('button[type="submit"]')).to_be_disabled()

    # Take a screenshot to confirm the view renders correctly
    page.screenshot(path="jules-scratch/verification/edit-inventory-fix-verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)