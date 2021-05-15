const express = require("express");
const { query, openBrowser } = require("./query");
const app = express();
const config = require("./config");
app.get("/", (req, res) => {
  res.send("Hello, I am twitter bot developed by Ahmet Huseyin DOK with LOVE");
});

app.get("/query", async (req, res) => {
  let data = await query(req.query.query, req.query.count);
  res.send(data);
});
console.log("starting server...");
console.log("opening browser");
openBrowser().then(() => {
  console.log("browser is open");
  app.listen(config.port, config.host, () => {
    console.log(`app is ready on http://${config.host}:${config.port}`);
  });
});
