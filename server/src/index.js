const express = require("express");
const router = require("./routes");

const app = express();
const port = parseInt(process.env.PORT || "7750");

app.use(require("morgan")("combined"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/", router);

app.listen(port, () => console.info("Server running on %d", port));
