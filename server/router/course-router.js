const express = require("express");
const router = express.Router();
const authToken = require("../middleware/auth-token");
const courseData = require("../controllers/course-controllers");


router
    .route("/getCourses")
    .get(authToken, courseData.getCourses);

router
    .route("/getCourse")
    .post(authToken, courseData.getFilteredCourses);

router
    .route("/createCourse")
    .post(authToken, courseData.createCourse);

router
    .route("/updateCourse")
    .put(authToken, courseData.updateCourse);

router
    .route("/deleteCourse")
    .post(authToken, courseData.deleteCourse);


module.exports = router;