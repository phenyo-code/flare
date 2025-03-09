const { createServer } = require("https");
const { parse } = require("url");
const { readFileSync } = require("fs");
const next = require("next");

const port = 3000;
const app = next({ dev: true, hostname: "0.0.0.0", port });
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
  ).listen(port, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`Ready on https://localhost:${port}`);
    console.log(`Also accessible on your network at https://<your-local-ip>:${port}`);
  });
});