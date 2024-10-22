const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth-token");
const semesterController = require("../controllers/semester-controllers");

router
    .route("/getSemesters")
    .get(authToken, semesterController.getSemesters);

router
    .route("/getSemester")
    .post(authToken, semesterController.getFilteredSemesters);

router
    .route("/createSemester")
    .post(authToken, semesterController.createSemester);

router
    .route("/updateSemester")
    .put(authToken, semesterController.updateSemester);

router
    .route("/updateSemesterKey")
    .put(authToken, semesterController.updateSemesterKey);

router
    .route("/deleteSemester")
    .post(authToken, semesterController.deleteSemester);

module.exports = router;