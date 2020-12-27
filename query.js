const puppeeter = require("puppeteer");
let browser;
async function getProperty(element, selector, content = "textContent") {
  const innerElem = await element.$(selector);
  let innerHandler = await innerElem.getProperty(content);
  return await innerHandler.jsonValue();
}

async function openBrowser() {
  browser = await puppeeter.launch({
    defaultViewport: {
      height: 2000,
      width: 1500,
    },
    headless: false,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
  });
}

async function closeBrowser() {
  browser.close();
}

async function query(query, scroll = 20) {
  const page = await browser.newPage();
  await page.goto("https://twitter.com/hashtag/" + escape(query) + "?f=live", { waitUntil: "networkidle2" });

  // function waitInSeconds(seconds) {
  //   new Promise((res) => setTimeout(res, seconds * 1000));
  // }
  let total = [];

  for (let i = 0; i < scroll; i++) {
    let articles = await page.$$("article");

    let data = await Promise.all(
      articles.map(async (article) => {
        const nameSelector = "div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-dnmrzs";
        const idSelector = "div.css-1dbjc4n.r-18u37iz.r-1wbh5a2.r-1f6r7vd";
        const timeSelector = "time";
        let dataMapping = {
          name: nameSelector,
          id: idSelector,
          text: "div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1mi0q7o > div:nth-child(2)",
        };
        let data = {};

        await Promise.all(
          Object.entries(dataMapping).map(async ([key, value]) => {
            data[key] = await getProperty(article, value);
          })
        );

        const timeElement = await article.$(timeSelector);
        if (timeElement) {
          data["time"] = await timeElement.evaluate((element) => {
            return element.getAttribute("datetime");
          });
        }

        return data;
      })
    );

    for (const tweet of data) {
      if (total.find((item) => item.text == tweet.text)) {
        continue;
      }

      total.push(tweet);
    }

    await page.evaluate(async () => {
      window.scrollBy(0, 500);
    });
  }

  page.close();
  return total;
}

module.exports = {
  query,
  openBrowser,
  closeBrowser,
};
