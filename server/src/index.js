const express = require("express");
const router = require("./routes");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();
const port = parseInt(process.env.PORT || "7750");
const httpsPort = parseInt(process.env.HTTPS_PORT || "8811");

app.use(require("morgan")("combined"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/", router);

const serverOpts = {
  key: fs.readFileSync(path.join(__dirname, "./ssl/local.key")),
  cert: fs.readFileSync(path.join(__dirname, "./ssl/local.crt"))
};

const httpsServer = https.createServer(serverOpts, app);

app.listen(port, () => console.info("Server running on %d", port));
httpsServer.listen(httpsPort, "0.0.0.0", () => console.info("HTTPs server running on %d", httpsPort));
