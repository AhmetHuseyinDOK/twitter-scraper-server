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

async function query(query, scroll = 20) {
  console.log(`searching for query ${query} with scroll count ${scroll}`);
  const page = await browser.newPage();
  page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36");
  await page.setRequestInterception(true);
  page.goto("https://twitter.com/hashtag/" + escape(query) + "?f=live").catch(() => {});
  let data = await new Promise((res, rej) => {
    page.on("request", (req) => req.continue());
    page.on("requestfinished", async (request) => {
      const response = await request.response();

      const responseHeaders = response.headers();
      let responseBody;
      if (request.redirectChain().length === 0) {
        // body can only be access for non-redirect responses
        try {
          responseBody = await response.buffer();
        } catch {}
      }

      const information = {
        url: request.url(),
        requestHeaders: request.headers(),
        requestPostData: request.postData(),
        responseHeaders: responseHeaders,
        responseSize: responseHeaders["content-length"],
        responseBody,
      };

      if (information.url.includes("twitter.com/i/api/2/search/adaptive.json")) {
        res(JSON.parse(information.responseBody.toString()));
      }
    });
  });
  page.close();
  let { tweets, users } = data.globalObjects;
  return { tweets, users };
}

module.exports = {
  query,
  openBrowser,
  closeBrowser,
};
