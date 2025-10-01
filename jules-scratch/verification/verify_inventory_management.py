from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    """
    This function runs the verification steps for the inventory management page.
    """
    browser = playwright.chromium.launch()
    page = browser.new_page()

    print("Starting verification script...")

    # 1. Arrange: Go to the inventory management page.
    print("Navigating to http://localhost:3000/inv...")
    try:
        page.goto("http://localhost:3000/inv", wait_until="networkidle", timeout=15000)
        print("Navigation successful.")
    except Exception as e:
        print(f"ERROR: Navigation failed: {e}")
        browser.close()
        return

    # 2. Assert: Check that the heading and classification list are present.
    print("Checking for 'Manage Inventory' heading...")
    try:
        expect(page.get_by_role("heading", name="Manage Inventory")).to_be_visible(timeout=5000)
        print("Heading is visible.")
    except Exception as e:
        print(f"ERROR: Failed to find heading: {e}")
        browser.close()
        return

    print("Checking for classification list...")
    try:
        expect(page.locator("#classificationList")).to_be_visible(timeout=5000)
        print("Classification list is visible.")
    except Exception as e:
        print(f"ERROR: Failed to find classification list: {e}")
        browser.close()
        return

    # 3. Act: Select a classification.
    print("Selecting classification 'Sport' (value 2)...")
    try:
        page.select_option("#classificationList", "2")
        print("Classification selected.")
    except Exception as e:
        print(f"ERROR: Failed to select classification: {e}")
        browser.close()
        return

    # 4. Assert: Check that the inventory table is populated.
    print("Waiting for inventory table to be populated...")
    try:
        inventory_table_body = page.locator("#inventoryDisplay tbody")
        expect(inventory_table_body.locator("tr").first).to_be_visible(timeout=10000)
        print("Inventory table is populated.")
    except Exception as e:
        print(f"ERROR: Inventory table did not populate: {e}")
        print("----------------- PAGE CONTENT ON FAILURE -----------------")
        print(page.content())
        print("---------------------------------------------------------")
        browser.close()
        return

    # 5. Screenshot: Capture the final result for visual verification.
    print("Taking screenshot...")
    try:
        page.screenshot(path="jules-scratch/verification/verification.png")
        print("Screenshot taken successfully.")
    except Exception as e:
        print(f"ERROR: Failed to take screenshot: {e}")

    browser.close()
    print("Verification script finished.")

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run_verification(playwright)