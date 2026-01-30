import time
import random
from bs4 import BeautifulSoup
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from app.models import Site, Journal
from django.utils.text import slugify

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"  # Adjust if needed

# Optional proxy list
PROXIES = [
    "http://185.199.229.156:7492",
    "http://185.199.228.218:7300"
]

def setup_browser():
    print("🚀 Launching Chrome...")
    options = uc.ChromeOptions()
    options.headless = False  # Set False if you want to debug visually
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--disable-blink-features=AutomationControlled')
    options.add_argument('--start-maximized')
    options.binary_location = CHROME_PATH
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")


    # Optional: Use proxy
    if PROXIES:
        proxy = random.choice(PROXIES)
        options.add_argument(f'--proxy-server={proxy}')

    # Fast, subprocess-based launch
    driver = uc.Chrome(options=options, use_subprocess=True)
    print("✅ Chrome launched.")
    return driver


def scrape_science_direct():
    driver = setup_browser()
    url = "https://www.sciencedirect.com/browse/journals-and-books?contentType=JL&subject=chemical-engineering"
    driver.get(url)

    # Wait with retry mechanism
    print("🔄 Waiting for journal entries to load...")
    retries = 3
    for attempt in range(retries):
        try:
            WebDriverWait(driver, 30).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "li.publication"))
            )
            print(f"✅ Page loaded on attempt {attempt + 1}")
            break
        except Exception:
            print(f"⚠️ Attempt {attempt + 1} failed, retrying...")
            time.sleep(5)
    else:
        print("❌ Timed out waiting for journal list to load.")
        with open("science_direct_debug.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
        driver.save_screenshot("screenshot.png")
        driver.quit()
        return {"added": 0, "skipped": 0}

    site, _ = Site.objects.get_or_create(
        site_name="ScienceDirect",
        defaults={"site_link": "https://www.sciencedirect.com"}
    )
    added = skipped = 0

    while True:
        html = driver.execute_script("return document.body.innerHTML")
        soup = BeautifulSoup(html, "html.parser")
        items = soup.select("a.js-publication-title")

        print("🔍 Journals found on page:", len(items))
        if not items:
            print("⚠️ No journal items found. Ending loop.")
            break

        for i, anchor in enumerate(items, start=1):
            title = anchor.get_text(strip=True)
            href = anchor.get("href", "")
            link = "https://www.sciencedirect.com" + href
            journal_id = slugify(title)

            if not Journal.objects.filter(journal_link=link).exists():
                Journal.objects.create(
                    journal_id=journal_id,
                    journal_name=title,
                    journal_link=link,
                    site_name=site
                )
                print(f"➕ Added {i}: {title}")
                added += 1
            else:
                skipped += 1

        # Handle pagination
        try:
            next_btn = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[aria-label="Next page"]:not([disabled])'))
            )
            next_btn.click()
            time.sleep(3)  # slight delay for content reload
        except Exception:
            print("✅ Finished scraping all pages.")
            break

    driver.quit()
    return {"added": added, "skipped": skipped}
