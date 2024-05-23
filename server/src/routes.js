const { Router } = require("express");
const tokens = require("./chain-tokenlist");

const router = Router();

router.get("/tokenlist/:chainId", (req, res, next) => {
  try {
    const parsedChainId = parseInt(req.params.chainId);
    const result = tokens[parsedChainId];
    return res.status(200).json({ result });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
