const { createServer } = require("https");
const { parse } = require("url");
const { readFileSync } = require("fs");
const next = require("next");

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(
    {
      key: readFileSync("./localhost-key.pem"),
      cert: readFileSync("./localhost.pem"),
    },
    (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }
  ).listen(3000, (err) => {
    if (err) throw err;
    console.log("Ready on https://localhost:3000");
  });
});
