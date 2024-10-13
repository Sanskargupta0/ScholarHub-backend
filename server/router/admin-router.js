const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth-token");
const handelUsersData = require("../controllers/admin-controllers");


router
    .route("/getAllUsers")
    .post(authToken, handelUsersData.getUsersData);

router
    .route("/deleteUser")
    .post(authToken, handelUsersData.deleteUser);

router
    .route("/updateUser")
    .put(authToken, handelUsersData.updateUser);

module.exports = router;

