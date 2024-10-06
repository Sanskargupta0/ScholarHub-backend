const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth-token");
const handelUsersData = require("../controllers/admin-controllers");


router
    .route("/getAllUsers")
    .get(authToken, handelUsersData.getUsersData);

router
    .route("/deleteUser")
    .delete(authToken, handelUsersData.deleteUser);

router
    .route("/updateUser")
    .put(authToken, handelUsersData.updateUser);

module.exports = router;

