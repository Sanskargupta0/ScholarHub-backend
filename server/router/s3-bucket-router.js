const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth-token");
const s3BucketController = require("../controllers/aws-s3-bucket-controllers");


router
    .route("/upload")
    .post(authToken, s3BucketController.createUploadURL);

router
    .route("/view")
    .post(authToken, s3BucketController.getViewURL);


module.exports = router;