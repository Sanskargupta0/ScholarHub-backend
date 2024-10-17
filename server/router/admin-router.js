const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth-token");
const handelUsersData = require("../controllers/admin-controllers");
const notificationData = require("../controllers/notification-controllers");


router
    .route("/getAllUsers")
    .post(authToken, handelUsersData.getUsersData);

router
    .route("/deleteUser")
    .post(authToken, handelUsersData.deleteUser);

router
    .route("/updateUser")
    .put(authToken, handelUsersData.updateUser);

router
    .route("/getUserNotifications")
    .post(authToken, notificationData.getUserSpecificNotification);

module.exports = router;

