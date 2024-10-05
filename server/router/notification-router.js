const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth-token");
const notificationController = require("../controllers/notification-controllers");


router
    .route("/createGobalNotification")
    .post(authToken, notificationController.createGobalNotification);

router
    .route("/getGobalNotification")
    .get(authToken, notificationController.getGobalNotification);

router
    .route("/sendNotification")
    .post(authToken, notificationController.sendNotification);

module.exports = router;