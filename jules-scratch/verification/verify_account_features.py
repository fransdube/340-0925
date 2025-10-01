from playwright.sync_api import sync_playwright, Page, expect
import re
import random
import string

def get_random_string(length):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        random_email = f"client.user.{get_random_string(5)}@test.com"

        # 1. Arrange: Go to the registration page.
        page.goto("http://localhost:5000/account/register")

        # 2. Act: Register a new "Client" user.
        page.fill("input[name='account_firstname']", "Client")
        page.fill("input[name='account_lastname']", "User")
        page.fill("input[name='account_email']", random_email)
        page.fill("input[name='account_password']", "Password123!")
        page.click("button[type='submit']")

        # 3. Assert: Check that the login form is now displayed.
        expect(page.get_by_role("heading", name="Login")).to_be_visible()

        # 4. Act: Log in as the new user.
        page.fill("input[name='account_email']", random_email)
        page.fill("input[name='account_password']", "Password123!")
        page.click("button[type='submit']")

        # 5. Assert: Verify the header and account management page.
        expect(page).to_have_url(re.compile(".*account"))
        expect(page.get_by_role("link", name=re.compile("Welcome Client"))).to_be_visible()
        expect(page.get_by_role("link", name="Logout")).to_be_visible()
        expect(page.get_by_role("link", name="Update Account Information")).to_be_visible()
        expect(page.get_by_role("heading", name="Inventory Management")).not_to_be_visible()

        # 6. Screenshot: Capture the final result for visual verification.
        page.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    main()