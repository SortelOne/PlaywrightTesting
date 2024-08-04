//Take screenshots and give us a nice log function
const takeScreenshot = async (page, log, name = "screenshot", fullPage = false) => {
  console.log(log ? log : "Taking screenshot...");
  await page.screenshot({ path: `../imgs/${name}.png`, fullPage });
};

export default {
  takeScreenshot,
};
