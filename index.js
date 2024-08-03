import pw from 'playwright';
import retry from 'async-retry';

//Helper Functions
//Take screenshots and give us a nice log function
const takeScreenshot = async (page, log, fullPage = false) => {
  console.log(log ? log  : 'Taking screenshot...');
  await page.screenshot({ path: 'screenshot.png', fullPage });
};

async function main(){
  console.log('starting...');
  const browser = await pw.chromium.launch(); //The video used connectOverCDP(and put credentials here)
  console.log('Created! Navigating...');

  const page = await browser.newPage();

  try{
    const link = 'https://www.ebay.com/itm/186608995122';
    await page.goto(link);
    await takeScreenshot(page, 'Navigated! Scraping page content...');

    const username = await page
      .getByTestId('x-sellercard-atf')
      .locator('.x-sellercard-atf__info__about-seller')
      .first()
      .getAttribute('title');

    console.log('Seller:', username);
    //Try to go to other listings, but clicking is being stoopid
    // const accountLink = await page.getByTestId('x-sellercard-atf').getByRole('link', { name: username }).first();
    // accountLink.click();

    await page.goto(`https://www.ebay.com/sch/?_ssn=${username}`);

    var otherListings = await page.getByRole('list', ).locator('li.s-item').all();
    //console.log('Other Listings:', otherListings.length);
    otherListings.forEach(async (listing) => {
      const title = await listing.locator('.s-item__title').innerText();
      console.log('Title:', title);
    });

    await takeScreenshot(page, 'Loaded other listings');
  }
  catch(err){
    //Take a screenshot
    await takeScreenshot(page, 'Screenshot when we errored out');
    console.error('Error:', err);
  }

  await browser.close();
}

await retry(main, {
  retries: 3,
  onRetry: (err) => {
    console.error(err);
  }
})