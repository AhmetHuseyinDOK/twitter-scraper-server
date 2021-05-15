const puppeeter = require("puppeteer");
/**
 * @type {puppeeter.Browser}
 */
let browser;

async function openBrowser() {
  browser = await puppeeter.launch({
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
    headless: true,
  });
}

async function closeBrowser() {
  browser.close();
}

async function query(query, count = 20) {
  console.log(`searching for query ${query} with count of ${count}`);
  const page = await browser.newPage();
  page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36");
  await page.setRequestInterception(true);
  page.goto("https://twitter.com/hashtag/" + escape(query) + "?f=live").catch(() => {});

  let data = await new Promise((res, rej) => {
    page.on("request", (req) => {
      let url = req.url();

      if (url.includes("twitter.com/i/api/2/search/adaptive.json")) {
        req.continue({
          url: url.replace("count=20", "count=" + count),
        });
      } else {
        req.continue();
      }
    });

    page.on("requestfinished", async (request) => {
      if (request.url().includes("twitter.com/i/api/2/search/adaptive.json")) {
        const response = await request.response();

        let responseBody;

        if (request.redirectChain().length === 0) {
          // body can only be access for non-redirect responses
          try {
            responseBody = await response.buffer();
          } catch {}
        }
        if (responseBody) {
          res(JSON.parse(responseBody.toString()));
        } else {
          rej();
        }
      }
    });
  });
  page.close();
  let { tweets, users } = data.globalObjects;
  console.log(`---- found: ` + Object.keys(tweets).length);
  return { tweets, users };
}

module.exports = {
  query,
  openBrowser,
  closeBrowser,
};
