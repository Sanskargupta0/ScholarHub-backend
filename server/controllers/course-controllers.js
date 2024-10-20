const Course = require("../models/Course");
const Semester = require("../models/Semester");
const Paper = require("../models/Paper");

const createCourse = async (req, res) => {
  try {
    const user = req.user;
    const { courseCode, courseName } = req.body;
    if (!user.isAdmin) {
      return res
        .status(401)
        .json({ msg: "Unauthorized HTTP, Admin access only" });
    } else if (!courseCode || !courseName) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }
    const course = await Course.create({ courseCode, courseName });
    if (course) {
      return res.status(201).json({ msg: "Course created successfully", course });
    } else {
      return res.status(400).json({ msg: "Course not created" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const user = req.user;
    const { courseCode, courseName, id } = req.body;
    if (!user.isAdmin) {
      return res
        .status(401)
        .json({ msg: "Unauthorized HTTP, Admin access only" });
    } else if ((!courseCode || !courseName, !id)) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }
    const course = await Course.findByIdAndUpdate(id);
    course.courseCode = courseCode;
    course.courseName = courseName;
    const update = await course.save();
    if (update) {
      return res.status(200).json({ msg: "Course updated successfully" });
    } else {
      return res.status(400).json({ msg: "Course not updated" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.body;
    if (!user.isAdmin) {
      return res
        .status(401)
        .json({ msg: "Unauthorized HTTP, Admin access only" });
    }
    const paper = await Paper.findOne({ courseId: id });
    if (paper) {
      return res
        .status(400)
        .json({ msg: "Course cannot be deleted, it is linked to a paper" });
    }
    const semester = await Semester.findOne({ courseId: id });
    if (semester) {
      return res
        .status(400)
        .json({ msg: "Course cannot be deleted, it is linked to a semester" });
    }
    const course = await Course.findByIdAndDelete(id);
    if (course) {
      return res.status(200).json({ msg: "Course deleted successfully" });
    } else {
      return res.status(400).json({ msg: "Course not deleted" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    if (courses) {
      return res.status(200).json({ courses });
    } else {
      return res.status(400).json({ msg: "Courses not found" });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const getFilteredCourses = async (req, res) => {
  try {
    const user = req.user;
    let { filterdata } = req.body;
    const { perPage = 10, page = 1 } = req.query;
    const perPageNo = Math.max(parseInt(perPage), 1);
    const pageNo = Math.max(parseInt(page), 1);

    if (!user.isAdmin) {
      return res
        .status(401)
        .json({ msg: "Unauthorized HTTP, Admin access only" });
    }
    if (filterdata) {
      const courseName = filterdata.courseName || "";
      const courseCode = filterdata.courseCode || "";
      let query = {};
      if(courseName) {
        query.courseName = courseName;
      }
      if(courseCode) {
        query.courseCode = courseCode;
      }
      const totalCourses = await Course.countDocuments(query);
      if (totalCourses === 0) {
        return res.status(200).json({
          courses: [],
          totalCourses: 0,
          msg: "No courses found matching the filter criteria.",
        });
      }

      const maxPageNo = Math.ceil(totalCourses / perPageNo);
      const adjustedPageNo = Math.min(pageNo, maxPageNo);

      const courses = await Course.find(query)
        .limit(perPageNo)
        .skip((adjustedPageNo - 1) * perPageNo);
      res.status(200).json({ courses, totalCourses });
    } else {
      const totalCourses = await Course.countDocuments();
      if (totalCourses === 0) {
        return res.status(200).json({
          courses: [],
          totalCourses: 0,
          msg: "No courses found matching the filter criteria.",
        });
      }

      const maxPageNo = Math.ceil(totalCourses / perPageNo);
      const adjustedPageNo = Math.min(pageNo, maxPageNo);

      const courses = await Course.find()
        .limit(perPageNo)
        .skip((adjustedPageNo - 1) * perPageNo);
      res.status(200).json({ courses, totalCourses });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  getFilteredCourses,
};
