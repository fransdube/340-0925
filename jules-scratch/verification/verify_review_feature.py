import time
from playwright.sync_api import sync_playwright, Page, expect

def run(page: Page):
    # Use a unique email for each run to avoid registration conflicts
    email = f"test.user.{int(time.time())}@example.com"

    # Go to registration page and register a new user
    page.goto("http://localhost:5000/account/register")
    page.get_by_label("First Name:").fill("Test")
    page.get_by_label("Last Name:").fill("User")
    page.get_by_label("Email:").fill(email)
    page.get_by_label("Password:").fill("Password123!")
    page.get_by_role("button", name="Register").click()

    # After registration, the login view is rendered.
    # Verify we are on the login form by checking for the heading.
    expect(page.get_by_role("heading", name="Login")).to_be_visible()

    # Log in with the new credentials.
    page.get_by_label("Email:").fill(email)
    page.get_by_label("Password:").fill("Password123!")
    page.get_by_role("button", name="Login").click()

    # After login, we should be redirected to the account management page.
    expect(page).to_have_url("http://localhost:5000/account/")

    # Navigate to a vehicle detail page
    page.goto("http://localhost:5000/inv/detail/1")
    expect(page).to_have_url("http://localhost:5000/inv/detail/1")

    # Add a review
    review_text = "This is a test review. The car is great!"
    # Wait for the review form to be visible before interacting with it
    expect(page.locator("form[action='/review/add']")).to_be_visible()
    page.locator("textarea[name='review_text']").fill(review_text)
    page.get_by_role("button", name="Submit Review").click()

    # After submitting the review, we should be redirected back to the detail page.
    # Verify that the review was added successfully.
    expect(page).to_have_url("http://localhost:5000/inv/detail/1")
    expect(page.locator("#reviews-list")).to_contain_text(review_text)

    # Take a screenshot for visual verification.
    page.screenshot(path="jules-scratch/verification/verification.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    run(page)
    browser.close()