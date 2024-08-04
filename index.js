import pw from 'playwright';
import retry from 'async-retry';
import ebayFunctions from './functions/ebayFunctions.js';
import helperFunctions from './functions/helperFunctions.js';

async function main(){
  
}

async function googleReverseImageSearchTest(){

}

async function ebayTesting(){
  const rawLink = "https://www.ebay.com/itm/315444228994?itmmeta=01J4DHPDCQADVCM9FN6G5BP3D1&hash=item4971f0f382:g:lfsAAOSwq-9mby7~&itmprp=enc%3AAQAJAAAAwBELTXXOUL90%2FyrsYOsg7Vx2gh2kBVc3pDyRyed2zSDwGTNEwRTzGCe7qQlpccWN7TSBjq%2BG0R6Kqc9eGf4NbqKcaxXVJljGbnk46MuQXq5POhitBef0%2Fnn%2BOghZr%2BWLqCp9%2BGoNYkEFVcRdUthOygCHHKGqdBlo2dZsR4q2USrbet56Kd3p6q7iv3xxQGj%2BpoCL9AX593R%2BFr88DkP6LlV%2FSV56UDJ9pgNX3aycZarbUsdKoLDElzmWwqIXip0B5w%3D%3D%7Ctkp%3ABk9SR7bW2bGjZA"
  const link = rawLink.split('?')[0];

  if(!link.includes('ebay.com/itm')){
    console.error('Invalid link');
    return;
  }

  console.log('starting...');
  const browser = await pw.chromium.launch(); //The video used connectOverCDP(and put credentials here)
  console.log('Created! Navigating...');

  const page = await browser.newPage();

  try{
    const username = await ebayFunctions.GetEbayUsername(page, link);

    console.log('Seller:', username);
  
    //await ListEbayOtherListings(page, username);
    var userDetails = await ebayFunctions.GetEbayUserDetails(page, username);
    console.log('User Details:', userDetails);
  }
  catch(err){
    //Take a screenshot
    await helperFunctions.takeScreenshot(page, 'Screenshot when we errored out', 'error');
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