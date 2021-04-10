const puppeeter = require("puppeteer");
/**
 * @type {puppeeter.Browser}
 */
let browser;
async function getProperty(element, selector, content = "textContent") {
  const innerElem = await element.$(selector);
  let innerHandler = await innerElem.getProperty(content);
  return await innerHandler.jsonValue();
}

async function openBrowser() {
  browser = await puppeeter.launch({
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
    headless: true,
  });
}

async function closeBrowser() {
  browser.close();
}

async function query(query, scroll = 20) {
  console.log(`searching for query ${query} with scroll count ${scroll}`);
  const page = await browser.newPage();
  page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36");
  await page.goto("https://twitter.com/hashtag/" + escape(query) + "?f=live", {
    waitUntil: "networkidle2",
  });
  // function waitInSeconds(seconds) {
  //   new Promise((res) => setTimeout(res, seconds * 1000));
  // }
  let total = [];

  for (let i = 0; i < scroll; i++) {
    let articles = await page.$$("article");

    let data = await Promise.all(
      articles.map(async (article) => {
        const nameSelector = "span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0";
        const idSelector = "div.css-1dbjc4n.r-18u37iz.r-1wbh5a2.r-13hce6t > div > span";
        const timeSelector = "time";
        let dataMapping = {
          name: nameSelector,
          id: idSelector,
          text: "div.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-kzbkwu",
        };
        let data = {};

        await Promise.all(
          Object.entries(dataMapping).map(async ([key, value]) => {
            console.log("searching for: " + key);
            try {
              data[key] = await getProperty(article, value);
            } catch {
              console.log("key not found: " + key);
            }
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
