const router = require("express").Router();
router.use(require("./user"));
router.get("/", (req, res) => res.json({ message: "welcome to test page" }));
module.exports = router;
