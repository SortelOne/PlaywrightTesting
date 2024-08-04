import helperFunctions from "./helperFunctions.js";

//Get the username of the seller (from the listing page)
const GetEbayUsername = async (page, listingLink) => {
  await page.goto(listingLink);
  await helperFunctions.takeScreenshot(page, "Navigated! Scraping username...", "getUsernamePage");

  const username = await page
    .getByTestId("x-sellercard-atf")
    .locator(".x-sellercard-atf__info__about-seller")
    .first()
    .getAttribute("title");

  return username;
};

const ListEbayOtherListings = async (page, username) => {
  await page.goto(`https://www.ebay.com/sch/?_ssn=${username}`);

  var otherListings = await page.getByRole("list").locator("li.s-item").all();

  //I could potentially just return the other listings
  otherListings.forEach(async (listing) => {
    const title = await listing.locator(".s-item__title").innerText();
    console.log("Title:", title);
  });

  await helperFunctions.takeScreenshot(page, "Loaded other listings", "otherListings");
};

const GetEbayUserDetails = async (page, username) => {
  await page.goto(`https://www.ebay.com/usr/${username}?_tab=about`);

  var sellerDetails = await page.locator(
    "section.str-about-description__seller-info"
  );

  var memberSince = await sellerDetails
    .getByText(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/)
    .innerText();
  console.log("Member Since:", memberSince);

  var location = await sellerDetails.locator(".BOLD").first().innerText();
  console.log("Location:", location);

  return {
    memberSince,
    location,
  };
};

export default { 
  GetEbayUsername, 
  ListEbayOtherListings, 
  GetEbayUserDetails
}
