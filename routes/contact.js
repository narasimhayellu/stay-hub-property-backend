const express = require("express");
const { sendMessage } = require("../controllers/contactControllers");

const router = express.Router();

router.post("/send-message", sendMessage);

module.exports = router