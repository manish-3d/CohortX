const router = require("express").Router();

const { zoomWebhook } = require("../controllers/webhookController");

router.post("/zoom", zoomWebhook);

module.exports = router;
